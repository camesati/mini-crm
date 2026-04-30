export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal'
  | 'won'
  | 'lost';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: LeadStatus;
  notes: string;
  createdAt: string;
}

export type LeadInput = Omit<Lead, 'id' | 'createdAt'>;
