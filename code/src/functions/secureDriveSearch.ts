// src/functions/secureDriveSearch.ts

import { google, drive_v3 } from 'googleapis';
import { FunctionContext, FunctionResponse } from '../types';

/**
 * Create a domain-wide delegated JWT client for read-only Drive access.
 * `userEmail` must belong to the same Google Workspace domain.
 */
function getReadOnlyDriveClient(userEmail: string): drive_v3.Drive {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/drive.metadata.readonly'],
    subject: userEmail,  // This impersonates the target user
  });

  return google.drive({ version: 'v3', auth });
}

/**
 * Example function: Securely search for files that the `userEmail`
 * is allowed to see. This enforces Google’s native permission checks.
 */
export async function secureDriveSearch(
  context: FunctionContext
): Promise<FunctionResponse> {
  try {
    const userEmail = context.input?.userEmail;
    const query = context.input?.query || '';

    if (!userEmail) {
      throw new Error('Missing userEmail in request context.');
    }

    // Create a domain-wide delegated client
    const driveClient = getReadOnlyDriveClient(userEmail);

    // Simple search for files whose name contains `query`.
    // Drive will only return files userEmail can access.
    const response = await driveClient.files.list({
      q: `name contains '${query}'`,
      fields: 'files(id, name, webViewLink)',
      pageSize: 10,
    });

    const files = response.data.files || [];
    // Each result has a webViewLink that redirects to Drive
    // for final permission validation if the user tries to open it.
    const results = files.map((f) => ({
      id: f.id,
      name: f.name,
      link: f.webViewLink,
    }));

    return {
      status: 'success',
      data: {
        results,
        count: results.length,
      },
    };
  } catch (error: any) {
    console.error('Error in secureDriveSearch:', error);
    return { status: 'error', message: error.message };
  }
}
