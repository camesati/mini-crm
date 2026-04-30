'use client';

import { useRef, useState, useTransition } from 'react';
import { Lead, LeadStatus } from '@/lib/types';

const STATUSES: { value: LeadStatus; label: string }[] = [
  { value: 'novo',       label: 'Novo'       },
  { value: 'em_contato', label: 'Em contato' },
  { value: 'fechado',    label: 'Fechado'    },
];

interface Props {
  lead?: Lead;
  action: (formData: FormData) => Promise<{ error: string } | undefined>;
  submitLabel: string;
}

const inputClass =
  'block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ' +
  'placeholder-gray-400 shadow-sm transition focus:border-indigo-500 focus:outline-none ' +
  'focus:ring-2 focus:ring-indigo-500/20';

const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700';

export default function LeadForm({ lead, action, submitLabel }: Props) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTx]          = useTransition();
  const formRef                       = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    const fd = new FormData(e.currentTarget);
    startTx(async () => {
      const result = await action(fd);
      if (result?.error) setServerError(result.error);
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">

      {/* Nome + Empresa */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>
            Nome <span className="text-red-500">*</span>
          </label>
          <input
            name="name" type="text" required autoFocus
            defaultValue={lead?.name}
            placeholder="Ex: João Silva"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Empresa</label>
          <input
            name="company" type="text"
            defaultValue={lead?.company}
            placeholder="Ex: Camesa S.A."
            className={inputClass}
          />
        </div>
      </div>

      {/* Contato */}
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-gray-700">Contato</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>
              E-mail <span className="text-red-500">*</span>
            </label>
            <input
              name="email" type="email" required
              defaultValue={lead?.email}
              placeholder="joao@empresa.com"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Telefone</label>
            <input
              name="phone" type="tel"
              defaultValue={lead?.phone}
              placeholder="(11) 99999-9999"
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>

      {/* Status */}
      <div>
        <label className={labelClass}>
          Status <span className="text-red-500">*</span>
        </label>
        <select
          name="status"
          required
          defaultValue={lead?.status ?? 'novo'}
          className={inputClass}
        >
          {STATUSES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Notas */}
      <div>
        <label className={labelClass}>Notas</label>
        <textarea
          name="notes" rows={4}
          defaultValue={lead?.notes}
          placeholder="Observações sobre este lead..."
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Erro do servidor */}
      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <strong className="font-semibold">Erro: </strong>{serverError}
        </div>
      )}

      {/* Rodapé */}
      <div className="flex justify-end border-t border-gray-100 pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2
                     text-sm font-medium text-white shadow-sm transition-colors
                     hover:bg-indigo-700 disabled:opacity-60"
        >
          {isPending && (
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          )}
          {isPending ? 'Salvando...' : submitLabel}
        </button>
      </div>

    </form>
  );
}
