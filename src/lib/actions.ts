'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createLead, updateLead, deleteLead } from './leads';
import { LeadInput } from './types';

function extractInput(formData: FormData): LeadInput {
  return {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: (formData.get('phone') as string) ?? '',
    company: (formData.get('company') as string) ?? '',
    status: formData.get('status') as LeadInput['status'],
    notes: (formData.get('notes') as string) ?? '',
  };
}

export async function createLeadAction(formData: FormData) {
  const input = extractInput(formData);
  await createLead(input);
  revalidatePath('/leads');
  redirect('/leads');
}

export async function updateLeadAction(id: string, formData: FormData) {
  const input = extractInput(formData);
  await updateLead(id, input);
  revalidatePath('/leads');
  revalidatePath(`/leads/${id}`);
  redirect(`/leads/${id}`);
}

export async function deleteLeadAction(id: string) {
  await deleteLead(id);
  revalidatePath('/leads');
  redirect('/leads');
}
