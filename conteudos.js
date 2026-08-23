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

  "NR18": {
    selo: "NR 18",
    nomeCurto: "Capacitação básica em segurança do trabalho e meio ambiente em conformidade com Anexo 1 da NR 18 – Condições de Segurança e Saúde no Trabalho na Indústria da Construção",
    referencias: "NR 01 e NR 18",
    itens: [
      "Rotina de trabalho (horários e obrigações); ocorrências; atestados; benefícios aos colaboradores; comunicação interna;",
      "Conceito e finalidade do EPI; tipos de EPI de acordo com os riscos; correta utilização; guarda, conservação e higienização;",
      "Atos inseguros e condições inseguras; ergonomia; noções de primeiros socorros; prevenção e combate a incêndio;",
      "Análise preliminar de riscos; ordem de serviço; trabalho em altura; proteções das mãos; exames médicos;",
      "Riscos químicos, biológicos e físicos; sinalização de obras em vias públicas; PGR do canteiro de obras;",
      "Gerenciamento de resíduos sólidos; coleta seletiva; prevenção e controle de vazamentos químicos.",
    ],
  },

  "NR33_16": {
    selo: "NR 33",
    nomeCurto: "NR 33 – Espaço Confinado como trabalhador autorizado e vigia na construção civil",
    referencias: "NR 33",
    itens: [
      "Definições;",
      "Reconhecimento, avaliação e controle de riscos;",
      "Funcionamento de equipamentos utilizados;",
      "Procedimentos e utilização da PET (Permissão de Entrada e Trabalho); e",
      "Noções de resgate e primeiros socorros.",
    ],
  },

  "NR12": {
    selo: "NR 12",
    nomeCurto: "NR-12 — Segurança no Trabalho em Máquinas e Equipamentos",
    referencias: "NR 01 e NR 12",
    itens: [
      "Descrição e identificação dos riscos associados com cada máquina e equipamento e as proteções específicas contra cada um deles;",
      "Funcionamento das proteções: como e por que devem ser usadas;",
      "Como e em que circunstâncias uma proteção pode ser removida, e por quem;",
      "O que fazer (por exemplo, contatar o supervisor) se uma proteção foi danificada ou perdeu sua função;",
      "Princípios de segurança na utilização da máquina ou equipamento;",
      "Segurança para riscos mecânicos, elétricos e outros relevantes;",
      "Método de trabalho seguro; permissão de trabalho; sistema de bloqueio de funcionamento da máquina;",
      "Operações de inspeção, limpeza, lubrificação e manutenção.",
    ],
  },

  "DIR_DEFENSIVA": {
    selo: "SESMT",
    nomeCurto: "Treinamento de Direção Defensiva – Caminhões e Transportes de Cargas",
    referencias: "Código de Trânsito Brasileiro",
    itens: [
      "Conceitos fundamentais e a importância da condução segura;",
      "Análise do comportamento e da percepção do motorista diante dos riscos;",
      "Manutenção preventiva, equipamentos de segurança e procedimentos de inspeção;",
      "Conhecimento das condições da via e como se adaptar a elas;",
      "Fatores como chuvas, neblina, noite e estradas em mau estado;",
      "Tipos de colisão e como evitá-las;",
      "Uso do cinto de segurança, respeito à sinalização e distância de segurança;",
      "Boas práticas no trânsito e respeito aos outros motoristas e pedestres;",
      "Revisão do Código de Trânsito Brasileiro e principais infrações e penalidades;",
      "Primeiros socorros e ações a serem tomadas após um acidente.",
    ],
  },

  "NR33_REC": {
    selo: "NR 33",
    nomeCurto: "Reciclagem NR-33 — Espaço Confinado (Profissional Autorizado e Vigia)",
    referencias: "NR 33",
    itens: [
      "Identificação dos espaços confinados;",
      "Critérios de indicação e uso de equipamentos para controle de riscos;",
      "Conhecimento sobre práticas seguras em espaços confinados;",
      "Legislação de segurança e saúde no trabalho;",
      "Medidas de controle: riscos físicos, químicos, biológicos, ergonômicos e de acidentes;",
      "Monitoramento, bloqueio de fonte de energia, técnicas de ventilação exaustora e diluidora, purga, comunicação, uso de EPI e proteções coletivas, aparelhos diretores;",
      "Deveres e responsabilidade da empresa, vigias, trabalhadores e supervisores;",
      "Legislação e regulamentação.",
    ],
  },

  // A preencher quando você enviar os conteúdos:
  "NR01": {
    selo: "NR 01",
    nomeCurto: "NR-01 — Ordem de Serviço / Disposições Gerais de Segurança",
    referencias: "NR 01",
    itens: [
      "Direitos e deveres dos trabalhadores e empregadores em segurança e saúde no trabalho;",
      "Comunicação de acidentes de trabalho e doenças ocupacionais;",
      "Medidas preventivas e de controle de riscos no ambiente de trabalho;",
      "Procedimentos em caso de situação de risco grave e iminente;",
      "Responsabilidades do trabalhador e do empregador conforme NR-01;",
      "Programa de Gerenciamento de Riscos (PGR): conceitos e aplicação.",
    ],
  },

  "NR10": {
    selo: "NR 10",
    nomeCurto: "NR-10 — Segurança em Instalações e Serviços em Eletricidade",
    referencias: "NR 01 e NR 10",
    itens: [
      "Riscos em instalações e serviços com eletricidade; efeitos da corrente elétrica no corpo humano;",
      "Medidas de controle do risco elétrico: equipamentos de proteção coletiva e individual;",
      "Normas técnicas aplicáveis: ABNT NBR 5410, NR-10 e legislação complementar;",
      "Prontuário de instalações elétricas; documentação técnica obrigatória;",
      "Bloqueio e etiquetagem (lockout/tagout): procedimentos de segurança;",
      "Primeiros socorros em acidentes com eletricidade; liberação de vítimas.",
    ],
  },

  "NR11": {
    selo: "NR 11",
    nomeCurto: "NR-11 — Transporte, Movimentação, Armazenagem e Manuseio de Materiais",
    referencias: "NR 01 e NR 11",
    itens: [
      "Normas de segurança para transporte e movimentação de materiais;",
      "Operação segura de empilhadeiras, paleteiras e equipamentos de movimentação;",
      "Inspeção e manutenção de equipamentos de carga e transporte;",
      "Sinalização de áreas de movimentação; rotas de tráfego seguro;",
      "Ergonomia no manuseio manual de cargas: técnicas de levantamento;",
      "Armazenagem correta de materiais: empilhamento, estabilidade e limites de carga.",
    ],
  },

  "NR17": {
    selo: "NR 17",
    nomeCurto: "NR-17 — Ergonomia",
    referencias: "NR 01 e NR 17",
    itens: [
      "Conceitos de ergonomia e sua aplicação no ambiente de trabalho;",
      "Análise Ergonômica do Trabalho (AET): metodologia e objetivos;",
      "Levantamento, transporte e descarga de materiais: limites e técnicas seguras;",
      "Mobiliário, equipamentos e condições ambientais do posto de trabalho;",
      "Organização do trabalho: ritmo, pausas, monotonia e repetitividade;",
      "Distúrbios osteomusculares relacionados ao trabalho (DORT/LER): prevenção.",
    ],
  },

  "NR20": {
    selo: "NR 20",
    nomeCurto: "NR-20 — Segurança e Saúde no Trabalho com Inflamáveis e Combustíveis",
    referencias: "NR 01 e NR 20",
    itens: [
      "Propriedades físico-químicas de líquidos inflamáveis e combustíveis;",
      "Classificação de áreas com risco de incêndio e explosão;",
      "Medidas de prevenção e controle em operações com inflamáveis;",
      "Equipamentos de proteção coletiva e individual para áreas classificadas;",
      "Armazenamento e manuseio seguro de inflamáveis e combustíveis;",
      "Procedimentos de emergência em caso de vazamento, incêndio ou explosão.",
    ],
  },

  "NR23": {
    selo: "NR 23",
    nomeCurto: "NR-23 — Proteção Contra Incêndios",
    referencias: "NR 01 e NR 23",
    itens: [
      "Conceitos sobre incêndio: triângulo do fogo, classes de incêndio e métodos de extinção;",
      "Sistemas de prevenção e combate a incêndio: sprinklers, detectores e alarmes;",
      "Tipos de extintores: seleção, inspeção e uso correto conforme a classe do fogo;",
      "Sinalização de segurança, rotas de fuga e saídas de emergência;",
      "Plano de emergência e abandono de área: funções e responsabilidades;",
      "Exercícios práticos de acionamento de extintores e abandono simulado.",
    ],
  },

  "NR33_24": {
    selo: "NR 33",
    nomeCurto: "NR-33 — Espaço Confinado (24h) — Trabalhador Autorizado e Vigia",
    referencias: "NR 33",
    itens: [
      "Definições, identificação e classificação de espaços confinados;",
      "Reconhecimento, avaliação e controle de riscos atmosféricos e físicos;",
      "Programa de Entrada em Espaço Confinado (PEEC): estrutura e responsabilidades;",
      "Permissão de Entrada e Trabalho (PET): elaboração e aplicação;",
      "Equipamentos de monitoramento da atmosfera: tipos, calibração e uso;",
      "Equipamentos de proteção individual e coletiva para espaços confinados;",
      "Comunicação e bloqueio de fontes de energia; isolamento e ventilação;",
      "Procedimentos de resgate e primeiros socorros; utilização do tripé de resgate.",
    ],
  },

  "NR33_40": {
    selo: "NR 33",
    nomeCurto: "NR-33 — Espaço Confinado (40h) — Supervisor de Entrada",
    referencias: "NR 33",
    itens: [
      "Legislação e regulamentação aplicável a espaços confinados: NR-33 e normas complementares;",
      "Identificação, classificação e inventário de espaços confinados na empresa;",
      "Análise e avaliação de riscos: atmosféricos, físicos, biológicos e ergonômicos;",
      "Programa de Entrada em Espaço Confinado (PEEC): elaboração e gerenciamento;",
      "Permissão de Entrada e Trabalho (PET): emissão, controle e cancelamento;",
      "Monitoramento contínuo da atmosfera: equipamentos e procedimentos;",
      "Sistemas de ventilação: exaustão, diluição, purga e inertização;",
      "Responsabilidades do supervisor de entrada: treinamento e supervisão da equipe;",
      "Procedimentos de resgate: planejamento, equipamentos e atuação da brigada.",
    ],
  },
  // (documentos da empresa como PGR, laudos etc. não geram certificado de treinamento)
};
