// ============================================================
// equipamentos-def.js
// Definições para o módulo de locação de equipamentos.
// ============================================================

// Situações possíveis de um equipamento
export const SITUACOES = [
  { id: "disponivel", label: "Disponível",  cor: "#1e7d4a" },
  { id: "locado",     label: "Locado",      cor: "#2e7d9a" },
  { id: "manutencao", label: "Manutenção",  cor: "#d98324" },
  { id: "calibracao", label: "Em calibração", cor: "#c9a227" },
];

// Tipos comuns de equipamento em SST (editável)
export const TIPOS_EQUIP = [
  "Detector de gases",
  "Cinto de segurança / talabarte",
  "Trava-quedas",
  "Tripé para espaço confinado",
  "Bomba de amostragem",
  "Dosímetro de ruído",
  "Luxímetro",
  "Termômetro de globo (IBUTG)",
  "Bafômetro",
  "Outro",
];

// Itens padrão do checklist de entrega/devolução (editável por locação)
export const CHECKLIST_PADRAO = [
  "Equipamento limpo e sem avarias visíveis",
  "Certificado de calibração dentro da validade",
  "Acessórios completos (cabos, carregador, estojo)",
  "Bateria carregada / funcional",
  "Manual ou instruções entregues",
];

export function situacaoPorId(id) {
  return SITUACOES.find(s => s.id === id) || SITUACOES[0];
}

// dias até uma data (negativo = já passou)
export function diasAte(data) {
  const hoje = new Date(); hoje.setHours(0,0,0,0);
  return Math.ceil((data - hoje) / 86400000);
}
