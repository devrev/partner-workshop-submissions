// src/functions/federatedSearch.ts

import { google, drive_v3 } from 'googleapis';
import { FunctionContext, FunctionResponse } from '../types';

/**
 * Example environment-driven rule sets:
 *   GREENLIST_FOLDER_IDS = "folderId1,folderId2"
 *   REDLIST_FOLDER_IDS    = "folderId3,folderId4"
 *   REDLIST_FILENAME_PATTERNS = "confidential, top secret"
 *
 * In your .env file, for example:
 *   GREENLIST_FOLDER_IDS=abc123,def456
 *   REDLIST_FOLDER_IDS=ghi789
 *   REDLIST_FILENAME_PATTERNS=confidential,private
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
 * Determines if a given file from Google Drive should appear
 * based on organizational policy (greenlist/redlist).
 * You can expand this with mimeType checks, owners, etc.
 */
function shouldIndexFile(file: drive_v3.Schema$File): boolean {
  // 1) If we have a greenlist, allow only files in those folder IDs
  if (GREENLIST_FOLDER_IDS.length > 0) {
    const hasGreenlistedParent = file.parents?.some((parent) =>
      GREENLIST_FOLDER_IDS.includes(parent)
    );
    if (!hasGreenlistedParent) return false;
  }

  // 2) If a file's parent is in the redlist, exclude it
  if (REDLIST_FOLDER_IDS.length > 0) {
    const hasRedlistedParent = file.parents?.some((parent) =>
      REDLIST_FOLDER_IDS.includes(parent)
    );
    if (hasRedlistedParent) return false;
  }

  // 3) If any redlist patterns appear in the filename, exclude it
  if (REDLIST_FILENAME_PATTERNS.length > 0 && file.name) {
    const lowerName = file.name.toLowerCase();
    const isNameRedlisted = REDLIST_FILENAME_PATTERNS.some((pattern) =>
      lowerName.includes(pattern.trim().toLowerCase())
    );
    if (isNameRedlisted) return false;
  }

  // Passed all checks
  return true;
}

/**
 * Federated Search function for Google Drive
 * Returns all recognized Google Drive-supported items (folders, Docs, Sheets, Slides, etc.)
 * by default, filtering only by file name if `queryTerm` is provided.
 * Also applies greenlist/redlist policies to final results.
 */
export async function federatedSearch(context: FunctionContext): Promise<FunctionResponse> {
  try {
    // Extract the user's search query from context
    const queryTerm = context?.input?.query || '';

    // Build Google Auth
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      // 'drive.readonly' is sufficient for reading file metadata/content links
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    // Create Drive client
    const drive = google.drive({ version: 'v3', auth });

    // We don't filter by mimeType so that all items are returned
    // The only filter is 'name contains...' if the user provided a query
    const driveResponse = await drive.files.list({
      q: `name contains '${queryTerm}'`,
      pageSize: 10,
      fields: 'files(id, name, mimeType, parents, webViewLink, webContentLink, createdTime, modifiedTime)',
    });

    // Extract file list and apply the greenlist/redlist filter
    const files = (driveResponse.data.files || []).filter(shouldIndexFile);

    // Shape results for DevRev or your UI
    const results = files.map((file) => ({
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      link: file.webViewLink, // Link to open in Drive (re-checks user permissions)
      // You can optionally return other fields here if needed:
      // webContentLink: file.webContentLink,
      // parents: file.parents,
      // createdTime: file.createdTime,
      // modifiedTime: file.modifiedTime,
    }));

    return {
      status: 'success',
      data: {
        searchResults: results,
      },
    };
  } catch (error: any) {
    console.error('Federated Search error:', error);
    return {
      status: 'error',
      message: error.message || 'Unknown error during federated search',
    };
  }
}
