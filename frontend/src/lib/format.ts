export function formatCurrency(value: number | string): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 2,
  }).format(Number(value));
}

export function formatDate(value: string): string {
  const normalized = value.endsWith('Z') ? value : value + 'Z';
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(normalized));
}