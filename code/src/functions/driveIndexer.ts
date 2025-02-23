// src/functions/driveIndexer.ts

import { google, drive_v3 } from 'googleapis';
import { FunctionContext, FunctionResponse } from '../types';
import { GaxiosResponse } from 'gaxios';

/**
 * Example environment-driven rule sets:
 * GREENLIST_FOLDER_IDS: "folderId1,folderId2"
 * REDLIST_FOLDER_IDS: "folderId3,folderId4"
 * REDLIST_FILENAME_PATTERNS: "confidential, top secret"
 */
const GREENLIST_FOLDER_IDS = process.env.GREENLIST_FOLDER_IDS
  ? process.env.GREENLIST_FOLDER_IDS.split(',')
  : [];
const REDLIST_FOLDER_IDS = process.env.REDLIST_FOLDER_IDS
  ? process.env.REDLIST_FOLDER_IDS.split(',')
  : [];
const REDLIST_FILENAME_PATTERNS = process.env.REDLIST_FILENAME_PATTERNS
  ? process.env.REDLIST_FILENAME_PATTERNS.split(',')
  : [];

/**
 * A simple in-memory index to store Google Drive file metadata.
 * Key = file ID, Value = file metadata.
 * In production, replace this with a proper DB or search engine.
 */
const driveIndex: Record<string, drive_v3.Schema$File> = {};

/**
 * The page token used by the "changes" API to fetch incremental updates.
 * After an initial index, we store the startPageToken from Drive.
 */
let nextPageToken: string | null = null;

/**
 * Returns an authenticated Google Drive client.
 * Make sure your .env has GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY set.
 */
function getDriveClient(): drive_v3.Drive {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive.metadata.readonly'],
  });
  return google.drive({ version: 'v3', auth });
}

/** 
 * Function to check if a file passes the greenlist/redlist rules.
 * Adjust logic as needed (folders, filename patterns, mime types, etc.)
 */
function shouldIndexFile(file: drive_v3.Schema$File): boolean {
  // If there's a greenlist of folders, only index files whose parents intersect
  if (GREENLIST_FOLDER_IDS.length > 0) {
    const hasGreenlistedParent = file.parents?.some((parent) =>
      GREENLIST_FOLDER_IDS.includes(parent)
    );
    if (!hasGreenlistedParent) {
      return false;
    }
  }

  // If any parent is in the redlist, exclude
  if (REDLIST_FOLDER_IDS.length > 0) {
    const hasRedlistedParent = file.parents?.some((parent) =>
      REDLIST_FOLDER_IDS.includes(parent)
    );
    if (hasRedlistedParent) {
      return false;
    }
  }

  // Check file name patterns (e.g., "confidential")
  if (REDLIST_FILENAME_PATTERNS.length > 0 && file.name) {
    const lowerName = file.name.toLowerCase();
    const isNameRedlisted = REDLIST_FILENAME_PATTERNS.some((pattern) =>
      lowerName.includes(pattern.trim().toLowerCase())
    );
    if (isNameRedlisted) {
      return false;
    }
  }

  // Additional checks (mimeType, owners, etc.) can be added here

  // Passed all checks
  return true;
}

/**
 * 1) initialIndexDrive:
 *    - Clears the local index.
 *    - Fetches all files from Drive (paginated).
 *    - Stores them in the in-memory `driveIndex`, if they pass `shouldIndexFile`.
 *    - Retrieves a startPageToken for incremental updates.
 */
export async function initialIndexDrive(
  context: FunctionContext
): Promise<FunctionResponse> {
  try {
    const drive = getDriveClient();

    // Clear existing in-memory index
    Object.keys(driveIndex).forEach((key) => delete driveIndex[key]);

    let pageToken: string | undefined;

    // Paginate through all files
    do {
      const res: GaxiosResponse<drive_v3.Schema$FileList> = await drive.files.list({
        pageSize: 100,
        pageToken,
        fields: 'nextPageToken, files(id, name, mimeType, permissions, modifiedTime, parents)',
      });

      const fileList = res.data;
      const files: drive_v3.Schema$File[] = fileList.files || [];

      // Only add files that pass the rules
      files.forEach((file) => {
        if (file.id && shouldIndexFile(file)) {
          driveIndex[file.id] = file;
        }
      });

      pageToken = fileList.nextPageToken || undefined;
    } while (pageToken);

    // Get a start page token for incremental updates
    const tokenRes = await drive.changes.getStartPageToken({});
    nextPageToken = tokenRes.data.startPageToken || null;

    return {
      status: 'success',
      data: {
        message: 'Initial Drive index created successfully.',
        indexedFileCount: Object.keys(driveIndex).length,
        nextPageToken,
      },
    };
  } catch (error: any) {
    console.error('Error in initialIndexDrive:', error);
    return {
      status: 'error',
      message: error.message,
    };
  }
}

/**
 * 2) incrementalUpdateDriveIndex:
 *    - Uses the Drive "changes" API to fetch modifications since the last startPageToken.
 *    - If a file passes `shouldIndexFile`, we add/update it. If not, remove it.
 *    - Also removes any file that the user removed or trashed in Drive.
 */
export async function incrementalUpdateDriveIndex(
  context: FunctionContext
): Promise<FunctionResponse> {
  try {
    if (!nextPageToken) {
      throw new Error('No startPageToken found. Run initialIndexDrive first.');
    }

    const drive = getDriveClient();
    let pageToken: string | undefined = nextPageToken;

    let changedFilesCount = 0;
    let removedFilesCount = 0;

    // Keep looping until no more changes pages
    while (pageToken) {
      const changeRes: GaxiosResponse<drive_v3.Schema$ChangeList> = await drive.changes.list({
        pageToken,
        fields: 'newStartPageToken, nextPageToken, changes(file, fileId, removed)',
      });

      const changeData = changeRes.data;
      const changes = changeData.changes || [];

      for (const change of changes) {
        // If file removed or missing, remove it from index
        if (change.removed || !change.file) {
          if (change.fileId && driveIndex[change.fileId]) {
            delete driveIndex[change.fileId];
            removedFilesCount++;
          }
        } else {
          // Otherwise, newly added or updated
          if (change.file.id) {
            // Check if it passes the updated rules
            if (shouldIndexFile(change.file)) {
              driveIndex[change.file.id] = change.file;
              changedFilesCount++;
            } else {
              // If it fails the rules but was previously in the index, remove it
              if (driveIndex[change.file.id]) {
                delete driveIndex[change.file.id];
                removedFilesCount++;
              }
            }
          }
        }
      }

      // Move to the next page of changes or finalize
      if (changeData.nextPageToken) {
        pageToken = changeData.nextPageToken;
      } else {
        if (changeData.newStartPageToken) {
          nextPageToken = changeData.newStartPageToken;
        }
        pageToken = undefined;
      }
    }

    return {
      status: 'success',
      data: {
        message: 'Incremental update applied successfully.',
        changedFilesCount,
        removedFilesCount,
        nextPageToken,
      },
    };
  } catch (error: any) {
    console.error('Error in incrementalUpdateDriveIndex:', error);
    return {
      status: 'error',
      message: error.message,
    };
  }
}

/**
 * 3) searchDriveIndex:
 *    - Naive case-insensitive substring search on file name (metadata only).
 *    - Returns ID, name, and MIME type.
 *    - No file content is indexed or searched.
 */
export async function searchDriveIndex(
  context: FunctionContext
): Promise<FunctionResponse> {
  try {
    const queryTerm = context.input?.query || '';
    if (!queryTerm) {
      throw new Error('No search query provided.');
    }

    // Filter the in-memory index by file name
    const results = Object.values(driveIndex).filter((file) => {
      const name = file.name?.toLowerCase() || '';
      return name.includes(queryTerm.toLowerCase());
    });

    // Return minimal metadata fields
    const shapedResults = results.map((file) => ({
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
    }));

    return {
      status: 'success',
      data: {
        count: shapedResults.length,
        results: shapedResults,
      },
    };
  } catch (error: any) {
    console.error('Error in searchDriveIndex:', error);
    return {
      status: 'error',
      message: error.message,
    };
  }
}
