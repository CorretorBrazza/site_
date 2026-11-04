'use client';

import { Home, Building2, MapPin, User } from 'lucide-react';

export type TabId = 'inicio' | 'imoveis' | 'bairro' | 'conta';

interface BottomNavMobileProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; Icon: typeof Home }[] = [
  { id: 'inicio', label: 'Início', Icon: Home },
  { id: 'imoveis', label: 'Imóveis', Icon: Building2 },
  { id: 'bairro', label: 'Bairro', Icon: MapPin },
  { id: 'conta', label: 'Conta', Icon: User },
];

/** Barra inferior do painel no mobile (identidade navy + ouro). */
export default function BottomNavMobile({ activeTab, onTabChange }: BottomNavMobileProps) {
  return (
    <nav
      aria-label="Navegação do painel"
      className="flex-shrink-0 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_10px_rgba(9,23,49,0.06)]"
    >
      <div className="flex h-16 items-stretch">
        {tabs.map(({ id, label, Icon }) => {
          const ativo = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              aria-current={ativo ? 'page' : undefined}
              className={`relative flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${
                ativo ? 'text-brand-900' : 'text-muted hover:text-ink'
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={ativo ? 2.5 : 2} aria-hidden="true" />
              <span className={`text-[10px] leading-tight ${ativo ? 'font-extrabold' : 'font-semibold'}`}>
                {label}
              </span>
              {ativo && <span className="absolute bottom-1 h-[3px] w-6 rounded-full bg-gold-500" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
