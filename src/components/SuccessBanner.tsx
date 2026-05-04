const MESSAGES: Record<string, string> = {
  created: 'Lead criado com sucesso!',
  updated: 'Lead atualizado com sucesso!',
  deleted: 'Lead excluído com sucesso.',
};

export default function SuccessBanner({ message }: { message?: string }) {
  const text = message ? MESSAGES[message] : undefined;
  if (!text) return null;

  return (
    <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-200
                    bg-green-50 px-4 py-3 text-sm text-green-800">
      <svg className="h-4 w-4 shrink-0 text-green-600" fill="none" viewBox="0 0 24 24"
           stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      {text}
    </div>
  );
}
