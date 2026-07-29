'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { salvarEPublicarImovelAction } from '@/app/actions/imovel-server-actions';

export default function NovoImovel() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [propData, setPropData] = useState({
    nome: '',
    telefone: '',
    email: '',
    observacoes: ''
  });
  const [formData, setFormData] = useState({
    referencia: '',
    titulo: '',
    descricao: '',
    transacao: 'Venda' as any,
    tipoImovel: 'Casa',
    videoUrl: '',
    endereco: {
      rua: '',
      numero: '',
      bairro: '',
      cidade: 'Taboão da Serra',
      estado: 'SP',
      cep: ''
    },
    caracteristicas: {
      quartos: 0,
      suites: 0,
      banheiros: 0,
      vagas: 0,
      areaUtil: 0,
      areaTotal: 0
    },
    precoVenda: undefined as number | undefined,
    precoLocacao: undefined as number | undefined,
    destaque: false,
    status: 'Ativo' as any,
    corretor: {
      nome: 'BRAZZA',
      telefone: '5511932785602'
    }
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
        alert(`O tamanho total das fotos (${(totalSize / 1024 / 1024).toFixed(2)}MB) excede 20MB. Por favor, selecione fotos menores.`);
        return;
      }

      setSelectedFiles(combined);
      e.target.value = ''; // Limpa para permitir selecionar mais fotos
    }
  };

  const moverArquivo = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= selectedFiles.length) return;
    const novosArquivos = [...selectedFiles];
    const temp = novosArquivos[fromIndex];
    novosArquivos[fromIndex] = novosArquivos[toIndex];
    novosArquivos[toIndex] = temp;
    setSelectedFiles(novosArquivos);
  };

  const removerArquivo = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      // Prepara o objeto do imóvel (sem as fotos ainda, elas serão processadas no server)
      const imovelCompleto = {
        ...formData,
        fotos: [], // O servidor preencherá isso com os caminhos dos arquivos salvos
      };

      data.append('imovel', JSON.stringify(imovelCompleto));
      data.append('proprietario', JSON.stringify(propData));

      // Adiciona cada arquivo de foto ao FormData
      selectedFiles.forEach(file => {
        data.append('fotos', file);
      });

      const result = await salvarEPublicarImovelAction(data);

      if (result.success) {
        alert('Imóvel e fotos publicados com sucesso!');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao publicar. Verifique se o tamanho das imagens não é excessivo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Novo Imóvel</h1>
        <p className="text-gray-600 text-sm">Preencha os dados e selecione as fotos.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Seção 1: Informações Básicas */}
        <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold border-b pb-2">Informações Básicas</h2>
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
              <select
                className="mt-1 block w-full border rounded-md p-2"
                value={formData.tipoImovel}
                onChange={e => setFormData({ ...formData, tipoImovel: e.target.value })}
              >
                <option value="Casa">Casa</option>
                <option value="Apartamento">Apartamento</option>
                <option value="Terreno">Terreno</option>
                <option value="Comercial">Comercial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Corretor Responsável</label>
              <select
                className="mt-1 block w-full border rounded-md p-2 bg-blue-50/50"
                value={formData.corretor.nome}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700">Referência</label>
              <input
                type="text" disabled
                className="mt-1 block w-full border bg-gray-100 rounded-md p-2 text-gray-500 italic"
                placeholder="Gerada automaticamente"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Título do Imóvel</label>
              <input
                type="text" required
                className="mt-1 block w-full border rounded-md p-2"
                onChange={e => setFormData({ ...formData, titulo: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Descrição Detalhada</label>
            <textarea
              rows={4} required
              className="mt-1 block w-full border rounded-md p-2"
              onChange={e => setFormData({ ...formData, descricao: e.target.value })}
            />
          </div>
        </section>

        {/* Seção: Mídia (Fotos e Vídeo) */}
        <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="border-b pb-2">
            <h2 className="text-lg font-bold">Mídia (Fotos e Vídeo)</h2>
            <p className="text-xs text-gray-500 mt-1">A <strong>1ª foto selecionada</strong> será usada como imagem de Capa e SEO.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fotos do Imóvel (Selecione várias)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              onChange={handleFileChange}
            />

            {selectedFiles.length > 0 && (
              <div className="mt-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-700 uppercase">
                    Fotos Selecionadas ({selectedFiles.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedFiles([])}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Limpar Todas
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {selectedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className={`relative bg-white rounded-lg border-2 p-2 flex flex-col justify-between ${
                        idx === 0 ? 'border-amber-500 shadow-md ring-2 ring-amber-200' : 'border-gray-200'
                      }`}
                    >
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 bg-amber-500 text-white font-bold text-[9px] uppercase px-1.5 py-0.5 rounded shadow z-10">
                          ⭐ Capa
                        </span>
                      )}
                      <div className="relative aspect-square w-full overflow-hidden rounded mb-2">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex justify-between items-center bg-gray-100 p-1 rounded text-xs">
                        <button
                          type="button"
                          onClick={() => moverArquivo(idx, idx - 1)}
                          disabled={idx === 0}
                          className="p-1 text-gray-600 disabled:opacity-30"
                          title="Mover para esquerda"
                        >
                          ⬅️
                        </button>
                        <span className="font-bold text-[11px] text-gray-500">#{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => moverArquivo(idx, idx + 1)}
                          disabled={idx === selectedFiles.length - 1}
                          className="p-1 text-gray-600 disabled:opacity-30"
                          title="Mover para direita"
                        >
                          ➡️
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removerArquivo(idx)}
                        className="mt-1 text-[10px] text-red-600 hover:bg-red-50 font-medium py-0.5 rounded text-center"
                      >
                        🗑️ Remover
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="pt-4">
            <label className="block text-sm font-medium text-gray-700">Link do Vídeo (YouTube/Vimeo)</label>
            <input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              className="mt-1 block w-full border rounded-md p-2"
              onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
            />
          </div>
        </section>

        {/* Seção 2: Localização */}
        <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold border-b pb-2">Localização</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Rua/Logradouro</label>
              <input type="text" className="mt-1 block w-full border rounded-md p-2" onChange={e => setFormData({ ...formData, endereco: { ...formData.endereco, rua: e.target.value } })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Número</label>
              <input type="text" className="mt-1 block w-full border rounded-md p-2" onChange={e => setFormData({ ...formData, endereco: { ...formData.endereco, numero: e.target.value } })} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Bairro" className="border rounded-md p-2" onChange={e => setFormData({ ...formData, endereco: { ...formData.endereco, bairro: e.target.value } })} />
            <input type="text" placeholder="Cidade" defaultValue="Taboão da Serra" className="border rounded-md p-2" onChange={e => setFormData({ ...formData, endereco: { ...formData.endereco, cidade: e.target.value } })} />
            <input type="text" placeholder="Estado" defaultValue="SP" className="border rounded-md p-2" onChange={e => setFormData({ ...formData, endereco: { ...formData.endereco, estado: e.target.value } })} />
          </div>
        </section>

        {/* Seção 3: Características e Preço */}
        <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold border-b pb-2">Características e Valores</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Quartos</label>
              <input type="number" className="block w-full border rounded-md p-2" onChange={e => setFormData({ ...formData, caracteristicas: { ...formData.caracteristicas, quartos: Number(e.target.value) } })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Suítes</label>
              <input type="number" className="block w-full border rounded-md p-2" onChange={e => setFormData({ ...formData, caracteristicas: { ...formData.caracteristicas, suites: Number(e.target.value) } })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Banheiros</label>
              <input type="number" className="block w-full border rounded-md p-2" onChange={e => setFormData({ ...formData, caracteristicas: { ...formData.caracteristicas, banheiros: Number(e.target.value) } })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Vagas</label>
              <input type="number" className="block w-full border rounded-md p-2" onChange={e => setFormData({ ...formData, caracteristicas: { ...formData.caracteristicas, vagas: Number(e.target.value) } })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Área Útil (m²)</label>
              <input type="number" className="block w-full border rounded-md p-2" onChange={e => setFormData({ ...formData, caracteristicas: { ...formData.caracteristicas, areaUtil: Number(e.target.value) } })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Área Total (m²)</label>
              <input type="number" className="block w-full border rounded-md p-2" onChange={e => setFormData({ ...formData, caracteristicas: { ...formData.caracteristicas, areaTotal: Number(e.target.value) } })} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-bold text-blue-700">Valor de Venda (R$)</label>
              <input type="number" className="mt-1 block w-full border-2 border-blue-100 rounded-md p-2 outline-none" onChange={e => setFormData({ ...formData, precoVenda: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-sm font-bold text-green-700">Valor de Locação (R$)</label>
              <input type="number" className="mt-1 block w-full border-2 border-green-100 rounded-md p-2 outline-none" onChange={e => setFormData({ ...formData, precoLocacao: Number(e.target.value) })} />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-4">
            <input type="checkbox" id="destaque" className="w-5 h-5" onChange={e => setFormData({ ...formData, destaque: e.target.checked })} />
            <label htmlFor="destaque" className="font-semibold text-gray-700 cursor-pointer">Colocar em Destaque na Home</label>
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
                onChange={e => setPropData({ ...propData, nome: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Telefone / WhatsApp</label>
              <input
                type="text"
                className="mt-1 block w-full border rounded-md p-2 bg-white"
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
                onChange={e => setPropData({ ...propData, email: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Observações Internas (Ex: Onde retirar chaves, horários, etc)</label>
            <textarea
              rows={3}
              className="mt-1 block w-full border rounded-md p-2 bg-white"
              onChange={e => setPropData({ ...propData, observacoes: e.target.value })}
            />
          </div>
        </section>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Processando e Enviando...' : 'Salvar e Publicar Tudo'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="px-8 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
