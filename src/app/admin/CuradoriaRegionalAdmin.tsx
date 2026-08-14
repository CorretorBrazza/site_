'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Archive, CheckCircle2, CircleAlert, Lock, Plus, RefreshCw, Send, ShieldCheck, Unlock, XCircle } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

type Fact = {
  id: string;
  entity: { tipo: string; nome: string };
  scope: { cidade: string; bairro?: string | null };
  categoria: string;
  campo: string;
  valor: string | number | boolean | string[];
  status: string;
  consensus_count?: number;
  conflict_count?: number;
  locked_by_admin?: boolean;
  valid_until?: string | null;
  admin_source?: { admin_email?: string; observacao?: string | null };
  claims?: Array<{ broker_email: string; acao: string; valor_proposto: unknown; evidencia_tipo: string; observacao?: string | null }>;
};

const categories = [
  ['CONDOMINIO_AMENITY', 'Comodidade de condomínio'],
  ['CONDOMINIO_RULE', 'Regra de condomínio'],
  ['COMERCIO_NOME', 'Nome de comércio'],
  ['COMERCIO_EXISTENCIA', 'Existência de comércio'],
  ['TRANSPORTE_ACESSO', 'Transporte e acesso'],
  ['BAIRRO_CARACTERISTICA', 'Característica de bairro'],
  ['PONTO_INTERESSE', 'Ponto de interesse'],
  ['REGIAO_DESCRICAO', 'Descrição regional'],
];

function valueText(value: Fact['valor']) {
  return Array.isArray(value) ? value.join(', ') : String(value);
}

export default function CuradoriaRegionalAdmin({ adminToken }: { adminToken: string }) {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [notice, setNotice] = useState<string | null>(null);
  const [form, setForm] = useState({
    entityType: 'CONDOMINIO', entityName: '', cidade: 'Taboão da Serra', bairro: '',
    categoria: 'CONDOMINIO_AMENITY', campo: 'lazer.piscina', valor: '', observacao: '',
    validUntil: '', locked: false,
  });

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` };
  async function refresh() {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/knowledge-facts`, { headers: { Authorization: `Bearer ${adminToken}` } });
      const json = await response.json();
      if (json.success) setFacts(Array.isArray(json.data) ? json.data : []);
    } finally { setLoading(false); }
  }
  useEffect(() => { refresh(); }, [adminToken]);

  const visibleFacts = useMemo(() => filter === 'ALL' ? facts : facts.filter((fact) => fact.status === filter), [facts, filter]);
  const counts = useMemo(() => facts.reduce((acc: Record<string, number>, fact) => { acc[fact.status] = (acc[fact.status] || 0) + 1; return acc; }, {}), [facts]);

  async function publish(event: FormEvent) {
    event.preventDefault();
    setSaving(true); setNotice(null);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/knowledge-facts`, {
        method: 'POST', headers,
        body: JSON.stringify({
          entity: { tipo: form.entityType, nome: form.entityName },
          scope: { cidade: form.cidade, bairro: form.bairro || null },
          categoria: form.categoria,
          campo: form.campo.trim().toLowerCase().replace(/\s+/g, '_'),
          valor: form.valor,
          evidencia_tipo: 'COMUNICADO',
          observacao: form.observacao || 'Publicação editorial do administrador.',
          valid_until: form.validUntil ? new Date(form.validUntil).toISOString() : null,
          locked_by_admin: form.locked,
        }),
      });
      const json = await response.json();
      if (!json.success) throw new Error(json.message || 'Falha ao publicar o fato.');
      setNotice('Fato publicado com autoridade administrativa e disponível imediatamente para o RAG.');
      setForm({ ...form, entityName: '', bairro: '', valor: '', observacao: '', validUntil: '' });
      await refresh();
    } catch (error: any) { setNotice(error.message || 'Erro ao publicar.'); }
    finally { setSaving(false); }
  }

  async function moderate(fact: Fact, action: 'APPROVE' | 'REJECT' | 'LOCK' | 'UNLOCK' | 'ARCHIVE' | 'REQUEST_EVIDENCE') {
    const reason = window.prompt(`Motivo para ${action.toLowerCase()}:`);
    if (!reason || reason.trim().length < 5) return;
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/knowledge-facts/${encodeURIComponent(fact.id)}/moderate`, {
        method: 'POST', headers, body: JSON.stringify({ acao: action, motivo: reason }),
      });
      const json = await response.json();
      if (!json.success) throw new Error(json.message || 'Falha na moderação.');
      setNotice(`Fato ${action.toLowerCase()} com sucesso.`);
      await refresh();
    } catch (error: any) { setNotice(error.message || 'Erro na moderação.'); }
    finally { setSaving(false); }
  }

  return <section className="mt-8 space-y-6">
    <div className="bg-slate-900 border border-violet-800/70 rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-slate-800 flex flex-col lg:flex-row lg:justify-between gap-4"><div><p className="text-[10px] font-black uppercase tracking-widest text-violet-400">Curadoria regional</p><h2 className="text-xl font-black text-white mt-1">Publique a verdade editorial da sua região</h2><p className="text-xs text-slate-400 mt-2 max-w-3xl">Fatos publicados por você entram imediatamente no RAG. Consenso de corretores só é promovido quando não há conflito e você não bloqueou o campo.</p></div><button onClick={refresh} className="self-start rounded-xl border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 flex gap-2"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Atualizar</button></div>
      <form onSubmit={publish} className="p-5 grid lg:grid-cols-3 gap-3">
        <input required value={form.entityName} onChange={(e) => setForm({ ...form, entityName: e.target.value })} placeholder="Entidade, ex.: Condomínio X" className="rounded-xl bg-slate-950 border border-slate-700 p-3 text-sm text-white" />
        <select value={form.entityType} onChange={(e) => setForm({ ...form, entityType: e.target.value })} className="rounded-xl bg-slate-950 border border-slate-700 p-3 text-sm text-white"><option value="CONDOMINIO">Condomínio</option><option value="COMERCIO">Comércio</option><option value="TRANSPORTE">Transporte</option><option value="BAIRRO">Bairro</option><option value="PONTO_INTERESSE">Ponto de interesse</option><option value="REGIAO">Região</option></select>
        <input required value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} placeholder="Cidade" className="rounded-xl bg-slate-950 border border-slate-700 p-3 text-sm text-white" />
        <input value={form.bairro} onChange={(e) => setForm({ ...form, bairro: e.target.value })} placeholder="Bairro (opcional)" className="rounded-xl bg-slate-950 border border-slate-700 p-3 text-sm text-white" />
        <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} className="rounded-xl bg-slate-950 border border-slate-700 p-3 text-sm text-white">{categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
        <input required value={form.campo} onChange={(e) => setForm({ ...form, campo: e.target.value })} placeholder="Campo, ex.: lazer.piscina" className="rounded-xl bg-slate-950 border border-slate-700 p-3 text-sm text-white" />
        <input required value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} placeholder="Valor correto, ex.: Sim ou Carrefour" className="rounded-xl bg-slate-950 border border-slate-700 p-3 text-sm text-white lg:col-span-2" />
        <label className="rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-300 flex items-center gap-2"><input type="checkbox" checked={form.locked} onChange={(e) => setForm({ ...form, locked: e.target.checked })} /> Bloquear promoção automática</label>
        <textarea value={form.observacao} onChange={(e) => setForm({ ...form, observacao: e.target.value })} placeholder="Fonte, comunicado ou justificativa editorial" className="min-h-20 rounded-xl bg-slate-950 border border-slate-700 p-3 text-sm text-white lg:col-span-2" />
        <label className="rounded-xl bg-slate-950 border border-slate-700 p-3 text-xs text-slate-300">Revisar até<input type="date" value={form.validUntil} onChange={(e) => setForm({ ...form, validUntil: e.target.value })} className="w-full mt-1 bg-transparent text-sm text-white" /></label>
        <button disabled={saving} className="rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 px-4 py-3 text-sm font-black text-white flex items-center justify-center gap-2 lg:col-span-3"><Plus className="w-4 h-4" /> {saving ? 'Publicando...' : 'Publicar fato administrativo'}</button>
      </form>
      {notice && <p className="mx-5 mb-5 text-xs text-violet-200 rounded-xl border border-violet-800 bg-violet-950/40 p-3">{notice}</p>}
    </div>

    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden"><div className="p-5 border-b border-slate-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3"><div><h3 className="font-black text-white">Fila e histórico de fatos</h3><p className="text-xs text-slate-400 mt-1">Todo voto, conflito, publicação e moderação fica associado ao fato e às versões.</p></div><div className="flex gap-2 flex-wrap"><button onClick={() => setFilter('ALL')} className={`text-xs px-3 py-1.5 rounded-lg ${filter === 'ALL' ? 'bg-white text-slate-950' : 'bg-slate-800 text-slate-300'}`}>Todos ({facts.length})</button>{['PENDING','CONTESTED','COMMUNITY_VERIFIED','ADMIN_APPROVED'].map((status) => <button key={status} onClick={() => setFilter(status)} className={`text-xs px-3 py-1.5 rounded-lg ${filter === status ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-300'}`}>{status.replace('_',' ')} ({counts[status] || 0})</button>)}</div></div>
      <div className="divide-y divide-slate-800">{loading ? <p className="p-5 text-sm text-slate-500">Carregando fatos...</p> : visibleFacts.length === 0 ? <p className="p-5 text-sm text-slate-500">Nenhum fato neste filtro.</p> : visibleFacts.map((fact) => <article key={fact.id} className="p-5"><div className="flex flex-col lg:flex-row lg:justify-between gap-4"><div><div className="flex gap-2 items-center"><h4 className="font-bold text-white">{fact.entity.nome}</h4><span className="text-[10px] font-black uppercase rounded-md px-2 py-1 bg-slate-800 text-violet-200">{fact.status.replace('_',' ')}</span>{fact.locked_by_admin && <Lock className="w-3.5 h-3.5 text-amber-400" />}</div><p className="text-sm text-slate-300 mt-2"><strong>{fact.campo}:</strong> {valueText(fact.valor)}</p><p className="text-xs text-slate-500 mt-1">{fact.scope.cidade}{fact.scope.bairro ? ` • ${fact.scope.bairro}` : ''} • {fact.consensus_count || 0}/3 confirmações • {fact.conflict_count || 0} conflito(s)</p>{fact.claims?.length ? <p className="text-xs text-slate-500 mt-2">{fact.claims.length} contribuições registradas; autoria disponível somente à administração.</p> : null}</div><div className="flex flex-wrap gap-2 content-start"><button disabled={saving} onClick={() => moderate(fact, 'APPROVE')} className="text-xs text-emerald-300 flex gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Aprovar</button><button disabled={saving} onClick={() => moderate(fact, 'REQUEST_EVIDENCE')} className="text-xs text-amber-300 flex gap-1"><CircleAlert className="w-3.5 h-3.5" /> Pedir evidência</button>{fact.locked_by_admin ? <button disabled={saving} onClick={() => moderate(fact, 'UNLOCK')} className="text-xs text-slate-300 flex gap-1"><Unlock className="w-3.5 h-3.5" /> Desbloquear</button> : <button disabled={saving} onClick={() => moderate(fact, 'LOCK')} className="text-xs text-slate-300 flex gap-1"><Lock className="w-3.5 h-3.5" /> Bloquear</button>}<button disabled={saving} onClick={() => moderate(fact, 'REJECT')} className="text-xs text-rose-300 flex gap-1"><XCircle className="w-3.5 h-3.5" /> Rejeitar</button><button disabled={saving} onClick={() => moderate(fact, 'ARCHIVE')} className="text-xs text-slate-400 flex gap-1"><Archive className="w-3.5 h-3.5" /> Arquivar</button></div></div></article>)}</div>
    </div>
  </section>;
}
