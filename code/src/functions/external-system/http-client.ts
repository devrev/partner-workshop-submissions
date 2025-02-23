import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import {
  AirdropEvent,
  ExternalSystemItemLoadingParams,
  ExternalSystemItemLoadingResponse
} from '@devrev/ts-adaas';

export class HttpClient {
  private driveClient;
  private serviceAccountEmail: string;
  private serviceAccountKey: string;

  constructor(event: AirdropEvent) {
    this.serviceAccountEmail = event.payload.connection_data.service_account_email;
    this.serviceAccountKey = event.payload.connection_data.private_key;
    this.driveClient = this.initializeDriveClient();
  }

  private async initializeDriveClient() {
    const auth = new JWT({
      email: this.serviceAccountEmail,
      key: this.serviceAccountKey.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      subject: process.env.DELEGATED_ADMIN_EMAIL
    });

    await auth.authorize();
    return google.drive({ version: 'v3', auth });
  }

  async createFile({
    item,
    mappers,
    event,
  }: ExternalSystemItemLoadingParams): Promise<ExternalSystemItemLoadingResponse> {
    try {
      const fileMetadata = {
        name: item.title,
        mimeType: item.mime_type || 'application/vnd.google-apps.document',
        description: item.body
      };

      const response = await this.driveClient.files.create({
        requestBody: fileMetadata,
        fields: 'id, name, mimeType, webViewLink, description'
      });

      return {
        external_id: response.data.id,
        web_link: response.data.webViewLink
      };
    } catch (error) {
      console.error('Error creating file in Google Drive:', error);
      return {
        error: 'Could not create a file in Google Drive.',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async updateFile({
    item,
    mappers,
    event,
  }: ExternalSystemItemLoadingParams): Promise<ExternalSystemItemLoadingResponse> {
    try {
      const fileMetadata = {
        name: item.title,
        description: item.body
      };

      const response = await this.driveClient.files.update({
        fileId: item.external_id,
        requestBody: fileMetadata,
        fields: 'id, name, mimeType, webViewLink, description'
      });

      return {
        external_id: response.data.id,
        web_link: response.data.webViewLink
      };
    } catch (error) {
      console.error('Error updating file in Google Drive:', error);
      return {
        error: 'Could not update a file in Google Drive.',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}