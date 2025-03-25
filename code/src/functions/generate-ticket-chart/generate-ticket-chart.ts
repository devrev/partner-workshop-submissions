// src/functions/generate-ticket-chart/generate-ticket-chart.ts
import { Request, Response } from 'express';
import { Chart } from 'chart.js';
import { createCanvas } from 'canvas';

export const generateTicketChart = async (req: Request, res: Response) => {
  try {
    // Get the ticket distribution data (this could come from a database or API)
    const distributionData = await getTicketDistributionData();

    // Generate chart data
    const chartData = {
      labels: distributionData.projects,
      datasets: [
        {
          label: 'Ticket Distribution',
          data: distributionData.tickets,
          backgroundColor: ['#FF5733', '#33FF57', '#3357FF'],
        },
      ],
    };

    // Generate chart and convert it to a base64 encoded image
    const chartImage = generateChart(chartData);

    // Return the generated chart image
    return res.status(200).json({ chartImage });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to generate chart', error });
  }
};

// Placeholder function to get ticket distribution data
async function getTicketDistributionData() {
  return {
    projects: ['Project A', 'Project B', 'Project C'],
    tickets: [5, 10, 7],
  };
}

// Function to generate chart and convert it to a base64 image
function generateChart(chartData: any) {
  const canvas = createCanvas(400, 400);  // Create a canvas with specific dimensions
  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: chartData,
  });
  return canvas.toDataURL();  // Convert canvas to base64 encoded image
}

