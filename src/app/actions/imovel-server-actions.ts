import { Imovel } from '@/types/imovel';
import { API_BASE_URL } from '@/lib/api';

let fs: any = null;
let path: any = null;
let execSync: any = null;

if (typeof window === 'undefined') {
  try {
    fs = eval("require('fs')");
    path = eval("require('path')");
    execSync = eval("require('child_process')").execSync;
  } catch (e) {}
}

const getContentPath = () => (path ? path.join(process.cwd(), 'src/content/imoveis') : '');
const getPublicUploadsPath = () => (path ? path.join(process.cwd(), 'public', 'uploads', 'imoveis') : '');
const getProprietariosPath = () => (path ? path.join(process.cwd(), 'src/data/proprietarios') : '');

export async function getProximaReferencia(transacao: string) {
  const imoveis = await getImoveis();
  const prefixo = transacao.includes('Venda') ? 'VD' : 'LC';

  const numeros = imoveis
    .filter(i => i.referencia.startsWith(prefixo))
    .map(i => {
      const num = parseInt(i.referencia.replace(prefixo, ''));
      return isNaN(num) ? 0 : num;
    });

  const maiorNumero = numeros.length > 0 ? Math.max(...numeros) : 0;
  const proximo = (maiorNumero + 1).toString().padStart(3, '0');

  return `${prefixo}${proximo}`;
}

export async function salvarEPublicarImovelAction(formData: FormData) {
  try {
    if (!fs || !path) return { success: false, error: 'Função disponível apenas no ambiente Node.js' };

    const imovelJson = formData.get('imovel') as string;
    const imovelData = JSON.parse(imovelJson) as Imovel;
    const proprietarioJson = formData.get('proprietario') as string | null;
    const files = formData.getAll('fotos') as File[];

    if (!imovelData.referencia || imovelData.referencia === '') {
      imovelData.referencia = await getProximaReferencia(imovelData.transacao);
    }

    const imovelId = imovelData.referencia.toLowerCase();
    imovelData.id = imovelId;
    imovelData.updatedAt = new Date().toISOString();

    const fotosExistentes = Array.isArray(imovelData.fotos) ? imovelData.fotos : [];
    const novasFotosUrls: string[] = [];

    const publicUploadsPath = getPublicUploadsPath();
    if (files.length > 0 && files[0].size > 0 && publicUploadsPath) {
      const imovelFolder = path.join(publicUploadsPath, imovelData.referencia);
      if (!fs.existsSync(imovelFolder)) {
        fs.mkdirSync(imovelFolder, { recursive: true });
      }

      for (const file of files) {
        if (file.size === 0) continue;
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${Date.now()}-${file.name.replaceAll(' ', '_')}`;
        const filePath = path.join(imovelFolder, fileName);
        fs.writeFileSync(filePath, buffer);
        novasFotosUrls.push(`/uploads/imoveis/${imovelData.referencia}/${fileName}`);
      }
    }

    imovelData.fotos = [...fotosExistentes, ...novasFotosUrls];

    const contentPath = getContentPath();
    if (contentPath) {
      if (!fs.existsSync(contentPath)) {
        fs.mkdirSync(contentPath, { recursive: true });
      }
      const jsonPath = path.join(contentPath, `${imovelId}.json`);
      fs.writeFileSync(jsonPath, JSON.stringify(imovelData, null, 2), 'utf-8');
    }

    if (proprietarioJson) {
      salvarDadosProprietario(imovelId, JSON.parse(proprietarioJson));
    }

    return { success: true, id: imovelId, referencia: imovelData.referencia };
  } catch (error) {
    console.error('Erro detalhado:', error);
    return { success: false, error: 'Falha ao processar a publicação.' };
  }
}

export async function excluirImovelAction(id: string) {
  try {
    if (!fs || !path) return { success: false, error: 'Indisponível' };
    const contentPath = getContentPath();
    const filePath = path.join(contentPath, `${id.toLowerCase()}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return { success: true };
    }
    return { success: false, error: 'Imóvel não encontrado.' };
  } catch (error) {
    console.error('Erro ao excluir:', error);
    return { success: false, error: 'Erro ao excluir o imóvel.' };
  }
}

export async function getImoveis(): Promise<Imovel[]> {
  let apiImoveis: Imovel[] = [];

  try {
    const fetchOptions: RequestInit = process.env.NETLIFY === 'true'
      ? { next: { revalidate: 1 } }
      : { cache: 'no-store' };

    const res = await fetch(`${API_BASE_URL}/anuncios?limit=100&status=DELIVERED`, fetchOptions);
    const json = await res.json();

    if (json.success && Array.isArray(json.data)) {
      apiImoveis = json.data
        .filter((item: any) => {
          const st = (item.status || '').toUpperCase();
          return st === 'APPROVED' || st === 'DELIVERED' || st === 'PUBLISHED' || st === 'ATIVO';
        })
        .map((item: any) => {
          const ref = item.dados_refinados || item.dados_brutos || {};
          const fotosArray = (item.fotos || []).map((f: any) => (typeof f === 'string' ? f : f.url_optimized || f.url || f.url_original));

          return {
            id: item.ad_id || item.referencia?.toLowerCase() || `imv_${Math.random()}`,
            referencia: item.referencia || 'BRA0000',
            titulo: ref.titulo || item.media_kit?.titulo_seo || `Imóvel ${item.referencia}`,
            descricao: ref.descricao || item.media_kit?.legenda_social || '',
            tipo: ref.tipo || ref.tipoImovel || 'Apartamento',
            transacao: ref.transacao || ref.finalidade || (ref.precoLocacao ? 'Locação' : 'Venda'),
            precoVenda: ref.precoVenda || null,
            precoLocacao: ref.precoLocacao || null,
            condominio: ref.condominio || null,
            iptu: ref.iptu || null,
            bairro: ref.bairro || ref.endereco?.bairro || 'Taboão da Serra',
            cidade: ref.cidade || ref.endereco?.cidade || 'Taboão da Serra',
            endereco: {
              rua: ref.rua || ref.endereco?.rua || '',
              bairro: ref.bairro || ref.endereco?.bairro || 'Taboão da Serra',
              cidade: ref.cidade || ref.endereco?.cidade || 'Taboão da Serra',
              estado: ref.estado || ref.endereco?.estado || 'SP',
              cep: ref.cep || ref.endereco?.cep || '',
            },
            fotos: fotosArray.length > 0 ? fotosArray : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa'],
            caracteristicas: {
              quartos: ref.quartos || ref.caracteristicas?.quartos || 0,
              suites: ref.suites || ref.caracteristicas?.suites || 0,
              banheiros: ref.banheiros || ref.caracteristicas?.banheiros || 0,
              vagas: ref.vagas || ref.caracteristicas?.vagas || 0,
              areaUtil: ref.areaUtil || ref.caracteristicas?.areaUtil || 0,
            },
            status: 'Ativo',
            destaque: true,
          };
        });
    }
  } catch (err) {
    console.error('Erro ao buscar anúncios da API:', err);
  }

  return apiImoveis;
}

export async function salvarDadosProprietario(imovelId: string, dados: any) {
  if (!fs || !path) return;
  const proprietariosPath = getProprietariosPath();
  if (!fs.existsSync(proprietariosPath)) {
    fs.mkdirSync(proprietariosPath, { recursive: true });
  }
  const filePath = path.join(proprietariosPath, `${imovelId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(dados, null, 2), 'utf-8');
}

export async function getDadosProprietario(imovelId: string) {
  if (!fs || !path) return null;
  const proprietariosPath = getProprietariosPath();
  const filePath = path.join(proprietariosPath, `${imovelId}.json`);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  }
  return null;
}

export async function uploadNovasFotosAction(referencia: string, formData: FormData) {
  try {
    if (!fs || !path) return { success: false, error: 'Indisponível' };
    const files = formData.getAll('fotos') as File[];
    if (!referencia) {
      return { success: false, error: 'Referência do imóvel não encontrada.' };
    }

    const publicUploadsPath = getPublicUploadsPath();
    const imovelFolder = path.join(publicUploadsPath, referencia);
    if (!fs.existsSync(imovelFolder)) {
      fs.mkdirSync(imovelFolder, { recursive: true });
    }

    const fotosUrls: string[] = [];
    for (const file of files) {
      if (file.size === 0) continue;
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${Date.now()}-${file.name.replaceAll(' ', '_')}`;
      const filePath = path.join(imovelFolder, fileName);
      fs.writeFileSync(filePath, buffer);
      fotosUrls.push(`/uploads/imoveis/${referencia}/${fileName}`);
    }

    return { success: true, fotosUrls };
  } catch (error) {
    console.error('Erro no upload de novas fotos:', error);
    return { success: false, error: 'Falha ao fazer upload das fotos.' };
  }
}
