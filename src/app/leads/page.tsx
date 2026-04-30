import Link from 'next/link';
import { readLeads } from '@/lib/leads';
import LeadTable from '@/components/LeadTable';

export const dynamic = 'force-dynamic';

function StatCard({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: number;
  valueClass: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}

export default async function LeadsPage() {
  const leads = await readLeads();

  const total     = leads.length;
  const novos     = leads.filter((l) => l.status === 'new').length;
  const ativos    = leads.filter((l) =>
    ['contacted', 'qualified', 'proposal'].includes(l.status)
  ).length;
  const ganhos    = leads.filter((l) => l.status === 'won').length;

  return (
    <div>
      {/* Cabeçalho */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie e acompanhe todos os seus leads
          </p>
        </div>
        <Link
          href="/leads/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2
                     text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
        >
          <span className="text-base leading-none">+</span> Novo Lead
        </Link>
      </div>

      {/* Cards de resumo */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total"        value={total}  valueClass="text-gray-900"   />
        <StatCard label="Novos"        value={novos}  valueClass="text-blue-600"   />
        <StatCard label="Em andamento" value={ativos} valueClass="text-purple-600" />
        <StatCard label="Ganhos"       value={ganhos} valueClass="text-green-600"  />
      </div>

      {/* Tabela */}
      <LeadTable leads={leads} />
    </div>
  );
}
