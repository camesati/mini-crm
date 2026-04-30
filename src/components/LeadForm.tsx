'use client';

import { useRef, useTransition } from 'react';
import { Lead, LeadStatus } from '@/lib/types';

const STATUSES: { value: LeadStatus; label: string }[] = [
  { value: 'new',       label: 'Novo' },
  { value: 'contacted', label: 'Contactado' },
  { value: 'qualified', label: 'Qualificado' },
  { value: 'proposal',  label: 'Proposta' },
  { value: 'won',       label: 'Ganho' },
  { value: 'lost',      label: 'Perdido' },
];

interface Props {
  lead?: Lead;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
}

export default function LeadForm({ lead, action, submitLabel }: Props) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await action(formData);
    });
  }

  const fieldClass =
    'block w-full rounded-md border border-gray-300 px-3 py-2 text-sm ' +
    'shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500';

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Nome <span className="text-red-500">*</span>
          </label>
          <input
            name="name" type="text" required
            defaultValue={lead?.name}
            className={fieldClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            name="email" type="email" required
            defaultValue={lead?.email}
            className={fieldClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Telefone</label>
          <input
            name="phone" type="tel"
            defaultValue={lead?.phone}
            className={fieldClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Empresa</label>
          <input
            name="company" type="text"
            defaultValue={lead?.company}
            className={fieldClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Status <span className="text-red-500">*</span>
          </label>
          <select name="status" required defaultValue={lead?.status ?? 'new'} className={fieldClass}>
            {STATUSES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Notas</label>
        <textarea
          name="notes" rows={4}
          defaultValue={lead?.notes}
          className={fieldClass}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {isPending ? 'Salvando...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
