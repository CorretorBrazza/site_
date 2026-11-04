'use client';

import { Imovel } from '@/types/imovel';
import CardImovel from '@/components/CardImovel';
import { processarEOrdenarImoveis } from '@/utils/imovelSorting';
import { useLiveImoveis } from '@/hooks/useLiveImoveis';
import { Building2 } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { ButtonLink } from '@/components/ui/button';

interface HomeLiveSectionProps {
  initialImoveis: Imovel[];
}

export default function HomeLiveSection({ initialImoveis }: HomeLiveSectionProps) {
  const { imoveis: currentImoveis } = useLiveImoveis(initialImoveis);
  const imoveisAtivos = currentImoveis.filter((i) => i.status === 'Ativo');
  const destaques = processarEOrdenarImoveis(imoveisAtivos).slice(0, 6);

  if (destaques.length === 0) {
    return (
      <EmptyState
        icone={<Building2 className="h-10 w-10" aria-hidden="true" />}
        titulo="Nenhum imóvel publicado no momento"
        descricao="Seja o primeiro corretor a publicar em Taboão da Serra e imediações. A IA monta o anúncio e você só revisa."
        acao={(
          <ButtonLink href="/planos" variant="primary" size="md">
            Publicar meu imóvel
          </ButtonLink>
        )}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {destaques.map((imovel) => (
        <CardImovel key={imovel.id} imovel={imovel} />
      ))}
    </div>
  );
}
