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
    { nome: 'MARIA', telefone: '551170988512' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const totalSize = files.reduce((acc, file) => acc + file.size, 0);
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (totalSize > maxSize) {
        alert(`O tamanho total das fotos (${(totalSize / 1024 / 1024).toFixed(2)}MB) excede o limite de 5MB. Por favor, selecione menos fotos ou use imagens menores.`);
        e.target.value = ''; // Limpa o input
        setSelectedFiles([]);
        return;
      }

      setSelectedFiles(files);
    }
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
      <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-lg font-bold border-b pb-2">Mídia</h2>
        <div className="flex gap-4 overflow-x-auto py-2">
          {formData.fotos && formData.fotos.map((foto, idx) => (
            <img key={idx} src={foto} alt="Atual" className="h-20 w-20 object-cover rounded border" />
          ))}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Adicionar/Substituir Fotos</label>
          <input
            type="file" multiple accept="image/*"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            onChange={handleFileChange}
          />
        </div>
        <div className="pt-4">
          <label className="block text-sm font-medium text-gray-700">Link do Vídeo</label>
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
