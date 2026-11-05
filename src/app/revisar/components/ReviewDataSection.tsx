'use client';

import React, { useState } from 'react';
import { ReviewField } from '@/lib/api';
import { Building2, Edit3, Check, AlertCircle } from 'lucide-react';
import { desenharOrigem } from '../reviewOrigens';
import { montarPatch, textoParaPatch, ehCampoNumerico, ehCampoContagem, ResultadoPatch } from '../reviewPatch';

interface ReviewDataSectionProps {
  campos: ReviewField[];
  dados: Record<string, any>;
  /**
   * Recebe o campo inteiro, não só o nome.
   *
   * O adaptador precisa do `rotulo` para escrever um erro que o corretor leia ("Área útil passou de
   * 2000 caracteres" não é mensagem de erro, é bug), e o componente é quem tem o rótulo. Passar
   * só a string obrigaria a página a caçar o rótulo num segundo `find` sobre a lista.
   */
  onUpdateField: (campo: ReviewField, valor: unknown) => void;
  /**
   * Erro do servidor por campo, indexado pelo nome do campo.
   *
   * Um `string` solto seria ambíguo: um único erro de autosave podeastar trinta campos e o
   * corretor não saberia qual repetir. Indexado, a mensagem aparece no card que falhou.
   */
  erroPorCampo?: Record<string, string>;
}

export function ReviewDataSection({
  campos,
  dados,
  onUpdateField,
  erroPorCampo,
}: ReviewDataSectionProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [erroDeEdicao, setErroDeEdicao] = useState<{ campo: string; texto: string } | null>(null);

  const tipo = String(dados?.tipoImovel || '').toLowerCase();
  const isCasa = tipo.includes('casa') || tipo.includes('sobrado') || tipo.includes('chacara') || tipo.includes('terreno');
  const isCondominioFechado =
    Boolean(dados?.condominio) ||
    Boolean(dados?.nomeCondominio) ||
    Boolean(dados?.valorCondominio) ||
    (Array.isArray(dados?.diferenciais_declarados) && dados.diferenciais_declarados.some((d: string) => String(d).toLowerCase().includes('condomínio') || String(d).toLowerCase().includes('condominio')));
  const isApto = !isCasa && (tipo.includes('apto') || tipo.includes('apartamento'));

  const camposFiltrados = campos.filter((item) => {
    if (isCasa && !isCondominioFechado && (item.campo === 'condominio' || item.campo === 'valorCondominio')) {
      return false;
    }
    return true;
  });

  const startEdit = (item: ReviewField, valorAtual: unknown) => {
    setEditingField(item.campo);
    setTempValue(textoParaPatch(item.campo, valorAtual));
    setErroDeEdicao(null);
  };

  /**
   * Valida antes de chamar a página.
   *
   * A validação é a do `ReviewPatchSchema`, não uma checagem genérica de campo vazio: ela recusa o
   * que o backend recusaria com 400, e devolve a mensagem que vai aparecer no lugar do campo. Se
   * este passo não existisse, o corretor veria "Erro HTTP 400" no cabeçalho da página, sem saber
   * qual dos trinta campos ele tinha digitado errado.
   */
  const saveEdit = (item: ReviewField): ResultadoPatch => {
    const resultado = montarPatch(item.campo, tempValue, item.rotulo);

    if (!resultado.ok) {
      setErroDeEdicao({ campo: item.campo, texto: resultado.erro });
      return resultado;
    }

    setErroDeEdicao(null);
    setEditingField(null);
    onUpdateField(item, tempValue);
    return resultado;
  };

  const cancelEdit = () => {
    setEditingField(null);
    setErroDeEdicao(null);
  };

  return (
    <div className="bg-white border border-line rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-extrabold text-brand-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-brand-800" />
          <span>Ficha e Dados do Imóvel</span>
        </h2>
        <span className="text-[11px] font-bold text-muted">Toque no lápis para corrigir</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {camposFiltrados.map((item) => {
          const isEditing = editingField === item.campo;
          const valorAtual = dados?.[item.campo] ?? item.valor;
          const isNaoInformado =
            valorAtual === null || valorAtual === undefined || valorAtual === '' || valorAtual === 'Não informado';
          const isCriticoApto = isApto && (item.campo === 'areaUtil' || item.campo === 'areaTotal') && isNaoInformado;

          // `origem` chega como `string` do JSON; `desenharOrigem` decide o desenho e devolve
          // "A confirmar" para o que não conhece. O `switch` antigo tratava o caso não listado
          // como "Declarado", que é afirmar ao corretor que ele mesmo declarou o valor.
          const origem = desenharOrigem(item.origem);
          const erroLocal = erroDeEdicao?.campo === item.campo ? erroDeEdicao.texto : null;
          const erroDoServidor = erroPorCampo?.[item.campo] || null;

          const valorExibido = isNaoInformado
            ? 'Não informado'
            : ehCampoNumerico(item.campo) && typeof valorAtual === 'number'
              ? valorAtual.toLocaleString('pt-BR')
              : String(valorAtual);

          return (
            <div
              key={item.campo}
              className={`p-3.5 rounded-2xl border transition-all ${
                erroLocal
                  ? 'border-danger/50 bg-danger/10/60 shadow-sm'
                  : isCriticoApto
                  ? 'border-gold/50 bg-gold/10/50 shadow-sm'
                  : isNaoInformado
                  ? 'border-line bg-paper/70'
                  : 'border-line bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-muted flex items-center gap-1">
                  {item.rotulo}
                  {isCriticoApto && (
                    <span className="text-gold font-extrabold text-[10px] flex items-center gap-0.5">
                      <AlertCircle className="w-3 h-3" /> Crítico
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className={origem.classe} title={origem.descricao}>
                    {origem.rotulo}
                  </span>
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => startEdit(item, valorAtual)}
                      className="p-1 text-muted hover:text-brand-800 rounded-lg hover:bg-paper transition-colors"
                      title={`Editar ${item.rotulo}`}
                      aria-label={`Editar ${item.rotulo}`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="mt-2 space-y-2">
                  <input
                    type="text"
                    inputMode={ehCampoContagem(item.campo) ? 'numeric' : ehCampoNumerico(item.campo) ? 'decimal' : 'text'}
                    value={tempValue}
                    onChange={(e) => {
                      setTempValue(e.target.value);
                      if (erroLocal) setErroDeEdicao(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(item);
                      if (e.key === 'Escape') cancelEdit();
                    }}
                    placeholder={
                      ehCampoNumerico(item.campo) ? 'Ex.: 350.000 ou 350000' : `Informe ${item.rotulo.toLowerCase()}`
                    }
                    className={`w-full text-sm font-semibold text-brand-900 border rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 ${
                      erroLocal
                        ? 'border-danger/50 focus:ring-danger/40/30'
                        : 'border-brand-700 focus:ring-brand-700/30'
                    }`}
                    autoFocus
                  />

                  {erroLocal && (
                    <p className="text-[11px] font-bold text-danger flex items-start gap-1">
                      <AlertCircle className="w-3 h-3 mt-px shrink-0" />
                      {erroLocal}
                    </p>
                  )}

                  {/* Enquanto o campo está em edição o selo some, e com ele a aviso de por que aquele valor está
                      ali. Por isso o aviso tem cópia textual aqui embaixo, fora do `input`. */}
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="text-xs text-muted font-bold px-2 py-1 rounded hover:bg-paper"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => saveEdit(item)}
                      className="text-xs bg-brand-900 text-white font-bold px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-brand-800"
                    >
                      <Check className="w-3.5 h-3.5" /> Salvar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <p
                    className={`text-sm font-bold ${
                      isNaoInformado ? 'text-gold italic font-medium' : 'text-brand-900'
                    }`}
                  >
                    {valorExibido}
                  </p>

                  {/* O aviso só aparece quando a origem exige ação. Mostrar a descrição de um campo
                      já confirmado polui a tela com texto que o corretor já sabe. */}
                  {origem.exigeConfirmacao && (
                    <p
                      className={`text-[11px] font-semibold leading-snug ${
                        origem.indicaConflito ? 'text-danger' : 'text-gold'
                      }`}
                    >
                      {origem.descricao}
                    </p>
                  )}

                  {origem.exigeConfirmacao && (
                    <button
                      type="button"
                      onClick={() => startEdit(item, valorAtual)}
                      className="text-[11px] font-extrabold inline-flex items-center gap-1 text-brand-800 hover:text-brand-800"
                    >
                      {origem.indicaConflito ? 'Resolver conflito' : 'Confirmar ou corrigir'}
                    </button>
                  )}

                  {erroDoServidor && (
                    <p className="text-[11px] font-bold text-danger flex items-start gap-1">
                      <AlertCircle className="w-3 h-3 mt-px shrink-0" />
                      {erroDoServidor}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legenda das origens. Sem ela, o corretor vê seis cores e nenhuma explicação do que
          significam, e a distinção entre "pode publicar" e "precisa confirmar" se perde. */}
      <details className="text-[11px] text-muted">
        <summary className="cursor-pointer font-bold text-muted hover:text-ink">
          O que significam estas etiquetas?
        </summary>
        <ul className="mt-2 space-y-1.5 pl-1">
          <li className="flex items-start gap-2">
            <span className="bg-success/10 text-success text-[10px] font-bold px-2 py-0.5 rounded shrink-0">
              Confirmado
            </span>
            <span>Você declarou ou a extração leu com alta confiança. Pode publicar assim.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-gold/10 text-gold text-[10px] font-bold px-2 py-0.5 rounded shrink-0">
              A confirmar
            </span>
            <span>Encontramos o valor, mas com pouca confiança. Abra e confira antes de aprovar.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-danger/10 text-danger text-[10px] font-bold px-2 py-0.5 rounded shrink-0">
              Conflito
            </span>
            <span>
              Duas fontes discordam. O portal usa o valor com prioridade; se estiver errado, edite.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-line text-ink text-[10px] font-bold px-2 py-0.5 rounded shrink-0">
              Não se aplica
            </span>
            <span>O campo não vale para este tipo de imóvel. Não é pendência.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-brand-900/5 text-brand-800 text-[10px] font-bold px-2 py-0.5 rounded shrink-0">
              Validado
            </span>
            <span>Confirmado por uma fonte externa confiável (ex.: geolocalização do bairro).</span>
          </li>
        </ul>
      </details>
    </div>
  );
}