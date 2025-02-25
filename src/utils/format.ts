export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(date);
}

export function formatQuantity(quantity: number, unit: 'kg' | 'unit'): string {
  if (unit === 'kg') {
    return `${quantity.toFixed(3)} kg`;
  }
  return quantity.toString();
}

export function formatDocument(doc: string): string {
  // CPF
  if (doc.length === 11) {
    return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  // CNPJ
  if (doc.length === 14) {
    return doc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  return doc;
}