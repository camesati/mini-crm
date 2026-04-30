/**
 * Aplica máscara de telefone brasileiro.
 * Aceita qualquer entrada e retorna no formato:
 *   (XX) XXXXX-XXXX  — celular (11 dígitos)
 *   (XX) XXXX-XXXX   — fixo    (10 dígitos)
 */
export function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2)  return `(${d}`;
  if (d.length <= 6)  return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return                      `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}
