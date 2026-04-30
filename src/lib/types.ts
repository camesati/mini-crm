export type LeadStatus = 'novo' | 'em_contato' | 'fechado';

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
