import { routeConversationTicket } from '../src/functions/route-tickets';
import { filterCustomerAccounts } from '../src/functions/filter-customer-accounts';
import { generateTicketChart } from '../src/functions/generate-ticket-chart';

// Sample test cases
describe('Function tests', () => {

  test('routeConversationTicket - routes tickets correctly based on project', async () => {
    const input = {
      ticket_id: 'ticket123',
      project: 'project_1',
    };

    const result = await routeConversationTicket(input);
    expect(result).toHaveProperty('agent_assigned');
    expect(result.agent_assigned).toBe('agent_1'); // Example check
  });

  test('filterCustomerAccounts - filters accounts correctly based on project and milestone', async () => {
    const input = {
      project: 'project_1',
      milestone: 'milestone_1',
    };

    const result = await filterCustomerAccounts(input);
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0); // Example check
  });

  test('generateTicketChart - generates a chart correctly for a project', async () => {
    const input = {
      project: 'project_1',
    };

    const result = await generateTicketChart(input);
    expect(result).toHaveProperty('chart_image_url');
    expect(result.chart_image_url).toMatch(/^https?:\/\//); // Example check for valid URL
  });

});

