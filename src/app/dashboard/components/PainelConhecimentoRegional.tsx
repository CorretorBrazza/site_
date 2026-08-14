'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, CircleAlert, Lightbulb, MapPin, Send, Users } from 'lucide-react';
import { fetchBrokerApi } from '@/lib/api';

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
  my_claim?: { acao: string; valor_proposto: unknown } | null;
};

const categoryOptions = [
  ['CONDOMINIO_AMENITY', 'Comodidade de condomínio'],
  ['CONDOMINIO_RULE', 'Regra de condomínio'],
  ['COMERCIO_NOME', 'Nome de comércio'],
  ['COMERCIO_EXISTENCIA', 'Existência de comércio'],
  ['TRANSPORTE_ACESSO', 'Transporte e acesso'],
  ['BAIRRO_CARACTERISTICA', 'Característica de bairro'],
  ['PONTO_INTERESSE', 'Ponto de interesse'],
];

function displayValue(value: Fact['valor']) {
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
  return String(value);
}

export default function PainelConhecimentoRegional() {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    entityType: 'COMERCIO',
    entityName: '',
    cidade: 'Taboão da Serra',
    bairro: '',
    categoria: 'COMERCIO_NOME',
    campo: 'nome',
    valor: '',
    evidenceType: 'OBSERVACAO_LOCAL',
    observacao: '',
  });

  async function refresh() {
    setLoading(true);
    try {
      const response = await fetchBrokerApi('/knowledge-base', { cache: 'no-store' });
      if (response.success) setFacts(Array.isArray(response.data) ? response.data : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  const relevantFacts = useMemo(() => facts.filter((fact) => !['ARCHIVED', 'REJECTED', 'STALE'].includes(fact.status)).slice(0, 8), [facts]);

  async function sendClaim(payload: Record<string, unknown>) {
    setSending(true);
    setMessage(null);
    try {
      const response = await fetchBrokerApi('/knowledge-base/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.success) throw new Error(response.message || 'Não foi possível registrar a contribuição.');
      const result = response.data;
      setMessage(result.promoted
        ? 'Informação promovida para conhecimento comunitário verificado.'
        : `Contribuição registrada. Consenso atual: ${result.consensus_count || 1} de 3 confirmações.`);
      await refresh();
    } catch (error: any) {
      setMessage(error?.message || 'Não foi possível enviar a contribuição.');
    } finally {
      setSending(false);
    }
  }

  async function submitProposal(event: FormEvent) {
    event.preventDefault();
    await sendClaim({
      entity: { tipo: form.entityType, nome: form.entityName },
      scope: { cidade: form.cidade, bairro: form.bairro || null },
      categoria: form.categoria,
      campo: form.campo.trim().toLowerCase().replace(/\s+/g, '_'),
      valor: form.valor,
      acao: 'PROPOSE',
      evidencia_tipo: form.evidenceType,
      observacao: form.observacao || null,
    });
  }

  async function reactToFact(fact: Fact, action: 'CONFIRM' | 'DISPUTE') {
    const alternativeValue = action === 'DISPUTE'
      ? window.prompt(`Qual é o valor correto para “${fact.campo}”?`, displayValue(fact.valor))
      : null;
    if (action === 'DISPUTE' && (!alternativeValue || alternativeValue.trim().length < 1 || alternativeValue.trim() === displayValue(fact.valor))) return;
    const observation = action === 'DISPUTE'
      ? window.prompt('Informe por que a informação está incorreta ou desatualizada:')
      : null;
    if (action === 'DISPUTE' && (!observation || observation.trim().length < 10)) return;
    await sendClaim({
      fact_id: fact.id,
      entity: fact.entity,
      scope: fact.scope,
      categoria: fact.categoria,
      campo: fact.campo,
      valor: alternativeValue || fact.valor,
      acao: action,
      evidencia_tipo: 'OBSERVACAO_LOCAL',
      observacao: observation || 'Confirmação local do corretor.',
    });
  }

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
      <div className="p-6 border-b border-slate-800 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-violet-400">Inteligência local colaborativa</p>
          <h2 className="text-xl font-black text-white mt-1">Você viu uma mudança no bairro?</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-3xl">Sua contribuição entra em revisão. Ela só alimenta a IA após curadoria administrativa ou três confirmações independentes; nunca altera anúncios diretamente.</p>
        </div>
        <div className="rounded-xl border border-violet-800 bg-violet-950/40 px-4 py-3 text-xs text-violet-200 flex gap-2 max-w-sm"><Users className="w-4 h-4 shrink-0" /> Um corretor propõe; três corretores independentes confirmam; o admin sempre tem a decisão final.</div>
      </div>

      <div className="grid xl:grid-cols-[1.1fr_0.9fr] gap-px bg-slate-800">
        <form onSubmit={submitProposal} className="bg-slate-900 p-6 space-y-3">
          <div className="flex items-center gap-2 text-sm font-black text-white"><Lightbulb className="w-4 h-4 text-amber-400" /> Adicionar uma informação local</div>
          <div className="grid sm:grid-cols-2 gap-3">
            <input required value={form.entityName} onChange={(e) => setForm({ ...form, entityName: e.target.value })} placeholder="Ex.: Carrefour Taboão" className="rounded-xl bg-slate-950 border border-slate-700 px-3 py-2.5 text-sm text-white" />
            <select value={form.entityType} onChange={(e) => setForm({ ...form, entityType: e.target.value })} className="rounded-xl bg-slate-950 border border-slate-700 px-3 py-2.5 text-sm text-white"><option value="COMERCIO">Comércio</option><option value="CONDOMINIO">Condomínio</option><option value="TRANSPORTE">Transporte</option><option value="BAIRRO">Bairro</option><option value="PONTO_INTERESSE">Ponto de interesse</option></select>
            <input required value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} placeholder="Cidade" className="rounded-xl bg-slate-950 border border-slate-700 px-3 py-2.5 text-sm text-white" />
            <input value={form.bairro} onChange={(e) => setForm({ ...form, bairro: e.target.value })} placeholder="Bairro (opcional)" className="rounded-xl bg-slate-950 border border-slate-700 px-3 py-2.5 text-sm text-white" />
            <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} className="rounded-xl bg-slate-950 border border-slate-700 px-3 py-2.5 text-sm text-white">{categoryOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
            <input required value={form.campo} onChange={(e) => setForm({ ...form, campo: e.target.value })} placeholder="Campo técnico, ex.: nome ou lazer.piscina" className="rounded-xl bg-slate-950 border border-slate-700 px-3 py-2.5 text-sm text-white" />
          </div>
          <input required value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} placeholder="Qual é a informação correta?" className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2.5 text-sm text-white" />
          <textarea value={form.observacao} onChange={(e) => setForm({ ...form, observacao: e.target.value })} placeholder="Conte o que você viu no local e por que a informação é relevante." className="w-full min-h-20 rounded-xl bg-slate-950 border border-slate-700 px-3 py-2.5 text-sm text-white" />
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between"><select value={form.evidenceType} onChange={(e) => setForm({ ...form, evidenceType: e.target.value })} className="rounded-xl bg-slate-950 border border-slate-700 px-3 py-2.5 text-sm text-white"><option value="OBSERVACAO_LOCAL">Observação local</option><option value="FOTO">Foto</option><option value="LINK_OFICIAL">Link oficial</option><option value="COMUNICADO">Comunicado</option></select><button disabled={sending} className="rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 px-4 py-2.5 text-sm font-black text-white flex items-center justify-center gap-2"><Send className="w-4 h-4" /> {sending ? 'Enviando...' : 'Enviar para curadoria'}</button></div>
          {message && <p className="text-xs text-violet-200 border border-violet-800 bg-violet-950/40 p-3 rounded-xl">{message}</p>}
        </form>

        <div className="bg-slate-950/50 p-6">
          <div className="flex items-center gap-2 text-sm font-black text-white mb-4"><MapPin className="w-4 h-4 text-emerald-400" /> Fatos locais em acompanhamento</div>
          {loading ? <p className="text-sm text-slate-500">Carregando base regional...</p> : relevantFacts.length === 0 ? <p className="text-sm text-slate-500">Ainda não há fatos regionais publicados ou em revisão.</p> : <div className="space-y-3">{relevantFacts.map((fact) => <div key={fact.id} className="border border-slate-800 rounded-2xl p-4"><div className="flex justify-between gap-3"><div><p className="text-sm font-bold text-white">{fact.entity?.nome}</p><p className="text-xs text-slate-400 mt-1">{fact.campo}: <span className="text-slate-200">{displayValue(fact.valor)}</span></p></div><span className="text-[10px] uppercase font-black text-violet-300">{fact.status.replace('_', ' ')}</span></div><p className="text-[11px] text-slate-500 mt-2">{fact.consensus_count || 0}/3 confirmações {fact.conflict_count ? `• ${fact.conflict_count} conflito(s)` : ''}</p><div className="flex gap-2 mt-3"><button disabled={sending} onClick={() => reactToFact(fact, 'CONFIRM')} className="text-xs font-bold text-emerald-300 hover:text-emerald-200 flex gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Confirmar</button><button disabled={sending} onClick={() => reactToFact(fact, 'DISPUTE')} className="text-xs font-bold text-amber-300 hover:text-amber-200 flex gap-1"><CircleAlert className="w-3.5 h-3.5" /> Contestar</button></div></div>)}</div>}
        </div>
      </div>
    </section>
  );
}
