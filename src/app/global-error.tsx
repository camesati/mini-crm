'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[global error]', error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen items-center justify-center bg-gray-50 antialiased">
        <div className="w-full max-w-lg rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Algo deu errado</h2>
          <p className="mt-2 text-sm text-gray-600">{error.message}</p>
          {error.digest && (
            <p className="mt-1 text-xs text-gray-400">Digest: {error.digest}</p>
          )}
          <button
            onClick={reset}
            className="mt-6 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  );
}
