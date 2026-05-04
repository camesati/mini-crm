'use client';

import { useState } from 'react';

const MESSAGES: Record<string, string> = {
  created: 'Lead criado com sucesso!',
  updated: 'Lead atualizado com sucesso!',
  deleted: 'Lead excluído com sucesso.',
};

export default function SuccessBanner({ message }: { message?: string }) {
  const [dismissed, setDismissed] = useState(false);
  const text = message ? MESSAGES[message] : undefined;

  if (!text || dismissed) return null;

  return (
    <div className="mb-6 flex items-center justify-between rounded-lg border border-green-200
                    bg-green-50 px-4 py-3 text-sm text-green-800">
      <div className="flex items-center gap-2">
        <svg className="h-4 w-4 shrink-0 text-green-600" fill="none" viewBox="0 0 24 24"
             stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        {text}
      </div>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Fechar"
        className="ml-4 text-green-600 transition-colors hover:text-green-800"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
