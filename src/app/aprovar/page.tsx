'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import PhotoReorder, { PhotoItem } from '@/components/PhotoReorder';
import MediaKitDisplay from '@/components/MediaKitDisplay';
import { resolveApiUrl } from '@/lib/api';
import { normalizeApprovalFinalidade } from '@/lib/approval-form';
import { lerLinkDeAprovacao, mensagemDaFalha, type ApprovalFailure } from '@/lib/approval-link';
import {
  criarClienteAprovacao,
  SegredoDaAprovacao,
  type ClienteAprovacao,
  type DetalhesAnuncio,
} from '@/lib/approval-client';
import {
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles,
  Edit3,
  Image as ImageIcon,
  FileText,
  Save,
  MapPin,
} from 'lucide-react';

/**
 * Estados da tela.
 *
 * `bloqueado` é terminal e cobre ausente/inválido/expirado/já usado/sem
 * crédito/indisponível. O texto exibido vem de `mensagemDaFalha`, derivado só
 * do status HTTP: a tela nunca repete a mensagem do backend, porque ela diria
 * ao corretor se o link existe, se o anúncio existe ou se o prazo venceu.
 */
type Etapa = 'carregando' | 'carregando-detalhes' | 'revisao' | 'concluido' | 'descartado' | 'bloqueado';

interface Feedback {
  tom: 'sucesso' | 'erro';
  texto: string;
}

function AprovarContent() {
  const [etapa, setEtapa] = useState<Etapa>('carregando');
  const [falha, setFalha] = useState<ApprovalFailure>('ausente');
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const [adData, setAdData] = useState<DetalhesAnuncio | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'fotos' | 'mediakit'>('preview');

  const [corretorNome, setCorretorNome] = useState('');
  const [saldoDisponivel, setSaldoDisponivel] = useState<number | null>(null);

  // Formulário de Edição Completo
  const [titulo, setTitulo] = useState('');
  const [tipoImovel, setTipoImovel] = useState('Apartamento');
  const [finalidade, setFinalidade] = useState('Não informado');
  const [descricao, setDescricao] = useState('');
  const [precoVenda, setPrecoVenda] = useState<number | ''>('');
  const [precoLocacao, setPrecoLocacao] = useState<number | ''>('');
  const [condominio, setCondominio] = useState<number | ''>('');
  const [iptu, setIptu] = useState<number | ''>('');
  const [quartos, setQuartos] = useState<number | ''>('');
  const [suites, setSuites] = useState<number | ''>('');
  const [banheiros, setBanheiros] = useState<number | ''>('');
  const [vagas, setVagas] = useState<number | ''>('');
  const [areaUtil, setAreaUtil] = useState<number | ''>('');
  const [bairro, setBairro] = useState('');

  const [fotos, setFotos] = useState<PhotoItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * A credencial vive nestas duas refs e em mais lugar nenhum.
   *
   * `segredoRef` guarda o token em memória; `clienteRef` guarda as funções que
   * o leem. Nenhum dos dois é estado de render, então o token nunca entra em
   * comparação de efeito, prop de componente ou serialização. Os componentes
   * filhos (`PhotoReorder`, `MediaKitDisplay`) recebem só dados do anúncio.
   */
  const segredoRef = useRef<SegredoDaAprovacao | null>(null);
  const clienteRef = useRef<ClienteAprovacao | null>(null);

  const aplicarDetalhes = useCallback((data: DetalhesAnuncio) => {
    setAdData(data);
    setApprovalStatus(data.status);

    const refinados = data.dados_refinados || {};
    const carac = refinados.caracteristicas || {};
    setTitulo(refinados.titulo || '');
    setTipoImovel(refinados.tipoImovel || 'Apartamento');
    setFinalidade(normalizeApprovalFinalidade(refinados));
    setDescricao(refinados.descricao || '');
    setPrecoVenda(refinados.precoVenda ?? '');
    setPrecoLocacao(refinados.precoLocacao ?? '');
    // A taxa vem de `valorCondominio`; `condominio` numérico é legado (a taxa
    // que versões antigas gravavam nesse campo). `condominio` texto é o NOME e
    // não é editado nesta tela.
    const taxaCondominio = refinados.valorCondominio ?? refinados.condominio;
    setCondominio(typeof taxaCondominio === 'number' && Number.isFinite(taxaCondominio) ? taxaCondominio : '');
    setIptu(refinados.iptu ?? '');
    setQuartos(carac.quartos ?? '');
    setSuites(carac.suites ?? '');
    setBanheiros(carac.banheiros ?? '');
    setVagas(carac.vagas ?? '');
    setAreaUtil(carac.areaUtil ?? carac.areaTotal ?? '');
    setBairro(refinados.endereco?.bairro || '');
    setFotos(data.fotos || []);
  }, []);

  useEffect(() => {
    let cancelado = false;

    const segredo = new SegredoDaAprovacao();
    const cliente = criarClienteAprovacao(
      { resolver: resolveApiUrl, fetchImpl: (...args) => fetch(...args) },
      segredo
    );
    segredoRef.current = segredo;
    clienteRef.current = cliente;

    // Limpa a barra de endereços ANTES de qualquer requisição. `lerLinkDeAprovacao`
    // faz as duas coisas em sequência síncrona: lê o fragmento e já chama
    // `replaceState`. A partir daqui o `#token=` não existe mais — nem em
    // `Referer`, nem em histórico, nem para o usuário copiar a URL.
    const link = lerLinkDeAprovacao(window);

    // Daqui para baixo o efeito só se inscreve no resultado e publica estado.
    // A URL é um sistema externo: o trabalho nela é feito de forma síncrona,
    // logo acima, e o estado é escrito a partir da continuação assíncrona —
    // escrever em estado no corpo síncrono do efeito provoca render em cascata.
    void (async () => {
      if (cancelado) return;

      if (!link.token) {
        // Link sem token no fragmento (inclusive o antigo `?token=`): o mesmo
        // estado genérico de link inválido, e nenhuma chamada ao backend.
        setFalha('ausente');
        setEtapa('bloqueado');
        return;
      }

      segredo.guardar(link.token);
      // O `ad_id` do fragmento vai só como checagem de consistência. Quem
      // resolve o anúncio é o hash do token, no backend.
      const validado = await cliente.validar(link.adId || undefined);
      if (cancelado) return;

      if (!validado.ok || !validado.data?.valid) {
        setFalha(validado.falha || 'invalido');
        setEtapa('bloqueado');
        segredo.limpar();
        return;
      }

      const dados = validado.data;
      if (dados.corretor) {
        setCorretorNome(dados.corretor.nome || '');
        setSaldoDisponivel(Number(dados.corretor.saldo_disponivel ?? 0));
      }

      if (cancelado) return;
      setEtapa('carregando-detalhes');

      const adId = dados.ad_id || link.adId;
      const detalhes = await cliente.detalhes(adId);
      if (cancelado) return;

      if (!detalhes.ok || !detalhes.data) {
        setFalha(detalhes.falha || 'invalido');
        setEtapa('bloqueado');
        segredo.limpar();
        return;
      }

      aplicarDetalhes(detalhes.data);
      setEtapa('revisao');
    })();

    return () => {
      cancelado = true;
      segredo.limpar();
      clienteRef.current = null;
    };
  }, [aplicarDetalhes]);

  /** Igual a `numero`, mas escrevendo dentro do objeto de características. */
  const numeroEm = (alvo: Record<string, unknown>, campo: string, atual: number | '', original: unknown) => {
    if (atual === '') {
      const tinhaValor = original !== null && original !== undefined && original !== '';
      if (tinhaValor) alvo[campo] = null;
      return;
    }
    if (!Number.isFinite(atual)) return;
    const originalNumerico = typeof original === 'number' && Number.isFinite(original) ? original : null;
    if (originalNumerico === null || atual !== originalNumerico) alvo[campo] = atual;
  };

  /**
   * Payload de edição com APENAS os campos que o corretor mudou.
   *
   * Antes, esta função mandava todos os campos sempre — inclusive os que a tela
   * só exibia. Como os valores vinham da extração por IA, um preço formatado
   * ("350.000,00") virava `Number(...) = NaN`, e `JSON.stringify` grava `NaN`
   * como `null`: um clique em "Aprovar" (que debita crédito) zerava preço, IPTU
   * e áreas que ninguém tocou.
   *
   * Agora: campo não alterado não vai; número inválido é OMITIDO (nunca vira
   * null por acidente); e limpar um campo que tinha valor envia `null` de
   * propósito.
   *
   * `condominio` é o NOME do condomínio (string) no resto do sistema
   * (`reviewPatch.ts`, `UpdateAnuncioSchema`, formulário de edição). A taxa em
   * reais é `valorCondominio`. Esta tela edita a taxa e não toca no nome.
   */
  const getPayloadEditado = () => {
    const orig = adData?.dados_refinados || {};
    const origCarac = orig.caracteristicas || {};
    const payload: Record<string, unknown> = {};

    const texto = (campo: string, atual: string, original: unknown) => {
      if (String(atual ?? '') !== String(original ?? '')) payload[campo] = atual;
    };

    const numero = (campo: string, atual: number | '', original: unknown) => {
      if (atual === '') {
        const tinhaValor = original !== null && original !== undefined && original !== '';
        if (tinhaValor) payload[campo] = null;
        return;
      }
      if (!Number.isFinite(atual)) return;
      const originalNumerico = typeof original === 'number' && Number.isFinite(original) ? original : null;
      if (originalNumerico === null || atual !== originalNumerico) payload[campo] = atual;
    };

    texto('titulo', titulo, orig.titulo);
    texto('tipoImovel', tipoImovel, orig.tipoImovel);
    texto('finalidade', finalidade, orig.finalidade ?? orig.transacao);
    texto('descricao', descricao, orig.descricao);
    texto('bairro', bairro, orig.bairro ?? orig.endereco?.bairro);

    numero('precoVenda', precoVenda, orig.precoVenda);
    numero('precoLocacao', precoLocacao, orig.precoLocacao);
    numero('iptu', iptu, orig.iptu ?? orig.iptuMensal);
    // Compatibilidade: anúncios antigos guardavam a TAXA em `condominio` (número).
    // Nesse caso ela é a origem do valor exibido, mas nunca é sobrescrita como texto.
    numero(
      'valorCondominio',
      condominio,
      orig.valorCondominio ?? (typeof orig.condominio === 'number' ? orig.condominio : null),
    );

    const caracteristicas: Record<string, unknown> = {};
    numeroEm(caracteristicas, 'quartos', quartos, origCarac.quartos);
    numeroEm(caracteristicas, 'suites', suites, origCarac.suites);
    numeroEm(caracteristicas, 'banheiros', banheiros, origCarac.banheiros);
    numeroEm(caracteristicas, 'vagas', vagas, origCarac.vagas);
    numeroEm(caracteristicas, 'areaUtil', areaUtil, origCarac.areaUtil ?? origCarac.areaTotal);
    if (Object.keys(caracteristicas).length > 0) payload.caracteristicas = caracteristicas;

    return payload;
  };

  /** Falha de ação: mesmo mapeamento por status, sem vazar texto do backend. */
  const registrarFalhaDeAcao = (motivo: ApprovalFailure) => {
    setFeedback({ tom: 'erro', texto: mensagemDaFalha(motivo) });
    if (motivo === 'ausente' || motivo === 'invalido') {
      setFalha(motivo);
      setEtapa('bloqueado');
    }
  };

  // Ação: Salvar Edições
  const handleSaveEdits = async () => {
    const cliente = clienteRef.current;
    if (!cliente || !adData) return;

    const payload = getPayloadEditado();
    if (Object.keys(payload).length === 0) {
      setFeedback({ tom: 'sucesso', texto: 'Nenhuma alteração para salvar.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    const result = await cliente.editar(adData.ad_id, payload);

    setIsSubmitting(false);

    if (result.ok) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const mediaKit = result.data?.media_kit;
      if (mediaKit) {
        setAdData((prev) => (prev ? { ...prev, media_kit: mediaKit } : prev));
      }
      setFeedback({ tom: 'sucesso', texto: 'Edições salvas e Media Kit recalibrado com sucesso!' });
    } else {
      registrarFalhaDeAcao(result.falha || 'desconhecido');
    }
  };

  // Ação: Reordenar Fotos
  const handleReorderPhotos = async (newPhotos: PhotoItem[]) => {
    const cliente = clienteRef.current;
    if (!cliente || !adData) return;
    setFotos(newPhotos);
    setFeedback(null);

    // A API recebe os índices do array original; `ordem` muda na interface e não identifica a foto.
    const novaOrdem = newPhotos.map((photo, index) => photo.source_index ?? index);
    const result = await cliente.reordenar(adData.ad_id, novaOrdem);

    if (!result.ok) {
      registrarFalhaDeAcao(result.falha || 'desconhecido');
    }
  };

  // Ação: Aprovar
  const handleApprove = async () => {
    const cliente = clienteRef.current;
    if (!cliente || !adData) return;
    if (!confirm('Deseja realmente APROVAR este anúncio? 1 crédito será debitado do seu saldo.')) return;

    setIsSubmitting(true);
    setFeedback(null);

    // Sem alteração, `dados_editados` não vai: o backend aprova o que já está
    // gravado, em vez de receber um objeto vazio e regravar o documento.
    const payload = getPayloadEditado();
    const dadosEditados = Object.keys(payload).length > 0 ? payload : undefined;

    const result = await cliente.aprovar(adData.ad_id, dadosEditados, { aprovar: true });

    setIsSubmitting(false);

    if (!result.ok) {
      registrarFalhaDeAcao(result.falha || 'desconhecido');
      return;
    }

    const statusFinal = result.data?.status || 'DELIVERED';
    const adId = adData.ad_id;
    const refresh = await cliente.detalhes(adId);

    if (refresh.ok && refresh.data) {
      aplicarDetalhes(refresh.data);
      setApprovalStatus(refresh.data.status || statusFinal);
    } else {
      setApprovalStatus(statusFinal);
      setAdData((prev) => (prev ? { ...prev, status: statusFinal } : prev));
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setEtapa('concluido');
    // O link cumpriu o papel. Não sobra motivo para a credencial continuar em memória.
    segredoRef.current?.limpar();
    setFeedback({ tom: 'sucesso', texto: 'Anúncio Aprovado com sucesso! Fotos e Media Kit foram liberados.' });
  };

  // Ação: Rejeitar / Descartar
  const handleReject = async () => {
    const cliente = clienteRef.current;
    if (!cliente || !adData) return;
    const confirmou = window.confirm(
      'Deseja realmente DESCARTAR este imóvel?\n\n🛡️ Nenhum crédito será debitado do seu saldo e o processamento será cancelado.'
    );
    if (!confirmou) return;

    setIsSubmitting(true);
    setFeedback(null);

    const result = await cliente.aprovar(adData.ad_id, undefined, {
      aprovar: false,
      motivo: 'Descartado pelo corretor',
    });

    setIsSubmitting(false);

    if (!result.ok) {
      registrarFalhaDeAcao(result.falha || 'desconhecido');
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setApprovalStatus('REJEITADO');
    setEtapa('descartado');
    segredoRef.current?.limpar();
    setFeedback({ tom: 'sucesso', texto: 'Imóvel descartado. Nenhum crédito foi consumido.' });
  };

  if (etapa === 'carregando' || etapa === 'carregando-detalhes') {
    return (
      <div className="min-h-screen bg-paper text-ink flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <Loader2 className="w-12 h-12 text-brand-800 animate-spin mx-auto" />
          <p className="text-sm font-bold text-ink">
            {etapa === 'carregando'
              ? 'Validando seu link de aprovação...'
              : 'Carregando o anúncio para revisão em Taboão da Serra e imediações...'}
          </p>
        </div>
      </div>
    );
  }

  if (etapa === 'bloqueado') {
    return (
      <div className="min-h-screen bg-paper text-ink flex items-center justify-center p-6">
        <div className="bg-white border border-danger/30 rounded-3xl p-8 text-center shadow-xl space-y-4 max-w-md">
          <div className="w-14 h-14 bg-danger/10 rounded-2xl flex items-center justify-center mx-auto text-danger border border-danger/30">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-brand-900">Não foi possível abrir este link</h2>
          <p className="text-xs text-ink leading-relaxed">{mensagemDaFalha(falha)}</p>
          <p className="text-xs text-muted leading-relaxed">
            Para acessar seus imóveis, créditos e histórico, entre no painel com seu e-mail e senha.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-brand-900 hover:bg-brand-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md"
            >
              Voltar ao Portal
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 bg-brand-900 hover:bg-brand-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md"
            >
              Entrar no Painel
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!adData) return null;

  const refinados = adData.dados_refinados || {};
  const mediaKit = adData.media_kit || {};
  const aprovado = approvalStatus === 'APPROVED' || approvalStatus === 'DELIVERED';

  return (
    <div className="min-h-screen bg-paper text-brand-900 py-8 px-4">
      <main className="max-w-5xl mx-auto space-y-6">

        {/* Banner de Status se Descartado */}
        {(etapa === 'descartado' || approvalStatus === 'REJEITADO') && (
          <div className="bg-gold/10 border border-gold/30 text-gold rounded-3xl p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-10 h-10 text-gold shrink-0" />
              <div>
                <h3 className="text-lg font-black text-gold">Imóvel Descartado com Sucesso</h3>
                <p className="text-xs text-gold mt-0.5">
                  Nenhum crédito foi consumido do seu saldo. As fotos temporárias foram removidas da nuvem.
                </p>
              </div>
            </div>
            <a
              href="/dashboard"
              className="px-5 py-2.5 bg-brand-900 hover:bg-brand-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shrink-0 shadow-md"
            >
              Ir para o Painel
            </a>
          </div>
        )}

        {/* Banner de Status se Aprovado */}
        {(etapa === 'concluido' || aprovado) && (
          <div className="bg-success/10 border border-success/30 text-success rounded-3xl p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-10 h-10 text-success shrink-0" />
              <div>
                <h3 className="text-lg font-black text-success">Anúncio Aprovado com Sucesso!</h3>
                <p className="text-xs text-success mt-0.5">
                  1 crédito debitado do seu saldo. O Media Kit pronto foi entregue no seu e-mail.
                </p>
              </div>
            </div>
            <a
              href={`/imovel/${adData.ad_id}`}
              className="px-5 py-2.5 bg-success hover:bg-success text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shrink-0 shadow-md"
            >
              Ver Imóvel no Site
            </a>
          </div>
        )}

        {/* Feedback de ação (sucesso ou erro), acima das abas para valer em todas */}
        {feedback && (
          <div
            className={`rounded-2xl px-4 py-3 text-xs font-bold border ${
              feedback.tom === 'sucesso'
                ? 'bg-success/10 border-success/30 text-success'
                : 'bg-danger/10 border-danger/30 text-danger'
            }`}
          >
            {feedback.texto}
          </div>
        )}

        {/* Dica de Tela Maior / Desktop */}
        <div className="bg-gradient-to-r from-brand-900/5 to-brand-900/5 border border-brand-700/30/80 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-brand-800 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-base shrink-0">💻</span>
            <span>
              <strong>Dica de Produtividade:</strong> Esta tela funciona perfeitamente no celular, mas para revisar até 20 fotos em alta resolução, selecionar a capa e copiar seus textos de Media Kit com máximo conforto, você também pode abrir este mesmo link no seu <strong>computador ou notebook</strong>.
            </span>
          </div>
        </div>

        {/* Aviso de escopo do link de aprovação */}
        <div className="bg-gold/10 border border-gold/30 text-gold rounded-2xl px-4 py-3 text-xs leading-relaxed flex items-start gap-2.5">
          <span className="text-base shrink-0">🔐</span>
          <span>
            Este link dá acesso <strong>apenas a este anúncio</strong>, para você revisar, editar e aprovar.
            Ele não abre o seu painel. {corretorNome ? `Olá, ${corretorNome}. ` : ''}
            {saldoDisponivel !== null && (
              <>
                Você tem <strong>{saldoDisponivel} crédito{saldoDisponivel === 1 ? '' : 's'} disponível{saldoDisponivel === 1 ? '' : 'eis'}</strong> para esta aprovação.{' '}
              </>
            )}
            Para ver os seus imóveis, créditos e histórico, <a href="/dashboard" className="underline font-semibold">entre no painel</a>.
          </span>
        </div>

        {/* Header do Anúncio */}
        <div className="bg-white border border-line rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-brand-900/5 text-brand-800 border border-brand-700/30 text-xs font-black px-3 py-1 rounded-xl uppercase">
                REF: {adData.referencia}
              </span>
              <span className="text-xs text-muted font-semibold">
                Corretor: {adData.corretor_email}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-brand-900 tracking-tight">
              {titulo || 'Anúncio de Imóvel'}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <MapPin className="w-3.5 h-3.5 text-brand-800 shrink-0" />
              <span>{refinados.endereco?.bairro || 'Taboão da Serra'}, Taboão da Serra e imediações - SP</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider ${
                aprovado
                  ? 'bg-success/10 text-success border border-success/30'
                  : approvalStatus === 'REJEITADO'
                  ? 'bg-danger/10 text-danger border border-danger/30'
                  : 'bg-gold/10 text-gold border border-gold/30'
              }`}
            >
              {aprovado ? 'Aprovado & Publicado' : approvalStatus === 'REJEITADO' ? 'Rejeitado' : 'Pendente de Aprovação'}
            </span>
          </div>
        </div>

        {/* Navegação por Abas */}
        <div className="flex items-center gap-2 border-b border-line pb-3">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'preview'
                ? 'bg-brand-900 text-white shadow-md'
                : 'bg-white text-ink border border-line hover:bg-paper'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>1. Preview & Edições</span>
          </button>

          <button
            onClick={() => setActiveTab('fotos')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'fotos'
                ? 'bg-brand-900 text-white shadow-md'
                : 'bg-white text-ink border border-line hover:bg-paper'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>2. Fotos ({fotos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('mediakit')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'mediakit'
                ? 'bg-brand-900 text-white shadow-md'
                : 'bg-white text-ink border border-line hover:bg-paper'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>3. Media Kit Gerado</span>
          </button>
        </div>

        {/* Conteúdo Aba 1: Preview & Edições */}
        {activeTab === 'preview' && (
          <div className="bg-white border border-line rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <h3 className="text-base font-extrabold text-brand-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-800" />
                <span>Editar Dados do Imóvel</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="md:col-span-2 lg:col-span-4">
                <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">Título do Anúncio</label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-line rounded-xl text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-brand-700 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">Tipo de Imóvel</label>
                <select
                  value={tipoImovel}
                  onChange={(e) => setTipoImovel(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-line rounded-xl text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-brand-700 font-medium"
                >
                  <option value="Apartamento">Apartamento</option>
                  <option value="Casa">Casa</option>
                  <option value="Casa em Condomínio">Casa em Condomínio</option>
                  <option value="Sobrado">Sobrado</option>
                  <option value="Terreno">Terreno</option>
                  <option value="Galpão">Galpão / Galpão Comercial</option>
                  <option value="Comercial">Sala / Prédio Comercial</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">Finalidade / Negócio</label>
                <select
                  value={finalidade}
                  onChange={(e) => setFinalidade(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-line rounded-xl text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-brand-700 font-medium"
                >
                  <option value="Não informado">Selecionar / Não informado</option>
                  <option value="Venda">Venda</option>
                  <option value="Locação">Locação</option>
                  <option value="Venda e Locação">Venda e Locação</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">Preço de Venda (R$)</label>
                <input
                  type="number"
                  value={precoVenda}
                  onChange={(e) => setPrecoVenda(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 320000"
                  className="w-full px-4 py-3 bg-white border border-line rounded-xl text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-brand-700 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">Preço de Locação (R$)</label>
                <input
                  type="number"
                  value={precoLocacao}
                  onChange={(e) => setPrecoLocacao(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 2200"
                  className="w-full px-4 py-3 bg-white border border-line rounded-xl text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-brand-700 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">Taxa de Condomínio (R$)</label>
                <input
                  type="number"
                  value={condominio}
                  onChange={(e) => setCondominio(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 450"
                  className="w-full px-4 py-3 bg-white border border-line rounded-xl text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-brand-700 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">IPTU Mensal/Anual (R$)</label>
                <input
                  type="number"
                  value={iptu}
                  onChange={(e) => setIptu(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 120"
                  className="w-full px-4 py-3 bg-white border border-line rounded-xl text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-brand-700 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">Área Útil (m²)</label>
                <input
                  type="number"
                  value={areaUtil}
                  onChange={(e) => setAreaUtil(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 68"
                  className="w-full px-4 py-3 bg-white border border-line rounded-xl text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-brand-700 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">Bairro em Taboão da Serra e imediações</label>
                <input
                  type="text"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  placeholder="Ex: Parque das Cigarras"
                  className="w-full px-4 py-3 bg-white border border-line rounded-xl text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-brand-700 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">🛏️ Quartos</label>
                <input
                  type="number"
                  value={quartos}
                  onChange={(e) => setQuartos(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 2"
                  className="w-full px-4 py-3 bg-white border border-line rounded-xl text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-brand-700 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">🚿 Suítes</label>
                <input
                  type="number"
                  value={suites}
                  onChange={(e) => setSuites(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 1"
                  className="w-full px-4 py-3 bg-white border border-line rounded-xl text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-brand-700 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">🚽 Banheiros Totais</label>
                <input
                  type="number"
                  value={banheiros}
                  onChange={(e) => setBanheiros(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 2"
                  className="w-full px-4 py-3 bg-white border border-line rounded-xl text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-brand-700 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">🚗 Vagas de Garagem</label>
                <input
                  type="number"
                  value={vagas}
                  onChange={(e) => setVagas(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 1"
                  className="w-full px-4 py-3 bg-white border border-line rounded-xl text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-brand-700 font-medium"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-4">
                <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">Descrição Comercial</label>
                <textarea
                  rows={6}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-line rounded-xl text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-brand-700 resize-none font-medium text-sm leading-relaxed"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveEdits}
                disabled={isSubmitting || aprovado}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-900 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-gold-400" />}
                <span>Salvar Edições</span>
              </button>
            </div>
          </div>
        )}

        {/* Conteúdo Aba 2: Fotos */}
        {activeTab === 'fotos' && (
          aprovado ? (
            <PhotoReorder
              initialPhotos={fotos}
              onSaveOrder={handleReorderPhotos}
              isLoading={isSubmitting}
            />
          ) : (
            <div className="bg-white border border-brand-700/30 rounded-3xl p-8 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-brand-900/5 border border-brand-700/30 rounded-2xl flex items-center justify-center mx-auto text-brand-800">
                <ImageIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-brand-900">🔒 Galeria de Fotos Bloqueada para Download</h3>
              <p className="text-xs text-ink max-w-lg mx-auto leading-relaxed">
                A galeria completa de fotos em alta resolução otimizadas para publicação será <strong>liberada instantaneamente</strong> assim que você conferir os dados e clicar em <strong>&quot;Aprovar &amp; Publicar Anúncio&quot;</strong>.
              </p>
              <div className="bg-brand-900/5 border border-brand-700/30 rounded-2xl p-4 max-w-md mx-auto text-xs text-brand-800 font-bold">
                💳 O débito de 1 crédito do seu saldo só ocorre no momento da aprovação!
              </div>
              <button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-8 py-4 bg-success hover:bg-success text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Aprovar Anúncio Agora &amp; Liberar Fotos</span>
              </button>
            </div>
          )
        )}

        {/* Conteúdo Aba 3: Media Kit */}
        {activeTab === 'mediakit' && (
          aprovado ? (
            <MediaKitDisplay mediaKit={mediaKit} referencia={adData.referencia} />
          ) : (
            <div className="bg-white border border-brand-700/30 rounded-3xl p-8 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-brand-900/5 border border-brand-700/30 rounded-2xl flex items-center justify-center mx-auto text-brand-800">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-brand-900">🔒 Media Kit &amp; Mídias Bloqueadas para Download</h3>
              <p className="text-xs text-ink max-w-lg mx-auto leading-relaxed">
                O Media Kit profissional (legendas otimizadas por IA para Instagram e WhatsApp, tags de SEO e arquivos em alta resolução na nuvem) será <strong>liberado instantaneamente</strong> assim que você conferir os dados e clicar em <strong>&quot;Aprovar &amp; Publicar Anúncio&quot;</strong>.
              </p>
              <div className="bg-brand-900/5 border border-brand-700/30 rounded-2xl p-4 max-w-md mx-auto text-xs text-brand-800 font-bold">
                💳 O débito de 1 crédito do seu saldo só ocorre no momento da aprovação!
              </div>
              <button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-8 py-4 bg-success hover:bg-success text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Aprovar Anúncio Agora &amp; Liberar Kit</span>
              </button>
            </div>
          )
        )}

        {/* Sticky Actions Footer se pendente */}
        {!aprovado && approvalStatus !== 'REJEITADO' && etapa === 'revisao' && (
          <div className="sticky bottom-4 bg-white/95 backdrop-blur-md border border-line rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 z-30">
            <div className="text-xs text-ink font-medium">
              Ao aprovar, <strong>1 crédito</strong> será debitado do seu saldo e o kit final será publicado em Taboão da Serra e imediações.
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleReject}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-5 py-3.5 border border-line bg-paper hover:bg-danger/10 hover:text-danger hover:border-danger/50 text-ink rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>🗑️ Descartar Imóvel (0 Créditos)</span>
              </button>

              <button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-success hover:bg-success text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Aprovar &amp; Publicar Anúncio</span>
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default function AprovarPage() {
  return <AprovarContent />;
}