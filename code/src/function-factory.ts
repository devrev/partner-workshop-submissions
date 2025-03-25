import routeTicket from './functions/route_ticket';
import setAgentVisibility from './functions/set_agent_visibility';
import generateTicketReport from './functions/generate_ticket_report';

export const functionFactory = {
  routeTicket,
  setAgentVisibility,
  generateTicketReport,
} as const;

export type FunctionFactoryType = keyof typeof functionFactory;
