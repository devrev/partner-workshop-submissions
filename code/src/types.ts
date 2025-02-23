// src/types.ts

/**
 * The context passed to your functions, typically includes
 * anything DevRev (or your own code) attaches, such as query params,
 * user data, etc.
 */
export interface FunctionContext {
    // You can store the search query or other fields under "input"
    input?: {
      query?: string;
      [key: string]: any;
    };
  
    // If your environment passes other info (e.g., user info) you can add it here
    [key: string]: any;
  }
  
  /**
   * The standard response your functions return.
   * Adapt fields to match how your code is expected
   * to respond in DevRev.
   */
  export interface FunctionResponse {
    status: 'success' | 'error';
    data?: any;          // e.g., { searchResults: ... } or other relevant payload
    message?: string;    // error or info message if needed
    [key: string]: any;  // to accommodate any other fields
  }
  