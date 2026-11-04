'use client';

import { Input, Select } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface ValoresFiltro {
  bairro?: string | null;
  tipo?: string | null;
  precoMax?: string | null;
  quartos?: string | null;
}

export interface FiltrosFormProps {
  basePath: string;
  valores: ValoresFiltro;
  /** Prefixo para os `id` — o formulário aparece no drawer e não pode duplicar id. */
  idPrefix: string;
  rotuloPreco?: string;
  aoAplicar?: () => void;
}

/**
 * Formulário de filtros por GET.
 *
 * Sem estado próprio e sem JS obrigatório: funciona com o botão "Aplicar" e a
 * URL carrega os filtros (bom para compartilhar link e para o botão voltar).
 */
export function FiltrosForm({
  basePath,
  valores,
  idPrefix,
  rotuloPreco = 'Preço máximo',
  aoAplicar,
}: FiltrosFormProps) {
  return (
    <form action={basePath} method="GET" className="space-y-4" onSubmit={aoAplicar}>
      <div>
        <label htmlFor={`${idPrefix}-bairro`} className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-muted">
          Bairro ou região
        </label>
        <Input
          id={`${idPrefix}-bairro`}
          name="bairro"
          type="text"
          placeholder="Ex: Jardim Maria Rosa"
          defaultValue={valores.bairro ?? ''}
        />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-tipo`} className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-muted">
          Tipo de imóvel
        </label>
        <Select id={`${idPrefix}-tipo`} name="tipo" defaultValue={valores.tipo ?? ''}>
          <option value="">Todos os tipos</option>
          <option value="Apartamento">Apartamento</option>
          <option value="Casa">Casa</option>
          <option value="Sobrado">Sobrado</option>
          <option value="Kitnet">Kitnet</option>
          <option value="Terreno">Terreno</option>
          <option value="Comercial">Comercial</option>
        </Select>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-preco`} className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-muted">
          {rotuloPreco}
        </label>
        <Select id={`${idPrefix}-preco`} name="precoMax" defaultValue={valores.precoMax ?? ''}>
          <option value="">Sem limite</option>
          <option value="1500">Até R$ 1.500</option>
          <option value="2500">Até R$ 2.500</option>
          <option value="300000">Até R$ 300 mil</option>
          <option value="500000">Até R$ 500 mil</option>
          <option value="800000">Até R$ 800 mil</option>
          <option value="1200000">Até R$ 1,2 milhão</option>
        </Select>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-quartos`} className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-muted">
          Dormitórios
        </label>
        <Select id={`${idPrefix}-quartos`} name="quartos" defaultValue={valores.quartos ?? ''}>
          <option value="">Qualquer</option>
          <option value="1">1+ quartos</option>
          <option value="2">2+ quartos</option>
          <option value="3">3+ quartos</option>
          <option value="4">4+ quartos</option>
        </Select>
      </div>

      <Button type="submit" variant="primary" size="md" className="w-full">
        Aplicar filtros
      </Button>
    </form>
  );
}
