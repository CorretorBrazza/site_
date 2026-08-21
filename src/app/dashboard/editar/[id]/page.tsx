import { redirect } from 'next/navigation';

export default async function EditarImovelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/aprovar?ad_id=${encodeURIComponent(id)}`);
}

