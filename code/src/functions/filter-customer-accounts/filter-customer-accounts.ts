// src/functions/filter-customer-accounts/filter-customer-accounts.ts
import { Request, Response } from 'express';

// Interface defining the expected filter parameters
interface FilterParams {
  projectId: string;
  milestoneId: string;
}

export const filterCustomerAccounts = async (req: Request, res: Response) => {
  const { projectId, milestoneId }: FilterParams = req.body;

  try {
    // Fetch and filter accounts based on the projectId and milestoneId
    const accounts = await getCustomerAccountsByProjectAndMilestone(projectId, milestoneId);

    return res.status(200).json(accounts);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to filter accounts', error });
  }
};

// Placeholder for filtering customer accounts based on the parameters
async function getCustomerAccountsByProjectAndMilestone(projectId: string, milestoneId: string) {
  // In a real-world scenario, this would query a database or external service
  return [
    { accountId: '123', name: 'Customer A', projectId, milestoneId },
    { accountId: '456', name: 'Customer B', projectId, milestoneId },
  ];
}

