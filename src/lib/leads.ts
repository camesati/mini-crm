import 'server-only';
import { getSupabase } from './supabase';
import { Lead, LeadInput } from './types';
import type { Database } from './database.types';

type DbRow = Database['public']['Tables']['leads']['Row'];

function toModel(row: DbRow): Lead {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    company: row.company,
    status: row.status as Lead['status'],
    notes: row.notes,
    createdAt: row.created_at,
  };
}

export async function readLeads(): Promise<Lead[]> {
  const { data, error } = await getSupabase()
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data.map(toModel);
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const { data, error } = await getSupabase()
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }
  return toModel(data);
}

export async function createLead(input: LeadInput): Promise<Lead> {
  const { data, error } = await getSupabase()
    .from('leads')
    .insert({
      name: input.name,
      email: input.email,
      phone: input.phone,
      company: input.company,
      status: input.status,
      notes: input.notes,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return toModel(data);
}

export async function updateLead(id: string, input: Partial<LeadInput>): Promise<Lead> {
  const { data, error } = await getSupabase()
    .from('leads')
    .update({
      name: input.name,
      email: input.email,
      phone: input.phone,
      company: input.company,
      status: input.status,
      notes: input.notes,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return toModel(data);
}

export async function deleteLead(id: string): Promise<void> {
  const { error } = await getSupabase().from('leads').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
