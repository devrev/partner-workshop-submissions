import { Request, Response } from '../types';

export async function handleMSTeamsImport(request: Request): Promise<Response> {
    try {
        const { parameters } = request.payload;
        const channelUrl = parameters[0];

        if (!channelUrl) {
            return {
                success: false,
                message: 'Please provide a Teams channel URL'
            };
        }

        try {
            const url = new URL(channelUrl);
            if (!url.hostname.includes('teams.microsoft.com')) {
                return {
                    success: false,
                    message: 'Invalid Teams URL'
                };
            }

            const pathSegments = url.pathname.split('/');
            const teamIndex = pathSegments.indexOf('teams');
            const channelIndex = pathSegments.indexOf('channels');

            if (teamIndex === -1 || channelIndex === -1) {
                return {
                    success: false,
                    message: 'Could not find team or channel information'
                };
            }

            const teamId = pathSegments[teamIndex + 1];
            const channelId = pathSegments[channelIndex + 1];

            return {
                success: true,
                message: `Found team ${teamId} and channel ${channelId}`
            };

        } catch (urlError) {
            return {
                success: false,
                message: 'Invalid URL format'
            };
        }

    } catch (error) {
        return {
            success: false,
            message: 'An unexpected error occurred'
        };
    }
} 