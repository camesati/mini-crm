import { LeadStatus } from '@/lib/types';

const STYLES: Record<LeadStatus, { bg: string; label: string }> = {
  new:       { bg: 'bg-blue-100   text-blue-800',  label: 'Novo'       },
  contacted: { bg: 'bg-amber-100  text-amber-800', label: 'Em contato' },
  closed:    { bg: 'bg-green-100  text-green-800', label: 'Fechado'    },
};

export default function StatusBadge({ status }: { status: LeadStatus }) {
  const { bg, label } = STYLES[status] ?? STYLES.new;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${bg}`}>
      {label}
    </span>
  );
}
