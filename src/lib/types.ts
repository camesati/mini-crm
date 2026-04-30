export type LeadStatus = 'novo' | 'em_contato' | 'fechado';

export interface Lead {
  id: string;
  name: string;    // → nome
  company: string; // → empresa
  phone: string;   // → contato
  status: LeadStatus;
  notes: string;   // → notas
  createdAt: string;
}

export type LeadInput = Omit<Lead, 'id' | 'createdAt'>;
