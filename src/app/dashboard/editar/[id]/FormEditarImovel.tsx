'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { salvarEPublicarImovelAction } from '@/app/actions/imovel-server-actions';
import { Imovel } from '@/types/imovel';

export default function FormEditarImovel({ imovel, proprietarioInicial }: { imovel: Imovel, proprietarioInicial: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<Imovel>(imovel);
  const [propData, setPropData] = useState({
    nome: proprietarioInicial?.nome || '',
    telefone: proprietarioInicial?.telefone || '',
    email: proprietarioInicial?.email || '',
    observacoes: proprietarioInicial?.observacoes || ''
  });

  const CORRETORES = [
    { nome: 'BRAZZA', telefone: '5511932785602' },
    { nome: 'MARIA', telefone: '5511970988512' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const combined = [...selectedFiles, ...newFiles];
      const totalSize = combined.reduce((acc, file) => acc + file.size, 0);
      const maxSize = 20 * 1024 * 1024; // 20MB

      if (totalSize > maxSize) {
        alert(`O tamanho total das novas fotos (${(totalSize / 1024 / 1024).toFixed(2)}MB) excede 20MB. Por favor, selecione fotos menores.`);
        return;
      }

      setSelectedFiles(combined);
      e.target.value = ''; // Limpa para poder adicionar mais
    }
  };

  const moverFotoEsquerda = (index: number) => {
    if (index <= 0) return;
    const fotos = [...(formData.fotos || [])];
    const temp = fotos[index - 1];
    fotos[index - 1] = fotos[index];
    fotos[index] = temp;
    setFormData({ ...formData, fotos });
  };

  const moverFotoDireita = (index: number) => {
    const fotos = [...(formData.fotos || [])];
    if (index >= fotos.length - 1) return;
    const temp = fotos[index + 1];
    fotos[index + 1] = fotos[index];
    fotos[index] = temp;
    setFormData({ ...formData, fotos });
  };

  const definirComoCapa = (index: number) => {
    if (index === 0) return;
    const fotos = [...(formData.fotos || [])];
    const fotoSelecionada = fotos[index];
    const fotosFiltradas = fotos.filter((_, i) => i !== index);
    setFormData({ ...formData, fotos: [fotoSelecionada, ...fotosFiltradas] });
  };

  const removerFotoExistente = (index: number) => {
    if (confirm('Deseja remover esta foto do imóvel?')) {
      const fotos = (formData.fotos || []).filter((_, i) => i !== index);
      setFormData({ ...formData, fotos });
    }
  };

  const removerNovaFoto = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('imovel', JSON.stringify(formData));
      data.append('proprietario', JSON.stringify(propData));

      selectedFiles.forEach(file => {
        data.append('fotos', file);
      });

      const result = await salvarEPublicarImovelAction(data);

      if (result.success) {
        alert('Imóvel atualizado com sucesso!');
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      alert('Erro ao atualizar o imóvel.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Seção 1: Informações Básicas */}
      <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-lg font-bold border-b pb-2">Informações Básicas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700">Referência (Não alterável)</label>
            <input
              type="text" disabled
              className="mt-1 block w-full border bg-gray-50 rounded-md p-2 font-mono"
              value={formData.referencia}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Título do Imóvel</label>
            <input
              type="text" required
              className="mt-1 block w-full border rounded-md p-2"
              value={formData.titulo}
              onChange={e => setFormData({ ...formData, titulo: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Descrição Detalhada</label>
          <textarea
            rows={4} required
            className="mt-1 block w-full border rounded-md p-2"
            value={formData.descricao}
            onChange={e => setFormData({ ...formData, descricao: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Transação</label>
            <select
              className="mt-1 block w-full border rounded-md p-2"
              value={formData.transacao}
              onChange={e => setFormData({ ...formData, transacao: e.target.value as any })}
            >
              <option value="Venda">Venda</option>
              <option value="Locação">Locação</option>
              <option value="Venda e Locação">Venda e Locação</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo do Imóvel</label>
            <input
              type="text"
              className="mt-1 block w-full border rounded-md p-2"
              value={formData.tipoImovel}
              onChange={e => setFormData({ ...formData, tipoImovel: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Corretor Responsável</label>
            <select
              className="mt-1 block w-full border rounded-md p-2 bg-blue-50/50"
              value={formData.corretor?.nome || 'BRAZZA'}
              onChange={e => {
                const selectCorretor = CORRETORES.find(c => c.nome === e.target.value);
                if (selectCorretor) {
                  setFormData({ ...formData, corretor: selectCorretor });
                }
              }}
            >
              {CORRETORES.map(c => (
                <option key={c.nome} value={c.nome}>{c.nome}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Seção: Mídia */}
      <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <div className="border-b pb-2">
          <h2 className="text-lg font-bold">Mídia e Gerenciamento de Fotos</h2>
          <p className="text-xs text-gray-500 mt-1">
            A <strong>1ª foto (destacada como Capa)</strong> é a imagem principal usada nas buscas, cards do site e compartilhamentos SEO. Reordene as fotos para alterar a capa.
          </p>
        </div>

        {/* Fotos Existentes */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Fotos Salvas ({formData.fotos?.length || 0})
          </label>

          {(!formData.fotos || formData.fotos.length === 0) ? (
            <p className="text-sm text-gray-400 italic">Nenhuma foto cadastrada para este imóvel.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {formData.fotos.map((foto, idx) => (
                <div
                  key={`${foto}-${idx}`}
                  className={`relative group bg-gray-50 rounded-lg border-2 p-2 flex flex-col justify-between transition-all ${
                    idx === 0 ? 'border-amber-500 shadow-md ring-2 ring-amber-300/50' : 'border-gray-200 hover:border-blue-400'
                  }`}
                >
                  {/* Badge de Capa */}
                  {idx === 0 && (
                    <span className="absolute top-1 left-1 bg-amber-500 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded shadow z-10">
                      ⭐ Capa / SEO
                    </span>
                  )}

                  {/* Imagem */}
                  <div className="relative aspect-square w-full overflow-hidden rounded mb-2">
                    <img src={foto} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex flex-col gap-1 text-xs">
                    <div className="flex justify-between items-center bg-gray-100 p-1 rounded">
                      <button
                        type="button"
                        onClick={() => moverFotoEsquerda(idx)}
                        disabled={idx === 0}
                        title="Mover para esquerda"
                        className="p-1 text-gray-600 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-gray-600"
                      >
                        ⬅️
                      </button>
                      <span className="font-bold text-[11px] text-gray-500">#{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => moverFotoDireita(idx)}
                        disabled={idx === (formData.fotos?.length || 0) - 1}
                        title="Mover para direita"
                        className="p-1 text-gray-600 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-gray-600"
                      >
                        ➡️
                      </button>
                    </div>

                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => definirComoCapa(idx)}
                        className="w-full text-[10px] bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 font-semibold py-1 rounded transition-colors"
                      >
                        Tornar Capa
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => removerFotoExistente(idx)}
                      className="w-full text-[10px] text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 py-0.5 rounded font-medium transition-colors"
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload de Novas Fotos */}
        <div className="pt-4 border-t border-gray-100">
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Incluir Novas Fotos (Adiciona sem apagar as fotos acima)
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Você pode selecionar vários arquivos de imagem. Eles serão adicionados à lista de fotos do imóvel ao salvar.
          </p>

          <input
            type="file" multiple accept="image/*"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            onChange={handleFileChange}
          />

          {/* Previews de Novas Fotos a Incluir */}
          {selectedFiles.length > 0 && (
            <div className="mt-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">
                  Novas Fotos Selecionadas para Adicionar ({selectedFiles.length})
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedFiles([])}
                  className="text-xs text-red-600 hover:underline"
                >
                  Limpar Seleção
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="relative bg-white rounded border p-1 shadow-sm flex flex-col items-center">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${idx + 1}`}
                      className="h-16 w-full object-cover rounded"
                    />
                    <span className="text-[9px] text-gray-500 truncate w-full text-center mt-1">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removerNovaFoto(idx)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow hover:bg-red-700"
                      title="Remover este arquivo da lista a ser enviada"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-gray-100">
          <label className="block text-sm font-medium text-gray-700">Link do Vídeo (YouTube/Vimeo)</label>
          <input
            type="url"
            className="mt-1 block w-full border rounded-md p-2"
            value={formData.videoUrl || ''}
            onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
          />
        </div>
      </section>

      {/* Seção: Localização */}
      <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-lg font-bold border-b pb-2">Localização</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <input type="text" placeholder="Rua" className="block w-full border rounded-md p-2" value={formData.endereco.rua} onChange={e => setFormData({ ...formData, endereco: { ...formData.endereco, rua: e.target.value } })} />
          </div>
          <div>
            <input type="text" placeholder="Nº" className="block w-full border rounded-md p-2" value={formData.endereco.numero} onChange={e => setFormData({ ...formData, endereco: { ...formData.endereco, numero: e.target.value } })} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Bairro" className="border rounded-md p-2" value={formData.endereco.bairro} onChange={e => setFormData({ ...formData, endereco: { ...formData.endereco, bairro: e.target.value } })} />
          <input type="text" placeholder="Cidade" className="border rounded-md p-2" value={formData.endereco.cidade} onChange={e => setFormData({ ...formData, endereco: { ...formData.endereco, cidade: e.target.value } })} />
          <input type="text" placeholder="Estado" className="border rounded-md p-2" value={formData.endereco.estado} onChange={e => setFormData({ ...formData, endereco: { ...formData.endereco, estado: e.target.value } })} />
        </div>
      </section>

      {/* Seção: Características e Preço */}
      <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-lg font-bold border-b pb-2">Características e Valores</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Quartos</label>
            <input type="number" placeholder="Quartos" className="w-full border rounded-md p-2" value={formData.caracteristicas.quartos} onChange={e => setFormData({ ...formData, caracteristicas: { ...formData.caracteristicas, quartos: Number(e.target.value) } })} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Suítes</label>
            <input type="number" placeholder="Suítes" className="w-full border rounded-md p-2" value={formData.caracteristicas.suites} onChange={e => setFormData({ ...formData, caracteristicas: { ...formData.caracteristicas, suites: Number(e.target.value) } })} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Banheiros</label>
            <input type="number" placeholder="Banheiros" className="w-full border rounded-md p-2" value={formData.caracteristicas.banheiros} onChange={e => setFormData({ ...formData, caracteristicas: { ...formData.caracteristicas, banheiros: Number(e.target.value) } })} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Vagas</label>
            <input type="number" placeholder="Vagas" className="w-full border rounded-md p-2" value={formData.caracteristicas.vagas} onChange={e => setFormData({ ...formData, caracteristicas: { ...formData.caracteristicas, vagas: Number(e.target.value) } })} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Área Útil (m²)</label>
            <input type="number" placeholder="Área Útil" className="w-full border rounded-md p-2" value={formData.caracteristicas.areaUtil} onChange={e => setFormData({ ...formData, caracteristicas: { ...formData.caracteristicas, areaUtil: Number(e.target.value) } })} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Área Total (m²)</label>
            <input type="number" placeholder="Área Total" className="w-full border rounded-md p-2" value={formData.caracteristicas.areaTotal} onChange={e => setFormData({ ...formData, caracteristicas: { ...formData.caracteristicas, areaTotal: Number(e.target.value) } })} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <label className="text-blue-700 font-bold text-sm">Preço Venda</label>
            <input type="number" className="block w-full border rounded-md p-2" value={formData.precoVenda || ''} onChange={e => setFormData({ ...formData, precoVenda: Number(e.target.value) })} />
          </div>
          <div>
            <label className="text-green-700 font-bold text-sm">Preço Locação</label>
            <input type="number" className="block w-full border rounded-md p-2" value={formData.precoLocacao || ''} onChange={e => setFormData({ ...formData, precoLocacao: Number(e.target.value) })} />
          </div>
        </div>
        <div className="flex gap-6 pt-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.destaque} onChange={e => setFormData({ ...formData, destaque: e.target.checked })} />
            <span>Destaque</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.status === 'Ativo'} onChange={e => setFormData({ ...formData, status: e.target.checked ? 'Ativo' : 'Inativo' })} />
            <span>Ativo</span>
          </label>
        </div>
      </section>

      {/* Seção 4: Dados do Proprietário (Apenas Local) */}
      <section className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-300 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <h2 className="text-lg font-bold text-gray-800">Dados Privados do Proprietário</h2>
          <span className="text-[10px] font-black uppercase bg-gray-200 px-2 py-1 rounded text-gray-600 tracking-tighter">Apenas Local</span>
        </div>
        <p className="text-xs text-gray-500 italic">Estes dados NÃO são salvos no site online e não ficam visíveis para o público. São apenas para seu controle interno.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome do Proprietário</label>
            <input
              type="text"
              className="mt-1 block w-full border rounded-md p-2 bg-white"
              value={propData.nome}
              onChange={e => setPropData({ ...propData, nome: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Telefone / WhatsApp</label>
            <input
              type="text"
              className="mt-1 block w-full border rounded-md p-2 bg-white"
              value={propData.telefone}
              onChange={e => setPropData({ ...propData, telefone: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              className="mt-1 block w-full border rounded-md p-2 bg-white"
              value={propData.email}
              onChange={e => setPropData({ ...propData, email: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Observações Internas (Ex: Onde retirar chaves, horários, etc)</label>
          <textarea
            rows={3}
            className="mt-1 block w-full border rounded-md p-2 bg-white"
            value={propData.observacoes}
            onChange={e => setPropData({ ...propData, observacoes: e.target.value })}
          />
        </div>
      </section>

      <div className="flex gap-4">
        <button
          type="submit" disabled={loading}
          className={`flex-1 text-white py-4 rounded-xl font-bold text-lg shadow-lg ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Salvando Alterações...' : 'Salvar Alterações'}
        </button>
        <button
          type="button" onClick={() => router.push('/dashboard')}
          className="px-8 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
