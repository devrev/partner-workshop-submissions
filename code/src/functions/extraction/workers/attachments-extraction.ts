import {
  axios,
  ExternalSystemAttachmentStreamingParams,
  ExternalSystemAttachmentStreamingResponse,
  ExtractorEventType,
  processTask,
  serializeAxiosError,
} from '@devrev/ts-adaas';
import { getDriveClient } from '../../external-system/google-drive-connector';

const getAttachmentStream = async ({
  item,
  event,
}: ExternalSystemAttachmentStreamingParams): Promise<ExternalSystemAttachmentStreamingResponse> => {
  const { id } = item;

  try {
    const drive = await getDriveClient();
    
    // Get the file metadata first
    const file = await drive.files.get({
      fileId: id,
      fields: 'id, name, mimeType, webViewLink',
    });

    // Get the file content as a stream
    const fileStream = await drive.files.get({
      fileId: id,
      alt: 'media',
    }, {
      responseType: 'stream',
    });

    return { 
      httpStream: fileStream,
      metadata: {
        mime_type: file.data.mimeType,
        web_view_link: file.data.webViewLink
      }
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error while fetching Google Drive attachment:', serializeAxiosError(error));
    } else {
      console.error('Error while fetching Google Drive attachment:', error);
    }
    return {
      error: {
        message: `Error while fetching Google Drive attachment ${id}`,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
    };
  }
};

processTask({
  task: async ({ adapter }) => {
    const { error, delay } = await adapter.streamAttachments({
      stream: getAttachmentStream,
    });

    if (delay) {
      await adapter.emit(ExtractorEventType.ExtractionAttachmentsDelay, {
        delay,
      });
    } else if (error) {
      await adapter.emit(ExtractorEventType.ExtractionAttachmentsError, {
        error,
      });
    } else {
      await adapter.emit(ExtractorEventType.ExtractionAttachmentsDone);
    }
  },
  onTimeout: async ({ adapter }) => {
    await adapter.postState();
    await adapter.emit(ExtractorEventType.ExtractionAttachmentsProgress, {
      progress: 50,
    });
  },
});