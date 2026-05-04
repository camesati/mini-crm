'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Lead, LeadStatus } from '@/lib/types';
import StatusBadge from './StatusBadge';
import { formatPhone } from '@/lib/utils';

type StatusFilter = 'all' | LeadStatus;

const STATUS_PILLS: { key: StatusFilter; label: string; active: string; inactive: string }[] = [
  { key: 'all',        label: 'Todos',      active: 'bg-gray-800 text-white',  inactive: 'bg-gray-100 text-gray-600 hover:bg-gray-200' },
  { key: 'novo',       label: 'Novo',       active: 'bg-blue-600 text-white',  inactive: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
  { key: 'em_contato', label: 'Em contato', active: 'bg-amber-500 text-white', inactive: 'bg-amber-50 text-amber-700 hover:bg-amber-100' },
  { key: 'fechado',    label: 'Fechado',    active: 'bg-green-600 text-white', inactive: 'bg-green-50 text-green-700 hover:bg-green-100' },
];

type SortKey = keyof Pick<Lead, 'name' | 'company' | 'status' | 'createdAt'>;

const AVATAR_PALETTE = [
  'bg-indigo-100 text-indigo-700',
  'bg-purple-100 text-purple-700',
  'bg-pink-100   text-pink-700',
  'bg-blue-100   text-blue-700',
  'bg-teal-100   text-teal-700',
  'bg-orange-100 text-orange-700',
];

function initials(name: string) {
  return (name || '?')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function avatarClass(id: string) {
  const n = (id.charCodeAt(0) ?? 0) + (id.charCodeAt(id.length - 1) ?? 0);
  return AVATAR_PALETTE[n % AVATAR_PALETTE.length];
}

export default function LeadTable({ leads }: { leads: Lead[] }) {
  const [search, setSearch]       = useState('');
  const [sortKey, setSortKey]     = useState<SortKey>('createdAt');
  const [asc, setAsc]             = useState(false);
  const [statusFilter, setStatus] = useState<StatusFilter>('all');

  const counts = useMemo<Record<StatusFilter, number>>(() => ({
    all:        leads.length,
    novo:       leads.filter((l) => l.status === 'novo').length,
    em_contato: leads.filter((l) => l.status === 'em_contato').length,
    fechado:    leads.filter((l) => l.status === 'fechado').length,
  }), [leads]);

  const filtered = useMemo(() => {
    const result = statusFilter === 'all' ? leads : leads.filter((l) => l.status === statusFilter);
    const q = search.toLowerCase();
    if (!q) return result;
    return result.filter((l) =>
      [l.name, l.company, l.phone, l.email]
        .some((v) => (v ?? '').toLowerCase().includes(q)),
    );
  }, [leads, search, statusFilter]);

  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) => {
        const av = a[sortKey] ?? '';
        const bv = b[sortKey] ?? '';
        return asc
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av));
      }),
    [filtered, sortKey, asc],
  );

  function toggle(key: SortKey) {
    if (sortKey === key) setAsc((p) => !p);
    else { setSortKey(key); setAsc(true); }
  }

  const th =
    'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 ' +
    'cursor-pointer select-none transition-colors hover:text-gray-700 whitespace-nowrap';

  function Arrow({ k }: { k: SortKey }) {
    if (sortKey !== k) return <span className="ml-1 opacity-25">↕</span>;
    return <span className="ml-1 text-indigo-500">{asc ? '↑' : '↓'}</span>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

      {/* Pills de filtro por status */}
      <div className="flex flex-wrap gap-1.5 border-b border-gray-100 px-4 py-3">
        {STATUS_PILLS.map((pill) => (
          <button
            key={pill.key}
            onClick={() => setStatus(pill.key)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              statusFilter === pill.key ? pill.active : pill.inactive
            }`}
          >
            {pill.label}
            <span className="ml-1 opacity-60">({counts[pill.key]})</span>
          </button>
        ))}
      </div>

      {/* Barra de busca */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div className="relative w-full max-w-xs">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7 7 0 1 0 6.65 6.65a7 7 0 0 0 10 10z" />
          </svg>
          <input
            type="search"
            placeholder="Buscar por nome, empresa, contato ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-gray-200 py-1.5 pl-9 pr-3 text-sm
                       text-gray-700 placeholder-gray-400 focus:border-indigo-400
                       focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
        </div>
        <span className="ml-4 shrink-0 text-xs text-gray-400">
          {filtered.length} de {leads.length}
        </span>
      </div>

      {leads.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-sm font-medium text-gray-500">Nenhum lead cadastrado ainda.</p>
          <Link
            href="/leads/new"
            className="mt-2 inline-block text-sm text-indigo-600 underline hover:text-indigo-800"
          >
            Criar primeiro lead
          </Link>
        </div>
      )}

      {leads.length > 0 && filtered.length === 0 && (
        <div className="py-16 text-center text-sm text-gray-500">
          {search
            ? <>Nenhum resultado para <strong>&ldquo;{search}&rdquo;</strong></>
            : <>Nenhum lead com status <strong>{STATUS_PILLS.find((p) => p.key === statusFilter)?.label}</strong></>
          }
        </div>
      )}

      {filtered.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className={th} onClick={() => toggle('name')}>
                  Nome <Arrow k="name" />
                </th>
                <th className={`${th} hidden sm:table-cell`} onClick={() => toggle('company')}>
                  Empresa <Arrow k="company" />
                </th>
                <th className={`${th} hidden md:table-cell`}>Telefone</th>
                <th className={`${th} hidden lg:table-cell`}>E-mail</th>
                <th className={th} onClick={() => toggle('status')}>
                  Status <Arrow k="status" />
                </th>
                <th className={`${th} hidden lg:table-cell`} onClick={() => toggle('createdAt')}>
                  Criado em <Arrow k="createdAt" />
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {sorted.map((lead) => (
                <tr key={lead.id} className="group transition-colors hover:bg-indigo-50/40">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex h-8 w-8 shrink-0 items-center justify-center
                                    rounded-full text-xs font-bold ${avatarClass(lead.id)}`}
                      >
                        {initials(lead.name)}
                      </span>
                      <p className="truncate font-medium text-gray-900">{lead.name}</p>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3.5 text-gray-600 sm:table-cell">
                    {lead.company || <span className="text-gray-300">—</span>}
                  </td>
                  <td className="hidden px-4 py-3.5 text-gray-600 md:table-cell">
                    {lead.phone ? formatPhone(lead.phone) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="hidden px-4 py-3.5 text-gray-600 lg:table-cell">
                    {lead.email || <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="hidden px-4 py-3.5 text-xs text-gray-400 lg:table-cell">
                    {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Link
                      href={`/leads/${lead.id}`}
                      className="text-xs font-semibold text-indigo-600 opacity-0 transition-opacity
                                 hover:text-indigo-800 group-hover:opacity-100"
                    >
                      Ver →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
