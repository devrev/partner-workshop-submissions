// Create a Service Account in Google Cloud Console.
// In your domain’s Google Workspace Admin Console, under Security > API Controls > Domain-wide delegation, grant your service account domain-wide access to the relevant scopes (e.g., https://www.googleapis.com/auth/drive.metadata.readonly).
// Download the JSON key for your service account, or note the client email and private key.

// src/functions/enforcePermissionsSearch.ts

import { google, drive_v3 } from 'googleapis';
import { FunctionContext, FunctionResponse } from '../types';

/**
 * Returns a Drive client impersonating the given userEmail using domain-wide delegation.
 * This ensures all Drive calls only see files the user is permitted to see.
 */
function getDriveClientForUser(userEmail: string): drive_v3.Drive {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    undefined,
    process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/drive.metadata.readonly'],
    userEmail  // <= This is how we impersonate the user
  );

  return google.drive({ version: 'v3', auth });
}

/**
 * Example: Enforce Google Workspace permissions by impersonating the user
 * and returning only their accessible files.
 */
export async function enforcePermissionsSearch(
  context: FunctionContext
): Promise<FunctionResponse> {
  try {
    // We expect the user's Google Workspace email to come in via context.input.userEmail
    const userEmail = context.input?.userEmail;
    const queryTerm = context.input?.query || '';

    if (!userEmail) {
      throw new Error('Missing userEmail in the request context.');
    }

    // Create a Drive client for the impersonated user
    const drive = getDriveClientForUser(userEmail);

    // We can do a file search by name or other parameters.
    // For instance, searching for name containing queryTerm.
    // You may refine or combine with advanced search parameters:
    // https://developers.google.com/drive/api/guides/search-parameters
    const res = await drive.files.list({
      q: `name contains '${queryTerm}'`,
      fields: 'files(id, name, mimeType, webViewLink)',
      pageSize: 10,
    });

    const files = res.data.files || [];
    // Return minimal fields for DevRev to display.
    // webViewLink ensures users can click to open in Drive, 
    // which re-checks user permissions.
    const results = files.map((file) => ({
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      link: file.webViewLink,
    }));

    return {
      status: 'success',
      data: {
        count: results.length,
        results,
      },
    };
  } catch (error: any) {
    console.error('Error in enforcePermissionsSearch:', error);
    return {
      status: 'error',
      message: error.message,
    };
  }
}
