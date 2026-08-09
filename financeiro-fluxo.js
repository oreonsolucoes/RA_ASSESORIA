// ============================================================
// financeiro-fluxo.js
// Definições do fluxo de cobrança (paralelo ao pipeline operacional).
// Baseado nas anotações: valor dinâmico -> em negociação -> a faturar
// (à vista / 21d / 30d / avulsa) -> faturado -> nota emitida.
// ============================================================

// Etapas do fluxo financeiro (colunas do kanban financeiro)
export const ETAPAS_FIN = [
  { id: "valor",      titulo: "Definir valor",  cor: "#6b7688",
    desc: "Lançar o valor do serviço." },
  { id: "negociacao", titulo: "Em negociação",  cor: "#d98324",
    desc: "Negociando valor/condições." },
  { id: "a_faturar",  titulo: "A faturar",      cor: "#2e7d9a",
    desc: "Aprovado, aguardando faturamento." },
  { id: "faturado",   titulo: "Faturado",       cor: "#7a5cbf",
    desc: "Nota emitida, aguardando pagamento." },
  { id: "pago",       titulo: "Pago",           cor: "#1e7d4a",
    desc: "Pagamento recebido." },
];

export const ETAPA_FIN_INICIAL = "valor";

// Condições de pagamento (sub-opção de "a faturar")
export const CONDICOES = [
  { id: "avista",  label: "À vista",       dias: 0 },
  { id: "d21",     label: "A faturar 21 dias", dias: 21 },
  { id: "d30",     label: "A faturar 30 dias", dias: 30 },
  { id: "avulsa",  label: "Avulsa (definir)",  dias: null },
];

export function etapaFinPorId(id) {
  return ETAPAS_FIN.find(e => e.id === id) || ETAPAS_FIN[0];
}
export function condicaoPorId(id) {
  return CONDICOES.find(c => c.id === id) || null;
}

// Formata número como moeda BRL
export function moedaBR(v) {
  const n = Number(v) || 0;
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
