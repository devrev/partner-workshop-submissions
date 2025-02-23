import { EventType, ExtractorEventType, processTask } from '@devrev/ts-adaas';
import { drive_v3 } from 'googleapis';
import { 
  normalizeGoogleDriveFile, 
  normalizeGoogleDriveAttachment, 
  normalizeGoogleDriveUser 
} from '../../external-system/data-normalization';
import { getDriveClient } from '../../external-system/google-drive-connector';

const repos = [
  {
    itemType: 'files',
    normalize: normalizeGoogleDriveFile,
  },
  {
    itemType: 'users',
    normalize: normalizeGoogleDriveUser,
  },
  {
    itemType: 'attachments',
    normalize: normalizeGoogleDriveAttachment,
  },
];

async function fetchDriveFiles() {
  const drive = await getDriveClient();
  const response = await drive.files.list({
    pageSize: 100,
    fields: 'files(id, name, mimeType, webViewLink, createdTime, modifiedTime, owners, parents)',
    orderBy: 'modifiedTime desc'
  });
  return response.data.files || [];
}

async function fetchDriveUsers(files: drive_v3.Schema$File[]) {
  const uniqueUsers = new Map();
  files.forEach(file => {
    if (file.owners) {
      file.owners.forEach(owner => {
        if (owner.emailAddress) {
          uniqueUsers.set(owner.emailAddress, owner);
        }
      });
    }
  });
  return Array.from(uniqueUsers.values());
}

processTask({
  task: async ({ adapter }) => {
    try {
      adapter.initializeRepos(repos);

      if (adapter.event.payload.event_type === EventType.ExtractionDataStart) {
        // Fetch and process files
        const files = await fetchDriveFiles();
        await adapter.getRepo('files')?.push(files);
        await adapter.emit(ExtractorEventType.ExtractionDataProgress, {
          progress: 50,
        });
      } else {
        // Fetch and process users and attachments
        const files = await fetchDriveFiles();
        const users = await fetchDriveUsers(files);
        
        // Filter files that can be treated as attachments (non-Google Workspace files)
        const attachments = files.filter(file => 
          !file.mimeType?.includes('application/vnd.google')
        );

        await adapter.getRepo('users')?.push(users);
        await adapter.getRepo('attachments')?.push(attachments);
        await adapter.emit(ExtractorEventType.ExtractionDataDone, {
          progress: 100,
        });
      }
    } catch (error) {
      console.error('Error during data extraction:', error);
      await adapter.emit(ExtractorEventType.ExtractionDataError, {
        error: {
          message: 'Failed to extract data from Google Drive',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  },
  onTimeout: async ({ adapter }) => {
    await adapter.postState();
    await adapter.emit(ExtractorEventType.ExtractionDataProgress, {
      progress: 50,
    });
  },
});