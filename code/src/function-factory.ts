import { filterCustomerAccounts } from './functions/filter-customer-accounts'; // or default import
import { routeTickets } from './functions/route-tickets'; // or default import
import { generateTicketChart } from './functions/generate-ticket-chart'; // or default import


export const functionFactory = { 
  filterCustomerAccounts, 
  routeTickets, 
  generateTicketChart,
} as const;


export type FunctionFactoryType = keyof typeof functionFactory;

