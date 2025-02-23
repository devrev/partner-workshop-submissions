import { NormalizedAttachment, NormalizedItem } from '@devrev/ts-adaas';
import { drive_v3 } from 'googleapis';

interface GoogleDriveFile extends drive_v3.Schema$File {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  createdTime?: string;
  modifiedTime?: string;
  owners?: Array<{
    emailAddress?: string;
    displayName?: string;
  }>;
}

export function normalizeGoogleDriveFile(file: GoogleDriveFile): NormalizedItem {
  return {
    id: file.id,
    created_date: file.createdTime || new Date().toISOString(),
    modified_date: file.modifiedTime || new Date().toISOString(),
    data: {
      title: file.name,
      mime_type: file.mimeType,
      web_view_link: file.webViewLink,
      owner: file.owners?.[0]?.emailAddress || '',
      owner_name: file.owners?.[0]?.displayName || '',
    },
  };
}

export function normalizeGoogleDriveAttachment(file: GoogleDriveFile): NormalizedAttachment {
  return {
    id: file.id,
    url: file.webViewLink || '',
    file_name: file.name,
    author_id: file.owners?.[0]?.emailAddress || '',
    parent_id: file.parents?.[0] || '',
    mime_type: file.mimeType,
  };
}

export function normalizeGoogleDriveUser(user: drive_v3.Schema$User): NormalizedItem {
  return {
    id: user.emailAddress || '',
    created_date: new Date().toISOString(), // Drive API doesn't provide creation date for users
    modified_date: new Date().toISOString(),
    data: {
      email: user.emailAddress || '',
      name: user.displayName || '',
      photo_url: user.photoLink || '',
      permission_id: user.permissionId || '',
    },
  };
}

export function normalizeGoogleDrivePermission(
  permission: drive_v3.Schema$Permission
): NormalizedItem {
  return {
    id: permission.id || '',
    created_date: new Date().toISOString(),
    modified_date: new Date().toISOString(),
    data: {
      type: permission.type || '',
      role: permission.role || '',
      email_address: permission.emailAddress || '',
      domain: permission.domain || '',
      display_name: permission.displayName || '',
    },
  };
}