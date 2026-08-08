'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Imovel } from '@/types/imovel';
import HeaderSaldoCreditos from './components/HeaderSaldoCreditos';
import BannerBackupGamificacao from './components/BannerBackupGamificacao';
import ModalRecargaCreditos from './components/ModalRecargaCreditos';
import TabelaImoveis from './TabelaImoveis';
import { Sparkles, Plus, ShieldCheck, Flame } from 'lucide-react';

interface DashboardCorretorClientProps {
  imoveis: Imovel[];
}

export default function DashboardCorretorClient({ imoveis }: DashboardCorretorClientProps) {
  const [modalRecargaAberto, setModalRecargaAberto] = useState(false);
  const [saldoCreditos, setSaldoCreditos] = useState(5);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Faixa de Prova Social Local (Taboão da Serra) */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-xl p-3 mb-6 flex items-center justify-between text-xs text-amber-900">
        <div className="flex items-center gap-2 font-medium">
          <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
          <span>
            <strong>Prova Social:</strong> 14 imóveis foram publicados e 3 vendidos em <strong>Taboão da Serra</strong> nesta semana usando nossa plataforma!
          </span>
        </div>
        <span className="hidden md:inline-block text-[10px] font-bold uppercase tracking-wider bg-amber-200/60 px-2 py-0.5 rounded-md">
          Região Ativa 🔥
        </span>
      </div>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b pb-6 border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Painel do Corretor</h1>
            <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> PRO
            </span>
          </div>
          <p className="text-gray-600 text-sm mt-1">
            Gerencie seus anúncios, acompanhe seus backups e recarregue créditos via Mercado Pago.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/dashboard/novo"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Cadastrar Novo Imóvel
          </Link>
        </div>
      </div>

      {/* Header com Saldo de Créditos */}
      <HeaderSaldoCreditos
        saldoCreditos={saldoCreditos}
        planoAtual="Pro"
        onAbrirRecarga={() => setModalRecargaAberto(true)}
      />

      {/* Banner de Gamificação da Central de Backups */}
      <BannerBackupGamificacao
        gigabytesEconomizados={4.5}
        totalFotosBackup={imoveis.length * 5 + 15}
        onAbrirBackupModal={() => alert('Abrindo Central de Fotos R2 do Corretor...')}
      />

      {/* Tabela de Imóveis Existente */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" /> Seus Imóveis Cadastrados
          </h2>
        </div>
        <TabelaImoveis imoveis={imoveis} />
      </div>

      {/* Modal de Recarga Mercado Pago (3 Planos) */}
      <ModalRecargaCreditos
        isOpen={modalRecargaAberto}
        onClose={() => setModalRecargaAberto(false)}
        userEmail="corretor@taboao.com.br"
      />
    </div>
  );
}
