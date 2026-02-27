'use server'

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { Imovel } from '@/types/imovel';
import { revalidatePath } from 'next/cache';

const CONTENT_PATH = path.join(process.cwd(), 'src/content/imoveis');
const PUBLIC_UPLOADS_PATH = path.join(process.cwd(), 'public', 'uploads', 'imoveis');

export async function salvarEPublicarImovelAction(formData: FormData) {
  // ... (código existente)
}

export async function excluirImovelAction(id: string) {
  // ... (código existente)
}

export async function getImoveis() {
  const contentPath = path.join(process.cwd(), 'src/content/imoveis');
  if (!fs.existsSync(contentPath)) return [];
  
  const files = fs.readdirSync(contentPath);
  return files.map(file => {
    const content = fs.readFileSync(path.join(contentPath, file), 'utf-8');
    return JSON.parse(content) as Imovel;
  });
}
