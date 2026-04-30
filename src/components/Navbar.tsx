import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/leads" className="text-lg font-bold tracking-tight text-gray-900">
          Mini CRM <span className="text-indigo-600">Camesa</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/leads"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Leads
          </Link>
          <Link
            href="/leads/new"
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            + Novo Lead
          </Link>
        </div>
      </div>
    </nav>
  );
}
