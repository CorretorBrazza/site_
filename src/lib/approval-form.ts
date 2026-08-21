export function normalizeApprovalFinalidade(refinados: Record<string, any> | null | undefined): 'Venda' | 'Locação' | 'Venda e Locação' | 'Não informado' {
  const raw = String(refinados?.finalidade || refinados?.transacao || '').trim();
  const normalized = raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();

  if (normalized.includes('VENDA') && normalized.includes('LOCACAO')) return 'Venda e Locação';
  if (normalized.includes('LOCACAO') || normalized.includes('ALUGUEL') || normalized.includes('ALUGAR')) return 'Locação';
  if (normalized.includes('VENDA') || normalized.includes('VENDO') || normalized.includes('COMPRA')) return 'Venda';

  const precoVenda = refinados?.precoVenda;
  const precoLocacao = refinados?.precoLocacao;
  const hasPrecoVenda = precoVenda !== null && precoVenda !== undefined && precoVenda !== '' && Number(precoVenda) > 0;
  const hasPrecoLocacao = precoLocacao !== null && precoLocacao !== undefined && precoLocacao !== '' && Number(precoLocacao) > 0;

  if (hasPrecoVenda && hasPrecoLocacao) return 'Venda e Locação';
  if (hasPrecoLocacao) return 'Locação';
  if (hasPrecoVenda) return 'Venda';

  return 'Não informado';
}
