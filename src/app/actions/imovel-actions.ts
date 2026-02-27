'use server'

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { Imovel } from '@/types/imovel';
import { revalidatePath } from 'next/cache';

const CONTENT_PATH = path.join(process.cwd(), 'src/content/imoveis');
const PUBLIC_UPLOADS_PATH = path.join(process.cwd(), 'public', 'uploads', 'imoveis');

export async function salvarEPublicarImovel(formData: FormData) {
  try {
    // 1. Extrair dados do formulário
    const imovelJson = formData.get('imovel') as string;
    const imovelData = JSON.parse(imovelJson) as Imovel;
    const files = formData.getAll('fotos') as File[];

    const imovelId = imovelData.referencia.toLowerCase();
    imovelData.id = imovelId;
    imovelData.updatedAt = new Date().toISOString();

    // 2. Processar Fotos
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

      // Se enviou novas fotos, substitui as antigas (ou você pode implementar lógica de anexar)
      imovelData.fotos = fotosUrls;
    }

    // 3. Salvar o JSON do Imóvel
    if (!fs.existsSync(CONTENT_PATH)) {
      fs.mkdirSync(CONTENT_PATH, { recursive: true });
    }
    const jsonPath = path.join(CONTENT_PATH, `${imovelId}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(imovelData, null, 2), 'utf-8');

    // 4. Publicação Automática (Git)
    if (process.env.NODE_ENV === 'development') {
      try {
        execSync('git add .');
        execSync(`git commit -m "Admin: Atualizado imóvel ${imovelData.referencia} com imagens"`);
        execSync('git push');
      } catch (e) {
        console.log('Git: Nada para commitar ou erro de push.');
      }
    }

    revalidatePath('/');
    revalidatePath(`/imovel/${imovelId}`);
    
    return { success: true, id: imovelId };
  } catch (error) {
    console.error('Erro detalhado:', error);
    throw new Error('Falha ao processar a publicação e as imagens.');
  }
}

export async function getImoveis() {
  if (!fs.existsSync(CONTENT_PATH)) return [];
  const files = fs.readdirSync(CONTENT_PATH);
  return files.map(file => {
    const content = fs.readFileSync(path.join(CONTENT_PATH, file), 'utf-8');
    return JSON.parse(content) as Imovel;
  });
}
