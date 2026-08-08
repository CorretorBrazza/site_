import { getImoveis } from '@/app/actions/imovel-server-actions';
import DashboardCorretorClient from './DashboardCorretorClient';

export default async function DashboardPage() {
  const imoveis = await getImoveis();

  return <DashboardCorretorClient imoveis={imoveis} />;
}
