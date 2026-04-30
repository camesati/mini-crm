'use client';

import { useState, useTransition } from 'react';

interface Props {
  onConfirm: () => Promise<{ error: string } | undefined>;
}

export default function ConfirmDialog({ onConfirm }: Props) {
  const [open, setOpen]           = useState(false);
  const [serverError, setError]   = useState<string | null>(null);
  const [isPending, startTx]      = useTransition();

  function handleConfirm() {
    setError(null);
    startTx(async () => {
      const result = await onConfirm();
      if (result?.error) setError(result.error);
      else setOpen(false);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => { setError(null); setOpen(true); }}
        className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium
                   text-red-600 hover:bg-red-50"
      >
        Excluir Lead
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-semibold text-gray-900">Excluir este lead?</h3>
            <p className="mt-1 text-sm text-gray-500">Esta ação não pode ser desfeita.</p>

            {serverError && (
              <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {serverError}
              </p>
            )}

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="rounded-md px-4 py-2 text-sm font-medium text-gray-700
                           hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={isPending}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium
                           text-white hover:bg-red-700 disabled:opacity-60"
              >
                {isPending ? 'Excluindo...' : 'Sim, Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
