'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardShell from '../components/DashboardShell';
import { fetchBrokerApi } from '@/lib/api';

type StagedPhoto = {
  photoId: string;
  name: string;
  url: string;
};

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_PHOTOS = 20;

export default function NovoImovel() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [readyPhotos, setReadyPhotos] = useState<StagedPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<any[]>([]);

  const loadHistory = useCallback(async () => {
    const response = await fetchBrokerApi('/intake/history');
    if (response.success) {
      setHistory(response.data || []);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const activePhotoCount = readyPhotos.length + files.length;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const selected = Array.from(event.target.files);
    const remainingSlots = Math.max(0, MAX_PHOTOS - activePhotoCount);

    if (remainingSlots === 0) {
      setMessage('Limite de 20 fotos por anúncio atingido.');
      event.target.value = '';
      return;
    }

    const accepted: File[] = [];
    for (const file of selected) {
      if (accepted.length >= remainingSlots) break;
      if (!ALLOWED_MIME_TYPES.has(file.type) || file.size <= 0 || file.size > MAX_FILE_BYTES) {
        setMessage('Apenas JPEG, PNG ou WebP de até 10MB por foto.');
        continue;
      }
      accepted.push(file);
    }

    if (accepted.length === 0) {
      event.target.value = '';
      return;
    }

    setFiles((current) => [...current, ...accepted]);
    setMessage(`${accepted.length} foto(s) selecionada(s). Clique em "Preparar fotos".`);
    event.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles((current) => current.filter((_, i) => i !== index));
  };

  const removeReadyPhoto = (photoId: string) => {
    setReadyPhotos((current) => current.filter((photo) => photo.photoId !== photoId));
  };

  const stageFiles = async () => {
    if (files.length === 0) return;
    if (activePhotoCount >= MAX_PHOTOS) {
      setMessage('Limite de 20 fotos por anúncio atingido.');
      return;
    }

    setUploading(true);
    setMessage('Enviando fotos...');

    try {
      const stagedPhotos: StagedPhoto[] = [];
      for (const file of files) {
        const sign = await fetchBrokerApi('/intake/photos/sign', {
          method: 'POST',
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type || 'image/jpeg',
            tamanhoBytes: file.size,
          }),
        });

        if (!sign.success || !sign.data?.uploadUrl) {
          throw new Error(sign.message || 'Não foi possível preparar o upload da foto.');
        }

        const uploadResponse = await fetch(sign.data.uploadUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type || 'image/jpeg' },
        });

        if (!uploadResponse.ok) {
          throw new Error(`Falha no upload da foto ${file.name}.`);
        }

        const confirm = await fetchBrokerApi('/intake/photos/confirm', {
          method: 'POST',
          body: JSON.stringify({ photoId: sign.data.photoId }),
        });

        if (!confirm.success || !confirm.data?.urlOptimized) {
          throw new Error(confirm.message || `Falha ao confirmar a foto ${file.name}.`);
        }

        stagedPhotos.push({
          photoId: sign.data.photoId,
          name: file.name,
          url: confirm.data.urlOptimized,
        });
      }

      setReadyPhotos((current) => [...current, ...stagedPhotos]);
      setFiles([]);
      setMessage(`${stagedPhotos.length} foto(s) pronta(s) para processamento.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erro ao enviar fotos.');
    } finally {
      setUploading(false);
    }
  };

  const processIntake = async () => {
    if (text.trim().length < 20) {
      setMessage('Escreva o texto do imóvel antes de processar.');
      return;
    }
    if (readyPhotos.length === 0) {
      setMessage('Aguarde o processamento das fotos.');
      return;
    }

    setProcessing(true);
    setMessage('Enviando para a IA...');

    try {
      const response = await fetchBrokerApi('/intake/run', {
        method: 'POST',
        body: JSON.stringify({
          text,
          photoIds: readyPhotos.map((photo) => photo.photoId),
        }),
      });

      if (!response.success) {
        throw new Error(response.message || 'Falha ao processar o anúncio.');
      }

      setMessage(response.message || 'Anúncio enviado para processamento.');
      setText('');
      setReadyPhotos([]);
      await loadHistory();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erro ao processar anúncio.');
    } finally {
      setProcessing(false);
    }
  };

  const canProcess = text.trim().length >= 20
    && readyPhotos.length > 0
    && files.length === 0
    && !uploading
    && !processing;

  const disabledReason = text.trim().length < 20
    ? 'Escreva o texto do imóvel antes de processar.'
    : (readyPhotos.length === 0 || files.length > 0 || uploading || processing)
      ? (files.length > 0 || uploading || readyPhotos.length === 0)
        ? 'Aguarde o processamento das fotos.'
        : ''
      : '';

  return (
    <DashboardShell activeTab="imoveis" backRoute="/dashboard" showChildrenOnDesktop>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Novo imóvel</h1>
          <p className="text-gray-600 text-sm">Envie texto livre e até 20 fotos; a IA processará o anúncio.</p>
        </div>

        <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Digite ou cole o texto completo do imóvel (livre, sem formulário)."
            className="w-full min-h-56 border rounded-lg p-3"
            maxLength={12000}
          />

          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFileChange}
              disabled={uploading || activePhotoCount >= MAX_PHOTOS}
            />
            <button
              type="button"
              onClick={stageFiles}
              disabled={uploading || files.length === 0}
              className="px-4 py-2 rounded-lg bg-gray-900 text-white disabled:opacity-50"
            >
              {uploading ? 'Enviando fotos...' : `Preparar ${files.length || 0} foto(s)`}
            </button>
          </div>

          {files.length > 0 && (
            <ul className="text-sm text-gray-600 space-y-1">
              {files.map((file, index) => (
                <li key={`${file.name}-${index}`} className="flex justify-between gap-2">
                  <span>{file.name}</span>
                  <button type="button" className="text-red-600" onClick={() => removeFile(index)}>
                    remover
                  </button>
                </li>
              ))}
            </ul>
          )}

          {readyPhotos.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">{readyPhotos.length} foto(s) pronta(s)</p>
              <div className="grid grid-cols-3 gap-2">
                {readyPhotos.map((photo) => (
                  <div key={photo.photoId} className="relative">
                    <img src={photo.url} alt={photo.name} className="h-24 w-full object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removeReadyPhoto(photo.photoId)}
                      className="absolute right-1 top-1 rounded bg-white/90 px-1 text-xs text-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={processIntake}
            disabled={!canProcess}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
          >
            {processing ? 'Processando...' : 'Processar'}
          </button>

          {!canProcess && disabledReason ? <p className="text-sm text-gray-600">{disabledReason}</p> : null}
          {message ? <p className="text-sm text-gray-700">{message}</p> : null}
        </section>

        <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Histórico</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-4">Referência</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Pipeline</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.ad_id} className="border-b">
                    <td className="py-2 pr-4">{item.referencia || item.ad_id}</td>
                    <td className="py-2 pr-4">{item.status}</td>
                    <td className="py-2 pr-4">{item.pipeline_status || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
