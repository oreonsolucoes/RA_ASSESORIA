// ============================================================
// vigencias.js
// Fonte única das vigências (em MESES) e do ESCOPO de cada item.
// escopo: "empresa"     -> documento da empresa (sem funcionário)
//         "funcionario" -> treinamento/exame individual
// Baseado na lista de TÓPICOS da Richard Assessoria.
// Se um prazo mudar, altere AQUI e todo o sistema acompanha.
// ============================================================

export const VIGENCIAS = {
  // --- Documentos da EMPRESA ---
  "PGR":            { label: "PGR — Programa de Gerenciamento de Riscos", meses: 24, escopo: "empresa" },
  "LTCAT":          { label: "LTCAT", meses: null, escopo: "empresa" },
  "LAUDO_INSAL":    { label: "Laudo de Insalubridade", meses: null, escopo: "empresa" },
  "LAUDO_PERIC":    { label: "Laudo de Periculosidade", meses: null, escopo: "empresa" },
  "AET":            { label: "AET — Análise Ergonômica (NR-17)", meses: null, escopo: "empresa" },
  "REL_NR01":       { label: "Relatório NR-01", meses: null, escopo: "empresa" },
  "PCMSO":          { label: "PCMSO — Programa de Controle Médico", meses: 12, escopo: "empresa" },
  "PAE":            { label: "PAE — Plano de Atendimento de Emergência", meses: null, escopo: "empresa" },
  "PPR":            { label: "PPR — Programa de Proteção Respiratória", meses: null, escopo: "empresa" },
  "PCA":            { label: "PCA — Programa de Conservação Auditiva", meses: null, escopo: "empresa" },

  // --- Itens do FUNCIONÁRIO ---
  "ASO":            { label: "ASO — Atestado de Saúde Ocupacional", meses: 12, escopo: "funcionario" },
  "NR01":           { label: "NR-01 — Ordem de Serviço", meses: null, escopo: "funcionario", semCarga: true },
  "NR06":           { label: "NR-06 — EPI", meses: 24, escopo: "funcionario" },
  "NR10":           { label: "NR-10 — Elétrica", meses: 24, escopo: "funcionario" },
  "NR11":           { label: "NR-11 — Içamento de Carga", meses: 12, escopo: "funcionario" },
  "NR12":           { label: "NR-12 — Máquinas e Equipamentos", meses: 12, escopo: "funcionario", pedeEquipamento: true },
  "NR17":           { label: "NR-17 — Ergonomia", meses: 12, escopo: "funcionario" },
  "NR18":           { label: "NR-18 — Construção Civil", meses: 12, escopo: "funcionario" },
  "NR20":           { label: "NR-20 — Inflamáveis", meses: 12, escopo: "funcionario" },
  "NR23":           { label: "NR-23 — Brigada de Incêndio", meses: 12, escopo: "funcionario" },
  "NR33_16":        { label: "NR-33 — Espaço Confinado (16h)", meses: 12, escopo: "funcionario" },
  "NR33_24":        { label: "NR-33 — Espaço Confinado (24h)", meses: 12, escopo: "funcionario" },
  "NR33_40":        { label: "NR-33 — Espaço Confinado (40h)", meses: 12, escopo: "funcionario" },
  "NR35":           { label: "NR-35 — Trabalho em Altura", meses: 24, escopo: "funcionario" },
  "DIR_DEFENSIVA":  { label: "Direção Defensiva", meses: 12, escopo: "funcionario" },
};

// Soma X meses a uma data e devolve uma nova Date.
export function somarMeses(data, meses) {
  const d = new Date(data);
  d.setMonth(d.getMonth() + meses);
  return d;
}
