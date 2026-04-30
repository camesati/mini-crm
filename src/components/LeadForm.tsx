'use client';

import { useRef, useState, useTransition } from 'react';
import { Lead, LeadStatus } from '@/lib/types';

const STATUSES: { value: LeadStatus; label: string; color: string; ring: string }[] = [
  {
    value: 'new',
    label: 'Novo',
    color: 'border-blue-300  bg-blue-50  text-blue-800  data-[checked]:bg-blue-100  data-[checked]:border-blue-500',
    ring:  'data-[checked]:ring-2 data-[checked]:ring-blue-400',
  },
  {
    value: 'contacted',
    label: 'Em contato',
    color: 'border-amber-300 bg-amber-50 text-amber-800 data-[checked]:bg-amber-100 data-[checked]:border-amber-500',
    ring:  'data-[checked]:ring-2 data-[checked]:ring-amber-400',
  },
  {
    value: 'closed',
    label: 'Fechado',
    color: 'border-green-300 bg-green-50 text-green-800 data-[checked]:bg-green-100 data-[checked]:border-green-500',
    ring:  'data-[checked]:ring-2 data-[checked]:ring-green-400',
  },
];

interface Props {
  lead?: Lead;
  action: (formData: FormData) => Promise<{ error: string } | undefined>;
  submitLabel: string;
}

const input =
  'block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ' +
  'placeholder-gray-400 shadow-sm transition focus:border-indigo-500 focus:outline-none ' +
  'focus:ring-2 focus:ring-indigo-500/20';

const label = 'mb-1.5 block text-sm font-medium text-gray-700';

export default function LeadForm({ lead, action, submitLabel }: Props) {
  const [status, setStatus]         = useState<LeadStatus>(lead?.status ?? 'new');
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
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">

      {/* Linha 1 — Nome + Empresa */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>
            Nome <span className="text-red-500">*</span>
          </label>
          <input
            name="name" type="text" required autoFocus
            defaultValue={lead?.name}
            placeholder="Ex: João Silva"
            className={input}
          />
        </div>
        <div>
          <label className={label}>Empresa</label>
          <input
            name="company" type="text"
            defaultValue={lead?.company}
            placeholder="Ex: Camesa S.A."
            className={input}
          />
        </div>
      </div>

      {/* Linha 2 — Contato (email + telefone) */}
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-gray-700">Contato</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>
              E-mail <span className="text-red-500">*</span>
            </label>
            <input
              name="email" type="email" required
              defaultValue={lead?.email}
              placeholder="joao@empresa.com"
              className={input}
            />
          </div>
          <div>
            <label className={label}>Telefone</label>
            <input
              name="phone" type="tel"
              defaultValue={lead?.phone}
              placeholder="(11) 99999-9999"
              className={input}
            />
          </div>
        </div>
      </fieldset>

      {/* Status — radio cards */}
      <div>
        <span className={label}>
          Status <span className="text-red-500">*</span>
        </span>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {STATUSES.map((s) => {
            const checked = status === s.value;
            return (
              <label
                key={s.value}
                data-checked={checked ? '' : undefined}
                className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-1.5
                            text-sm font-medium transition-all select-none
                            ${s.color} ${s.ring}`}
              >
                <input
                  type="radio" name="status" value={s.value}
                  checked={checked}
                  onChange={() => setStatus(s.value)}
                  className="sr-only"
                />
                {/* dot */}
                <span
                  className={`h-2 w-2 rounded-full transition-colors ${
                    checked ? 'bg-current' : 'bg-gray-300'
                  }`}
                />
                {s.label}
              </label>
            );
          })}
        </div>
      </div>

      {/* Notas */}
      <div>
        <label className={label}>Notas</label>
        <textarea
          name="notes" rows={4}
          defaultValue={lead?.notes}
          placeholder="Observações sobre este lead..."
          className={`${input} resize-none`}
        />
      </div>

      {/* Erro do servidor */}
      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <strong className="font-semibold">Erro: </strong>{serverError}
        </div>
      )}

      {/* Rodapé */}
      <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
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
