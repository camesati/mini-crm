import { LeadStatus } from '@/lib/types';

const STYLES: Record<LeadStatus, { bg: string; label: string }> = {
  novo:       { bg: 'bg-blue-100  text-blue-800',  label: 'Novo'       },
  em_contato: { bg: 'bg-amber-100 text-amber-800', label: 'Em contato' },
  fechado:    { bg: 'bg-green-100 text-green-800', label: 'Fechado'    },
};

export default function StatusBadge({ status }: { status: LeadStatus }) {
  const { bg, label } = STYLES[status] ?? STYLES.novo;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${bg}`}>
      {label}
    </span>
  );
}
