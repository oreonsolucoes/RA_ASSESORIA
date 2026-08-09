// ============================================================
// conteudos.js
// Conteúdo programático (verso do certificado) e nome curto do
// selo por tipo de treinamento.
// NR-35 e NR-06 já preenchidos a partir dos modelos da Richard.
// Os demais entram como null até você fornecer os textos —
// nesses casos o formulário deixa o conteúdo editável na hora.
// ============================================================

export const CONTEUDOS = {
  "NR35": {
    selo: "NR 35",
    nomeCurto: "Trabalho em Altura - NR 35",
    referencias: "NR 01 e NR 35",
    itens: [
      "Normas e regulamentos aplicáveis ao trabalho em altura;",
      "Análise de Riscos e condições impeditivas;",
      "Riscos potenciais inerentes ao trabalho em altura, medidas de prevenção e controle;",
      "Sistema, equipamentos e procedimentos de proteção coletiva;",
      "Equipamentos de proteção individual para trabalho em altura: seleção, inspeção, conservação e limitação de uso;",
      "Acidentes típicos em trabalho em altura;",
      "Conduta em situações de emergência, incluindo noções de técnicas de resgate e de primeiros socorros;",
      "Aula Prática.",
    ],
  },
  "NR06": {
    selo: "NR 06",
    nomeCurto: "Utilização e Higienização de Equipamentos de Proteção Individual - EPI",
    referencias: "NR 01 e NR 06",
    itens: [
      "Conceitos e definições;",
      "Tipos de equipamentos de proteção individual;",
      "Como usar e ajustar os EPI;",
      "Procedimentos para higienização;",
      "Guarda e conservação;",
      "Requisição e devolução de EPI;",
      "Ficha de controle;",
      "Responsabilidades.",
    ],
  },

  // A preencher quando você enviar os conteúdos:
  "NR01": null,
  "NR10": null,
  "NR11": null,
  "NR12": null,
  "NR17": null,
  "NR18": null,
  "NR20": null,
  "NR23": null,
  "NR33_16": null,
  "NR33_24": null,
  "NR33_40": null,
  "DIR_DEFENSIVA": null,
  // (documentos da empresa como PGR, laudos etc. não geram certificado de treinamento)
};
