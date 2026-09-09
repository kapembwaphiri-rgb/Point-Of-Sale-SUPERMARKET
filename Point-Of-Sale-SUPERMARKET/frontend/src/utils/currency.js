export function formatZmw(value) {
  return new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW', minimumFractionDigits: 2 }).format(Number(value) || 0);
}
