'use server'

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { Imovel } from '@/types/imovel';
import { revalidatePath } from 'next/cache';

const CONTENT_PATH = path.join(process.cwd(), 'src/content/imoveis');
const PUBLIC_UPLOADS_PATH = path.join(process.cwd(), 'public', 'uploads', 'imoveis');

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
    const imovelJson = formData.get('imovel') as string;
    const imovelData = JSON.parse(imovelJson) as Imovel;
    const files = formData.getAll('fotos') as File[];

    // Se não tiver referência (novo imóvel), gera uma automática
    if (!imovelData.referencia || imovelData.referencia === '') {
      imovelData.referencia = await getProximaReferencia(imovelData.transacao);
    }

    const imovelId = imovelData.referencia.toLowerCase();
    imovelData.id = imovelId;
    imovelData.updatedAt = new Date().toISOString();

    if (files.length > 0 && files[0].size > 0) {
      const imovelFolder = path.join(PUBLIC_UPLOADS_PATH, imovelData.referencia);
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
        fotosUrls.push(`/uploads/imoveis/${imovelData.referencia}/${fileName}`);
      }
      imovelData.fotos = fotosUrls;
    }

    if (!fs.existsSync(CONTENT_PATH)) {
      fs.mkdirSync(CONTENT_PATH, { recursive: true });
    }
    const jsonPath = path.join(CONTENT_PATH, `${imovelId}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(imovelData, null, 2), 'utf-8');

    if (process.env.NODE_ENV === 'development') {
      try {
        execSync('git add .');
        execSync(`git commit -m "Admin: Atualizado imóvel ${imovelData.referencia}"`);
        execSync('git push');
      } catch (e) {
        console.log('Git: Nada para commitar ou erro de push.');
      }
    }

    revalidatePath('/');
    revalidatePath(`/imovel/${imovelId}`);
    revalidatePath('/dashboard');
    
    return { success: true, id: imovelId, referencia: imovelData.referencia };
  } catch (error) {
    console.error('Erro detalhado:', error);
    return { success: false, error: 'Falha ao processar a publicação.' };
  }
}

export async function excluirImovelAction(id: string) {
  try {
    const filePath = path.join(CONTENT_PATH, `${id.toLowerCase()}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      
      if (process.env.NODE_ENV === 'development') {
        try {
          execSync('git add .');
          execSync(`git commit -m "Admin: Excluído imóvel ${id}"`);
          execSync('git push');
        } catch (e) {
          console.log('Git: Nada para commitar ou erro de push.');
        }
      }
      
      revalidatePath('/');
      revalidatePath('/dashboard');
      return { success: true };
    }
    return { success: false, error: 'Imóvel não encontrado.' };
  } catch (error) {
    console.error('Erro ao excluir:', error);
    return { success: false, error: 'Erro ao excluir o imóvel.' };
  }
}

export async function getImoveis() {
  if (!fs.existsSync(CONTENT_PATH)) return [];
  const files = fs.readdirSync(CONTENT_PATH).filter(f => f.endsWith('.json'));
  return files.map(file => {
    const content = fs.readFileSync(path.join(CONTENT_PATH, file), 'utf-8');
    return JSON.parse(content) as Imovel;
  });
}
