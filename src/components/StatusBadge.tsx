import { LeadStatus } from '@/lib/types';

const COLORS: Record<LeadStatus, string> = {
  new:       'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  qualified: 'bg-purple-100 text-purple-800',
  proposal:  'bg-orange-100 text-orange-800',
  won:       'bg-green-100 text-green-800',
  lost:      'bg-red-100 text-red-800',
};

const LABELS: Record<LeadStatus, string> = {
  new:       'Novo',
  contacted: 'Contactado',
  qualified: 'Qualificado',
  proposal:  'Proposta',
  won:       'Ganho',
  lost:      'Perdido',
};

export default function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${COLORS[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
