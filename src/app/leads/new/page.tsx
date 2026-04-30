import Link from 'next/link';
import { createLeadAction } from '@/lib/actions';
import LeadForm from '@/components/LeadForm';

export default function NewLeadPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link href="/leads" className="text-sm text-indigo-600 hover:text-indigo-800">
          ← Voltar para Leads
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Novo Lead</h1>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <LeadForm action={createLeadAction} submitLabel="Criar Lead" />
      </div>
    </div>
  );
}
