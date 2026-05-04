'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createLead, updateLead, deleteLead } from './leads';
import { LeadInput } from './types';

export type ActionResult = { error: string } | undefined;

function extractInput(formData: FormData): LeadInput {
  return {
    name:    formData.get('name')    as string,
    company:(formData.get('company') as string) ?? '',
    phone:  (formData.get('phone')   as string) ?? '',
    email:  (formData.get('email')   as string) ?? '',
    status:  formData.get('status')  as LeadInput['status'],
    notes:  (formData.get('notes')   as string) ?? '',
  };
}

export async function createLeadAction(formData: FormData): Promise<ActionResult> {
  const input = extractInput(formData);
  try {
    await createLead(input);
  } catch (e) {
    return { error: (e as Error).message };
  }
  revalidatePath('/leads');
  redirect('/leads?success=created');
}

export async function updateLeadAction(id: string, formData: FormData): Promise<ActionResult> {
  const input = extractInput(formData);
  try {
    await updateLead(id, input);
  } catch (e) {
    return { error: (e as Error).message };
  }
  revalidatePath('/leads');
  revalidatePath(`/leads/${id}`);
  redirect(`/leads/${id}?success=updated`);
}

export async function deleteLeadAction(id: string): Promise<ActionResult> {
  try {
    await deleteLead(id);
  } catch (e) {
    return { error: (e as Error).message };
  }
  revalidatePath('/leads');
  redirect('/leads?success=deleted');
}
