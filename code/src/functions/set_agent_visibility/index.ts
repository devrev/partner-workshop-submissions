import axios from 'axios';

// Define the DevRev API URL (Update with actual endpoint)
const DEVREV_API_URL = 'https://api.devrev.ai';  // Replace with the correct DevRev API URL
const API_KEY = 'your_api_key';  // Replace with your actual API key for authentication

export default async function setAgentVisibility(ticket: any) {
  const agentId = ticket.assignee.id;  // Extract the agent ID from the ticket
  
  try {
    // Set visibility for the assigned agent (Assuming DevRev has an endpoint for this)
    const response = await axios.post(
      `${DEVREV_API_URL}/tickets/setVisibility`,  // Assuming the endpoint is '/tickets/setVisibility'
      {
        ticket_id: ticket.id,
        agent_id: agentId,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,  // Using Bearer token for authentication
          'Content-Type': 'application/json',
        },
      }
    );

    // Return the response from the API (success or failure)
    return response.data;
  } catch (error) {
    console.error('Error setting agent visibility:', error);
    throw error;
  }
}


