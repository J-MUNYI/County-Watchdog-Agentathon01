export interface SMSQuery {
  id: string;
  sender: string;
  message: string;
  response: string;
  timestamp: string;
  status: 'pending' | 'responded' | 'error';
}

export interface GazetteNotice {
  id: string;
  title: string;
  date: string;
  summary: string;
  isBudgetRelated: boolean;
}

export interface BudgetStats {
  totalAllocated: number;
  wardAllocation: Record<string, number>;
  topDepartments: { name: string; amount: number }[];
}
