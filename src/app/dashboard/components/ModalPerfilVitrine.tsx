'use client';

import { useState } from 'react';
import { Camera, Check, Copy, ExternalLink, MessageCircle, Save, Sparkles, UserCheck } from 'lucide-react';
import { atualizarPerfilCorretor } from '@/lib/api';

interface ModalPerfilVitrineProps {
  aberto: boolean;
  onClose: () => void;
  usuario: {
    nome?: string;
    email?: string;
    telefone?: string;
    foto_perfil_url?: string;
    apresentacao?: string;
    creci?: string;
    slug?: string;
    codigo_corretor?: string;
  } | null;
  onPerfilAtualizado: (novoPerfil: any) => void;
}

export default function ModalPerfilVitrine({
  aberto,
  onClose,
  usuario,
  onPerfilAtualizado,
}: ModalPerfilVitrineProps) {
  const [nome, setNome] = useState(usuario?.nome || '');
  const [telefone, setTelefone] = useState(usuario?.telefone || '');
  const [creci, setCreci] = useState(usuario?.creci || '');
  const [apresentacao, setApresentacao] = useState(usuario?.apresentacao || '');
  const [fotoUrl, setFotoUrl] = useState(usuario?.foto_perfil_url || '');
  const [salvando, setSalvando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  if (!aberto) return null;

  const slugCorretor = usuario?.slug || (usuario?.nome ? usuario.nome.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'corretor');
  const vitrineUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/corretor/${slugCorretor}`
    : `/corretor/${slugCorretor}`;

  const handleCopiarLink = async () => {
    try {
      await navigator.clipboard.writeText(vitrineUrl);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    setMensagemSucesso(false);

    try {
      const res = await atualizarPerfilCorretor({
        nome,
        telefone,
        creci,
        apresentacao,
        foto_perfil_url: fotoUrl,
      });

      if (res.success && res.data) {
        setMensagemSucesso(true);
        onPerfilAtualizado(res.data);
        setTimeout(() => setMensagemSucesso(false), 3000);
      } else {
        setErro(res.error || 'Falha ao salvar perfil.');
      }
    } catch (err: any) {
      setErro(err.message || 'Erro inesperado.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-brand-900 border border-brand-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header do Modal */}
        <div className="px-6 py-4 border-b border-brand-700/60 bg-brand-850 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Minha Vitrine Pública</h3>
              <p className="text-xs text-white-60">Personalize sua página exclusiva de anúncios</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white-60 hover:text-white p-2 rounded-lg hover:bg-brand-700/50 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Corpo com scroll */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Card do Link da Vitrine */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-brand-800 to-brand-750 border border-gold/30 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Seu Link Exclusivo de Divulgação
              </span>
              <a
                href={`/corretor/${slugCorretor}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-white-80 hover:text-white flex items-center gap-1 underline underline-offset-2"
              >
                Abrir vitrine <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                readOnly
                value={vitrineUrl}
                className="flex-1 bg-brand-950/80 border border-brand-700 rounded-lg px-3 py-2 text-xs text-white-90 font-mono truncate"
              />
              <button
                type="button"
                onClick={handleCopiarLink}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 ${
                  copiado
                    ? 'bg-success text-brand-950'
                    : 'bg-gold hover:bg-gold-400 text-brand-950'
                }`}
              >
                {copiado ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiado ? 'Link Copiado!' : 'Copiar Link'}
              </button>
            </div>
            <p className="text-[11px] text-white-60 mt-2">
              Ideal para colocar na bio do seu Instagram, enviar no WhatsApp ou compartilhar com clientes!
            </p>
          </div>

          {mensagemSucesso && (
            <div className="p-3 bg-success/20 border border-success/40 rounded-xl text-success text-sm flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              Perfil atualizado com sucesso! Sua vitrine já está com as novas informações.
            </div>
          )}

          {erro && (
            <div className="p-3 bg-danger/20 border border-danger/40 rounded-xl text-danger text-sm">
              {erro}
            </div>
          )}

          {/* Formulário de Edição */}
          <form onSubmit={handleSalvar} className="space-y-4">
            {/* Foto de Perfil */}
            <div>
              <label className="block text-xs font-semibold text-white-80 mb-2">
                Foto de Perfil (URL da Imagem)
              </label>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full border-2 border-gold/40 bg-brand-800 overflow-hidden shrink-0 flex items-center justify-center">
                  {fotoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={fotoUrl}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover"
                      onError={() => setFotoUrl('')}
                    />
                  ) : (
                    <Camera className="w-6 h-6 text-white-40" />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="url"
                    value={fotoUrl}
                    onChange={(e) => setFotoUrl(e.target.value)}
                    placeholder="https://exemplo.com/sua-foto.jpg"
                    className="w-full bg-brand-800 border border-brand-700 rounded-lg px-3 py-2 text-sm text-white placeholder-white-40 focus:outline-none focus:border-gold"
                  />
                  <p className="text-[11px] text-white-50 mt-1">
                    Cole o link direto da sua foto profissional (hospedada no Cloudinary, Google Drive público ou site).
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white-80 mb-1.5">
                  Nome Profissional
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  placeholder="Ex: Carlos Silva"
                  className="w-full bg-brand-800 border border-brand-700 rounded-lg px-3 py-2 text-sm text-white placeholder-white-40 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white-80 mb-1.5">
                  Número de CRECI
                </label>
                <input
                  type="text"
                  value={creci}
                  onChange={(e) => setCreci(e.target.value)}
                  placeholder="Ex: 184.290-F"
                  className="w-full bg-brand-800 border border-brand-700 rounded-lg px-3 py-2 text-sm text-white placeholder-white-40 focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white-80 mb-1.5">
                WhatsApp de Contato (receber leads)
              </label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(11) 98765-4321"
                className="w-full bg-brand-800 border border-brand-700 rounded-lg px-3 py-2 text-sm text-white placeholder-white-40 focus:outline-none focus:border-gold"
              />
              <p className="text-[11px] text-white-50 mt-1">
                Os botões da sua vitrine enviarão os clientes diretamente para este número.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white-80 mb-1.5">
                Texto de Apresentação / Sobre Você
              </label>
              <textarea
                rows={4}
                value={apresentacao}
                onChange={(e) => setApresentacao(e.target.value)}
                placeholder="Ex: Especialista no mercado imobiliário de Taboão da Serra e região há mais de 8 anos. Atendimento personalizado para compra, venda e locação segura do seu imóvel."
                className="w-full bg-brand-800 border border-brand-700 rounded-lg px-3 py-2 text-sm text-white placeholder-white-40 focus:outline-none focus:border-gold"
              />
              <p className="text-[11px] text-white-50 mt-1">
                Aparecerá com destaque no topo da sua vitrine pública.
              </p>
            </div>

            {/* Ações do Formulário */}
            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg border border-brand-700 text-white-70 hover:text-white text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="px-6 py-2.5 rounded-lg bg-gold hover:bg-gold-400 text-brand-950 font-bold text-sm flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {salvando ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
