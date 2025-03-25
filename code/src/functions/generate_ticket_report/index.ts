import axios from 'axios';

// Define the DevRev API URL (use the appropriate endpoint for ticket distribution)
const DEVREV_API_URL = 'https://api.devrev.ai/';  // Update this to your actual DevRev API endpoint
const API_KEY = 'your_api_key';  // Replace with your actual API key

export default async function generateTicketReport() {
  try {
    // Fetch ticket data (distribution across departments)
    const response = await axios.get(`${DEVREV_API_URL}/tickets`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const ticketData = response.data; // Assuming the response contains ticket data

    // Generate the distribution of tickets by department
    const report = ticketData.reduce((acc: any, ticket: any) => {
      const department = ticket.custom_fields.department;
      if (!acc[department]) {
        acc[department] = 0;
      }
      acc[department]++;
      return acc;
    }, {});

    // Assuming you want to return this report data, which could be used for generating bar charts
    return report;

  } catch (error) {
    console.error('Error generating ticket report:', error);
    throw error;
  }
}












  
