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
  { id: 'conta', label: 'Minha Conta', Icon: User },
];

export default function BottomNavMobile({ activeTab, onTabChange }: BottomNavMobileProps) {
  return (
    <nav className="flex-shrink-0 bg-white border-t border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]" style={{ height: 65 }}>
      <div className="h-full flex items-stretch">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`relative flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] leading-tight ${isActive ? 'font-extrabold' : 'font-semibold'}`}>
                {label}
              </span>
              {isActive && <span className="absolute bottom-1 w-5 h-[3px] rounded-full bg-blue-600" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}