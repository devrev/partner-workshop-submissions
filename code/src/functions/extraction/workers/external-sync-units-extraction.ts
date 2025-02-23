import { ExternalSyncUnit, ExtractorEventType, processTask } from '@devrev/ts-adaas';
import { getDriveClient } from '../../external-system/google-drive-connector';

async function fetchGoogleDriveUnits(): Promise<ExternalSyncUnit[]> {
  try {
    const drive = await getDriveClient();
    const response = await drive.drives.list({
      pageSize: 100,
    });

    const drives = response.data.drives || [];
    
    // Convert shared drives to external sync units
    return drives.map(drive => ({
      id: drive.id || 'my-drive',
      name: drive.name || 'My Drive',
      description: `Google Drive - ${drive.name || 'My Drive'}`,
      metadata: {
        driveType: drive.kind,
        colorRgb: drive.colorRgb,
        createdTime: drive.createdTime,
        hidden: drive.hidden,
        restrictionsEnabled: drive.restrictionsEnabled
      }
    }));
  } catch (error) {
    console.error('Error fetching Google Drive units:', error);
    // Return default "My Drive" as fallback
    return [{
      id: 'my-drive',
      name: 'My Drive',
      description: 'Google Drive - My Drive'
    }];
  }
}

processTask({
  task: async ({ adapter }) => {
    try {
      const externalSyncUnits = await fetchGoogleDriveUnits();
      await adapter.emit(ExtractorEventType.ExtractionExternalSyncUnitsDone, {
        external_sync_units: externalSyncUnits,
      });
    } catch (error) {
      console.error('Error during external sync units extraction:', error);
      await adapter.emit(ExtractorEventType.ExtractionExternalSyncUnitsError, {
        error: {
          message: 'Failed to extract Google Drive sync units',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  },
  onTimeout: async ({ adapter }) => {
    await adapter.emit(ExtractorEventType.ExtractionExternalSyncUnitsError, {
      error: {
        message: 'Failed to extract Google Drive sync units. Lambda timeout.',
      },
    });
  },
});