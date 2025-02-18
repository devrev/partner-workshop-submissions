import { Request, Response } from './types';
import { handleMSTeamsImport } from './handlers/teams';

export type FunctionFactoryType = 'command_handler';

export const functionFactory = {
    command_handler: async (request: Request): Promise<Response> => {
        if (request.payload.command === 'import_chats') {
            return handleMSTeamsImport(request);
        }
        return {
            success: false,
            message: 'Unsupported command'
        };
    }
};
