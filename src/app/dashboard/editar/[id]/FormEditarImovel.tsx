'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Imovel } from '@/types/imovel';
import { updateAnuncioForBroker } from '@/lib/api';
import { Sparkles, ArrowLeft, Save, Trash2, ArrowLeftRight, Star, Info } from 'lucide-react';
import Link from 'next/link';

interface FormEditarImovelProps {
  imovel: Imovel;
  proprietarioInicial?: any;
}

const parseOptionalNumber = (val: any): number | null => {
  if (val === '' || val === null || val === undefined) return null;
  const num = Number(val);
  return isNaN(num) ? null : num;
};

const parseOptionalString = (val: any): string | null => {
  if (val === '' || val === null || val === undefined) return null;
  const str = String(val).trim();
  return str.length > 0 ? str : null;
};

export default function FormEditarImovel({ imovel }: FormEditarImovelProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Imovel>({
    ...imovel,
    titulo: imovel.titulo || '',
    descricao: imovel.descricao || '',
    tipoImovel: imovel.tipoImovel || '',
    transacao: imovel.transacao || '',
    condominio: imovel.condominio || '',
    endereco: {
      rua: imovel.endereco?.rua || '',
      numero: imovel.endereco?.numero || '',
      bairro: imovel.endereco?.bairro || '',
      cidade: imovel.endereco?.cidade || '',
      estado: imovel.endereco?.estado || '',
      cep: imovel.endereco?.cep || '',
    },
    caracteristicas: {
      quartos: imovel.caracteristicas?.quartos ?? null,
      suites: imovel.caracteristicas?.suites ?? null,
      banheiros: imovel.caracteristicas?.banheiros ?? null,
      vagas: imovel.caracteristicas?.vagas ?? null,
      areaUtil: imovel.caracteristicas?.areaUtil ?? null,
      areaTotal: imovel.caracteristicas?.areaTotal ?? null,
    },
    fotos: imovel.fotos || [],
  });

  const moverFoto = (index: number, direcao: 'esquerda' | 'direita') => {
    const novasFotos = [...(formData.fotos || [])];
    const targetIndex = direcao === 'esquerda' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= novasFotos.length) return;

    const temp = novasFotos[targetIndex];
    novasFotos[targetIndex] = novasFotos[index];
    novasFotos[index] = temp;
    setFormData({ ...formData, fotos: novasFotos });
  };

  const definirComoCapa = (index: number) => {
    if (index === 0) return;
    const fotos = [...(formData.fotos || [])];
    const fotoSelecionada = fotos[index];
    const fotosFiltradas = fotos.filter((_, i) => i !== index);
    setFormData({ ...formData, fotos: [fotoSelecionada, ...fotosFiltradas] });
  };

  const removerFoto = (index: number) => {
    if (confirm('Deseja remover esta foto do anúncio?')) {
      const fotos = (formData.fotos || []).filter((_, i) => i !== index);
      setFormData({ ...formData, fotos });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: Record<string, any> = {
        titulo: parseOptionalString(formData.titulo) || formData.titulo,
        descricao: parseOptionalString(formData.descricao) || '',
        tipoImovel: parseOptionalString(formData.tipoImovel) || undefined,
        transacao: formData.transacao === 'Locação' ? 'Locacao' : (formData.transacao === 'Venda' ? 'Venda' : (parseOptionalString(formData.transacao) || undefined)),
        precoVenda: parseOptionalNumber(formData.precoVenda),
        precoLocacao: parseOptionalNumber(formData.precoLocacao),
        precoPacote: parseOptionalNumber(formData.precoPacote),
        valorCondominio: parseOptionalNumber(formData.valorCondominio),
        iptuMensal: parseOptionalNumber(formData.iptuMensal),
        condominio: parseOptionalString(formData.condominio),
        endereco: {
          rua: parseOptionalString(formData.endereco?.rua),
          numero: parseOptionalString(formData.endereco?.numero),
          bairro: parseOptionalString(formData.endereco?.bairro),
          cidade: parseOptionalString(formData.endereco?.cidade),
          estado: parseOptionalString(formData.endereco?.estado),
          cep: parseOptionalString(formData.endereco?.cep),
        },
        caracteristicas: {
          quartos: parseOptionalNumber(formData.caracteristicas?.quartos),
          suites: parseOptionalNumber(formData.caracteristicas?.suites),
          banheiros: parseOptionalNumber(formData.caracteristicas?.banheiros),
          vagas: parseOptionalNumber(formData.caracteristicas?.vagas),
          areaUtil: parseOptionalNumber(formData.caracteristicas?.areaUtil),
          areaTotal: parseOptionalNumber(formData.caracteristicas?.areaTotal),
        },
        fotos: formData.fotos || [],
      };

      const res = await updateAnuncioForBroker(imovel.id, payload);
      if (res.success) {
        alert('Anúncio atualizado com sucesso no portal!');
        router.push('/dashboard');
      } else {
        alert(res.error || res.message || 'Erro ao atualizar anúncio.');
      }
    } catch (err: any) {
      alert(`Erro ao salvar: ${err.message || 'Falha na conexão'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Seção 1: Informações Principais */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          Informações Principais
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Referência</label>
            <input
              type="text"
              disabled
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-sm font-bold text-slate-700 cursor-not-allowed"
              value={formData.referencia}
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Título do Anúncio *</label>
            <input
              type="text"
              required
              className="w-full border border-slate-200 rounded-xl p-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.titulo}
              onChange={e => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Ex: Apartamento 2 Dormitórios no Condomínio Pitangueiras 2"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Descrição Comercial</label>
          <textarea
            rows={4}
            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent leading-relaxed"
            value={formData.descricao}
            onChange={e => setFormData({ ...formData, descricao: e.target.value })}
            placeholder="Descreva os diferenciais, acabamento, vista e condições do imóvel..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Transação</label>
            <select
              className="w-full border border-slate-200 rounded-xl p-2.5 text-sm bg-white font-medium"
              value={formData.transacao || ''}
              onChange={e => setFormData({ ...formData, transacao: e.target.value as any })}
            >
              {!formData.transacao && <option value="">Não informado</option>}
              <option value="Venda">Venda</option>
              <option value="Locação">Locação</option>
              {formData.transacao === 'Venda e Locação' && <option value="Venda e Locação">Venda e Locação</option>}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Tipo de Imóvel</label>
            <input
              type="text"
              className="w-full border border-slate-200 rounded-xl p-2.5 text-sm"
              value={formData.tipoImovel}
              onChange={e => setFormData({ ...formData, tipoImovel: e.target.value })}
              placeholder="Ex: Apartamento, Casa, Terreno, Galpão"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Nome do Condomínio / Edifício</label>
            <input
              type="text"
              className="w-full border border-slate-200 rounded-xl p-2.5 text-sm"
              value={formData.condominio || ''}
              onChange={e => setFormData({ ...formData, condominio: e.target.value })}
              placeholder="Ex: Condomínio Pitangueiras 2"
            />
          </div>
        </div>
      </section>

      {/* Seção 2: Características e Valores */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
          Características e Valores
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Quartos</label>
            <input
              type="number"
              min={0}
              placeholder="Não informado"
              className="w-full border border-slate-200 rounded-xl p-2.5 text-sm"
              value={formData.caracteristicas.quartos ?? ''}
              onChange={e => setFormData({
                ...formData,
                caracteristicas: { ...formData.caracteristicas, quartos: e.target.value === '' ? null : Number(e.target.value) }
              })}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Suítes</label>
            <input
              type="number"
              min={0}
              placeholder="Não informado"
              className="w-full border border-slate-200 rounded-xl p-2.5 text-sm"
              value={formData.caracteristicas.suites ?? ''}
              onChange={e => setFormData({
                ...formData,
                caracteristicas: { ...formData.caracteristicas, suites: e.target.value === '' ? null : Number(e.target.value) }
              })}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Banheiros</label>
            <input
              type="number"
              min={0}
              placeholder="Não informado"
              className="w-full border border-slate-200 rounded-xl p-2.5 text-sm"
              value={formData.caracteristicas.banheiros ?? ''}
              onChange={e => setFormData({
                ...formData,
                caracteristicas: { ...formData.caracteristicas, banheiros: e.target.value === '' ? null : Number(e.target.value) }
              })}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Vagas</label>
            <input
              type="number"
              min={0}
              placeholder="Não informado"
              className="w-full border border-slate-200 rounded-xl p-2.5 text-sm"
              value={formData.caracteristicas.vagas ?? ''}
              onChange={e => setFormData({
                ...formData,
                caracteristicas: { ...formData.caracteristicas, vagas: e.target.value === '' ? null : Number(e.target.value) }
              })}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Área Útil (m²)</label>
            <input
              type="number"
              min={0}
              placeholder="Não informado"
              className="w-full border border-slate-200 rounded-xl p-2.5 text-sm"
              value={formData.caracteristicas.areaUtil ?? ''}
              onChange={e => setFormData({
                ...formData,
                caracteristicas: { ...formData.caracteristicas, areaUtil: e.target.value === '' ? null : Number(e.target.value) }
              })}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Área Total (m²)</label>
            <input
              type="number"
              min={0}
              placeholder="Não informado"
              className="w-full border border-slate-200 rounded-xl p-2.5 text-sm"
              value={formData.caracteristicas.areaTotal ?? ''}
              onChange={e => setFormData({
                ...formData,
                caracteristicas: { ...formData.caracteristicas, areaTotal: e.target.value === '' ? null : Number(e.target.value) }
              })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Preço de Venda (R$)</label>
            <input
              type="number"
              min={0}
              placeholder="Não informado"
              className="w-full border border-slate-200 rounded-xl p-2.5 text-sm font-bold text-blue-900"
              value={formData.precoVenda ?? ''}
              onChange={e => setFormData({ ...formData, precoVenda: e.target.value === '' ? undefined : Number(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Preço de Locação (R$)</label>
            <input
              type="number"
              min={0}
              placeholder="Não informado"
              className="w-full border border-slate-200 rounded-xl p-2.5 text-sm font-bold text-emerald-900"
              value={formData.precoLocacao ?? ''}
              onChange={e => setFormData({ ...formData, precoLocacao: e.target.value === '' ? undefined : Number(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Condomínio Mensal (R$)</label>
            <input
              type="number"
              min={0}
              placeholder="Não informado"
              className="w-full border border-slate-200 rounded-xl p-2.5 text-sm"
              value={formData.valorCondominio ?? ''}
              onChange={e => setFormData({ ...formData, valorCondominio: e.target.value === '' ? undefined : Number(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">IPTU Mensal (R$)</label>
            <input
              type="number"
              min={0}
              placeholder="Não informado"
              className="w-full border border-slate-200 rounded-xl p-2.5 text-sm"
              value={formData.iptuMensal ?? ''}
              onChange={e => setFormData({ ...formData, iptuMensal: e.target.value === '' ? undefined : Number(e.target.value) })}
            />
          </div>
        </div>
      </section>

      {/* Seção 3: Localização */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-violet-600"></span>
          Localização e Endereço
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Logradouro / Rua</label>
            <input
              type="text"
              placeholder="Ex: Estrada das Olarias"
              className="w-full border border-slate-200 rounded-xl p-2.5 text-sm"
              value={formData.endereco.rua}
              onChange={e => setFormData({ ...formData, endereco: { ...formData.endereco, rua: e.target.value } })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Número</label>
            <input
              type="text"
              placeholder="Ex: 500"
              className="w-full border border-slate-200 rounded-xl p-2.5 text-sm"
              value={formData.endereco.numero}
              onChange={e => setFormData({ ...formData, endereco: { ...formData.endereco, numero: e.target.value } })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Bairro</label>
            <input
              type="text"
              placeholder="Ex: Jardim Guida"
              className="w-full border border-slate-200 rounded-xl p-2.5 text-sm"
              value={formData.endereco.bairro}
              onChange={e => setFormData({ ...formData, endereco: { ...formData.endereco, bairro: e.target.value } })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Cidade</label>
            <input
              type="text"
              placeholder="Ex: Taboão da Serra"
              className="w-full border border-slate-200 rounded-xl p-2.5 text-sm"
              value={formData.endereco.cidade}
              onChange={e => setFormData({ ...formData, endereco: { ...formData.endereco, cidade: e.target.value } })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Estado (UF)</label>
            <input
              type="text"
              placeholder="Ex: SP"
              maxLength={2}
              className="w-full border border-slate-200 rounded-xl p-2.5 text-sm uppercase"
              value={formData.endereco.estado}
              onChange={e => setFormData({ ...formData, endereco: { ...formData.endereco, estado: e.target.value } })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">CEP</label>
            <input
              type="text"
              placeholder="Ex: 06765-000"
              className="w-full border border-slate-200 rounded-xl p-2.5 text-sm"
              value={formData.endereco.cep}
              onChange={e => setFormData({ ...formData, endereco: { ...formData.endereco, cep: e.target.value } })}
            />
          </div>
        </div>
      </section>

      {/* Seção 4: Gerenciamento de Fotos */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Galeria e Fotos ({formData.fotos?.length || 0})
          </h2>
          <span className="text-xs text-slate-500 font-medium">A primeira foto é a Capa principal</span>
        </div>

        {(!formData.fotos || formData.fotos.length === 0) ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-sm font-semibold text-slate-600">Nenhuma foto anexada a este anúncio no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {formData.fotos.map((foto, idx) => (
              <div
                key={`${foto}-${idx}`}
                className={`relative group bg-slate-50 rounded-xl border-2 p-2 flex flex-col justify-between transition-all ${
                  idx === 0 ? 'border-amber-500 shadow-xs ring-2 ring-amber-300/40' : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                {idx === 0 && (
                  <span className="absolute top-1.5 left-1.5 bg-amber-500 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded-md shadow-xs z-10 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" /> Capa
                  </span>
                )}

                <div className="relative aspect-square w-full overflow-hidden rounded-lg mb-2">
                  <img src={foto} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                </div>

                <div className="flex flex-col gap-1.5 text-xs">
                  <div className="flex justify-between items-center bg-slate-100 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => moverFoto(idx, 'esquerda')}
                      disabled={idx === 0}
                      title="Mover para esquerda"
                      className="p-1 text-slate-600 hover:text-blue-600 disabled:opacity-30"
                    >
                      ◀
                    </button>
                    <span className="font-bold text-[11px] text-slate-500">#{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => moverFoto(idx, 'direita')}
                      disabled={idx === (formData.fotos?.length || 0) - 1}
                      title="Mover para direita"
                      className="p-1 text-slate-600 hover:text-blue-600 disabled:opacity-30"
                    >
                      ▶
                    </button>
                  </div>

                  {idx !== 0 && (
                    <button
                      type="button"
                      onClick={() => definirComoCapa(idx)}
                      className="w-full text-[10px] bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 font-bold py-1 rounded-lg transition-colors"
                    >
                      Definir como Capa
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => removerFoto(idx)}
                    className="w-full text-[10px] text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 py-1 rounded-lg font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 mt-4">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-900 space-y-1">
            <p className="font-bold">Como adicionar novas fotos?</p>
            <p className="text-blue-700 leading-relaxed">
              Para incluir fotos em alta resolução com otimização automática e geração do Media Kit por IA, envie as imagens pelo fluxo de captação no WhatsApp informando a referência <strong>{formData.referencia}</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className={`flex-1 text-white py-3.5 px-6 rounded-xl font-black text-sm uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition-all ${
            loading ? 'bg-slate-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99]'
          }`}
        >
          <Save className="w-4 h-4" />
          {loading ? 'Salvando Alterações...' : 'Salvar Alterações'}
        </button>

        <Link
          href="/dashboard"
          className="px-6 py-3.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-bold text-sm text-center transition-colors"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
