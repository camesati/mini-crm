import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLeadById } from '@/lib/leads';
import { updateLeadAction, deleteLeadAction } from '@/lib/actions';
import LeadForm from '@/components/LeadForm';
import StatusBadge from '@/components/StatusBadge';
import ConfirmDialog from '@/components/ConfirmDialog';

interface Props {
  params: { id: string };
  searchParams: { edit?: string };
}

export default async function LeadDetailPage({ params, searchParams }: Props) {
  const lead = await getLeadById(params.id);
  if (!lead) notFound();

  const isEditing   = searchParams.edit === '1';
  const boundUpdate = updateLeadAction.bind(null, lead.id);
  const boundDelete = deleteLeadAction.bind(null, lead.id);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link href="/leads" className="text-sm text-indigo-600 hover:text-indigo-800">
          ← Voltar para Leads
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
          <StatusBadge status={lead.status} />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Criado em{' '}
          {new Date(lead.createdAt).toLocaleDateString('pt-BR', {
            day: '2-digit', month: 'long', year: 'numeric',
          })}
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {isEditing ? (
          <>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Editando Lead
            </h2>
            <LeadForm lead={lead} action={boundUpdate} submitLabel="Salvar Alterações" />
            <div className="mt-4">
              <Link
                href={`/leads/${lead.id}`}
                className="text-sm text-gray-500 underline hover:text-gray-700"
              >
                Cancelar edição
              </Link>
            </div>
          </>
        ) : (
          <>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {(
                [
                  ['Contato', lead.phone  || '—'],
                  ['E-mail',  lead.email  || '—'],
                  ['Empresa', lead.company || '—'],
                  ['Status',  <StatusBadge key="s" status={lead.status} />],
                ] as [string, React.ReactNode][]
              ).map(([label, value]) => (
                <div key={label as string}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{value}</dd>
                </div>
              ))}
            </dl>

            {lead.notes && (
              <div className="mt-4">
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Notas
                </dt>
                <dd className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{lead.notes}</dd>
              </div>
            )}

            <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-4">
              <Link
                href={`/leads/${lead.id}?edit=1`}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium
                           text-white hover:bg-indigo-700"
              >
                Editar Lead
              </Link>
              <ConfirmDialog onConfirm={boundDelete} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
