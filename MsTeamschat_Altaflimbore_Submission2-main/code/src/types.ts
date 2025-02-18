export interface Request {
    payload: {
        command: string;
        parameters: string[];
    };
    context: {
        organization_id: string;
        token: string;
    };
}

export interface Response {
    success: boolean;
    message: string;
} 