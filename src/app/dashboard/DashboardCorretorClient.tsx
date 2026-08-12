'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Imovel } from '@/types/imovel';
import HeaderSaldoCreditos from './components/HeaderSaldoCreditos';
import BannerBackupGamificacao from './components/BannerBackupGamificacao';
import ModalRecargaCreditos from './components/ModalRecargaCreditos';
import TabelaImoveis from './TabelaImoveis';
import { Sparkles, ShieldCheck, Flame, LogOut, UserCheck } from 'lucide-react';

import { API_BASE_URL } from '@/lib/api';

interface DashboardCorretorClientProps {
  imoveis: Imovel[];
}

export default function DashboardCorretorClient({ imoveis }: DashboardCorretorClientProps) {
  const router = useRouter();
  const [modalRecargaAberto, setModalRecargaAberto] = useState(false);
  const [usuario, setUsuario] = useState<{ email: string; nome: string; saldo_creditos: number; plano_atual: string } | null>(null);

  useEffect(() => {
    // 1. Carrega dados salvos locais primeiro para ser super veloz
    const savedUser = localStorage.getItem('user_info');
    if (savedUser) {
      try {
        setUsuario(JSON.parse(savedUser));
      } catch {}
    } else {
      // Usuário padrão de teste se ainda não tiver feito login
      const defaultUser = {
        nome: 'Corretor Brazza',
        email: 'corretorbrazza@gmail.com',
        saldo_creditos: 1,
        plano_atual: 'start',
      };
      setUsuario(defaultUser);
      localStorage.setItem('user_info', JSON.stringify(defaultUser));
    }

    // 2. Valida token com a API
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.user) {
            setUsuario(json.user);
            localStorage.setItem('user_info', JSON.stringify(json.user));
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  };

  const totalFotosReal = (imoveis || []).reduce((acc, item) => acc + (item.fotos?.length || 0), 0);
  const totalMegas = totalFotosReal * 2.5;
  const espacoTexto = totalMegas >= 1024 ? `${(totalMegas / 1024).toFixed(1)} GB` : `${totalMegas.toFixed(0)} MB`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b pb-6 border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {usuario ? `Olá, ${usuario.nome}` : 'Painel do Corretor'}
            </h1>
            <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> {usuario?.plano_atual?.toUpperCase() || 'START'}
            </span>
          </div>
          <p className="text-gray-600 text-sm mt-1">
            {usuario ? `Sessão autenticada: ${usuario.email}` : 'Gerencie seus imóveis, acompanhe seus backups e recarregue créditos via Mercado Pago.'}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={handleLogout}
            title="Encerrar Sessão Segura"
            className="p-3 text-gray-500 hover:text-red-600 hover:bg-red-50 border border-gray-200 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Header com Saldo de Créditos */}
      <HeaderSaldoCreditos
        saldoCreditos={usuario?.saldo_creditos ?? 1}
        planoAtual={usuario?.plano_atual || 'Start'}
        onAbrirRecarga={() => setModalRecargaAberto(true)}
      />

      {/* Banner da Central de Fotos & Backups */}
      <BannerBackupGamificacao
        totalFotosBackup={totalFotosReal}
        espacoTexto={espacoTexto}
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
        userEmail={usuario?.email || 'corretor@taboao.com.br'}
      />
    </div>
  );
}
