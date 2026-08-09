// ============================================================
// etapas.js
// Definição das etapas do Kanban de acompanhamento de renovação.
// Cada certificado a <=30 dias do vencimento entra no fluxo.
// "prazoDias" = quanto tempo o cartão pode ficar naquela etapa
// antes de ser sinalizado como atrasado.
// ============================================================

export const ETAPAS = [
  { id: "contatar",   titulo: "Contatar empresa", prazoDias: 30, cor: "#c0392b",
    desc: "Iniciar contato 30 dias antes do vencimento." },
  { id: "negociacao", titulo: "Em negociação",    prazoDias: 7,  cor: "#d98324",
    desc: "Negociação de valores e condições." },
  { id: "aprovacao",  titulo: "Em aprovação",     prazoDias: 7,  cor: "#c9a227",
    desc: "Aguardando aprovação do cliente." },
  { id: "agendamento",titulo: "Agendamento",      prazoDias: 3,  cor: "#2e7d9a",
    desc: "Agendar data do treinamento." },
  { id: "emissao",    titulo: "Emissão / Assinatura", prazoDias: 3, cor: "#1e7d4a",
    desc: "Emitir e assinar o certificado." },
];

// Etapa inicial em que os cartões entram
export const ETAPA_INICIAL = "contatar";

// devolve a definição de uma etapa pelo id
export function etapaPorId(id) {
  return ETAPAS.find(e => e.id === id) || ETAPAS[0];
}
