// ============================================================
// certificado.js (v6 — DIPLOMA PREMIUM / A4 PAISAGEM)
// ============================================================
//
// Mantém:
// - A4 paisagem
// - Logo
// - Selo
// - Assinatura do instrutor
// - Frente e verso
// - Conteúdo programático
// - Referências normativas
// - Aparência customizável
// - jsPDF
//
// ============================================================

const VINHO   = "#720000";
const VINHO2  = "#4F0000";
const DOURADO = "#B8943D";
const DOURADO2 = "#D7BE72";
const CREME   = "#FBF7EE";
const CREME2  = "#F4ECDD";
const TINTA   = "#20202A";
const CINZA   = "#686875";
const CINZA2  = "#9999A3";
const PRETO   = "#111111";
const BRANCO  = "#FFFFFF";

const AP_PADRAO = {
  fontCorpo: 12.5,
  leading: 6.8,

  tamanhoTitulo: 34,
  tamanhoNome: 23,

  corBarra: VINHO,
  corRodape: VINHO,

  corNome: TINTA,
  corBorda: DOURADO,

  yAssin: 151,
};


// ============================================================
// CARREGAMENTO DE IMAGENS
// ============================================================

export async function carregarImagemComoDataUrl(url) {
  if (!url) return null;

  return new Promise(resolve => {
    const img = new Image();

    const ehOutra =
      /^https?:\/\//i.test(url) &&
      !url.startsWith(location.origin);

    if (ehOutra) {
      img.crossOrigin = "anonymous";
    }

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        resolve(canvas.toDataURL("image/png"));
      } catch (e) {
        console.warn("Erro CORS ao converter imagem:", e);
        resolve(null);
      }
    };

    img.onerror = () => {
      console.warn("Falha ao carregar imagem:", url);
      resolve(null);
    };

    img.src = url;
  });
}


// ============================================================
// GERAÇÃO PRINCIPAL
// ============================================================

export function gerarCertificado(dados) {

  const { jsPDF } = window.jspdf;

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4"
  });

  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  frente(doc, W, H, dados);

  if ((dados.conteudoItens || []).length > 0) {
    doc.addPage();
    verso(doc, W, H, dados);
  }

  return doc;
}


// ============================================================
// FUNÇÕES AUXILIARES DE TEXTO
// ============================================================

function medirTexto(doc, texto, tamanho, negrito = false) {
  doc.setFont(
    "helvetica",
    negrito ? "bold" : "normal"
  );

  doc.setFontSize(tamanho);

  return doc.getTextWidth(texto);
}


// ------------------------------------------------------------
// Texto centralizado com quebra automática
// ------------------------------------------------------------

function textoCentralizado(
  doc,
  texto,
  cx,
  y,
  maxW,
  fs,
  fonte = "normal",
  espacamento = 5
) {

  doc.setFont("helvetica", fonte);
  doc.setFontSize(fs);

  const linhas = doc.splitTextToSize(texto, maxW);

  linhas.forEach(linha => {

    doc.text(
      linha,
      cx,
      y,
      { align: "center" }
    );

    y += espacamento;
  });

  return y;
}


// ------------------------------------------------------------
// Parágrafo justificado com negrito parcial
// ------------------------------------------------------------

function paraJust(
  doc,
  x,
  y,
  maxW,
  fs,
  lead,
  partes
) {

  doc.setFontSize(fs);

  const tokens = [];

  partes.forEach(parte => {

    const palavras = parte.t.split(/(\s+)/);

    palavras.forEach(w => {

      if (w.length) {
        tokens.push({
          w,
          b: parte.b
        });
      }

    });

  });

  const espaco = () => {

    doc.setFont(
      "helvetica",
      "normal"
    );

    return doc.getTextWidth(" ");
  };

  const larguraToken = token => {

    doc.setFont(
      "helvetica",
      token.b ? "bold" : "normal"
    );

    return doc.getTextWidth(token.w);
  };

  const linhas = [];

  let linha = [];
  let larguraLinha = 0;

  tokens.forEach(token => {

    if (!token.w.trim()) return;

    const largura = larguraToken(token);

    const adicionar =
      linha.length
        ? espaco() + largura
        : largura;

    if (
      larguraLinha + adicionar > maxW &&
      linha.length
    ) {

      linhas.push(linha);

      linha = [token];
      larguraLinha = largura;

    } else {

      linha.push(token);
      larguraLinha += adicionar;

    }

  });

  if (linha.length) {
    linhas.push(linha);
  }

  linhas.forEach((linha, indice) => {

    const ultima =
      indice === linhas.length - 1;

    const soma = linha.reduce(
      (total, token) =>
        total + larguraToken(token),
      0
    );

    const quantidadeEspacos =
      linha.length - 1;

    let espacoLinha = espaco();

    if (
      !ultima &&
      quantidadeEspacos > 0
    ) {

      espacoLinha =
        (maxW - soma) /
        quantidadeEspacos;

    }

    let cursorX = x;

    linha.forEach((token, i) => {

      doc.setFont(
        "helvetica",
        token.b ? "bold" : "normal"
      );

      doc.text(
        token.w,
        cursorX,
        y
      );

      cursorX +=
        larguraToken(token);

      if (i < quantidadeEspacos) {
        cursorX += espacoLinha;
      }

    });

    y += lead;
  });

  return y;
}


// ============================================================
// ELEMENTOS DECORATIVOS
// ============================================================

// ------------------------------------------------------------
// Losango
// ------------------------------------------------------------

function desenharLosango(
  doc,
  cx,
  cy,
  tamanho,
  preenchido = true
) {

  doc.setDrawColor(DOURADO);
  doc.setLineWidth(0.6);

  if (preenchido) {
    doc.setFillColor(DOURADO);
  }

  const pontos = [
    [0, -tamanho],
    [tamanho, 0],
    [0, tamanho],
    [-tamanho, 0]
  ];

  doc.lines(
    [
      [tamanho, tamanho],
      [-tamanho, tamanho],
      [-tamanho, -tamanho],
      [tamanho, -tamanho]
    ],
    cx,
    cy - tamanho,
    [1, 1],
    preenchido ? "F" : "S",
    true
  );
}


// ------------------------------------------------------------
// Pequeno ornamento central
// ------------------------------------------------------------

function ornamentoCentral(
  doc,
  cx,
  y,
  largura = 90,
  cor = DOURADO
) {

  doc.setDrawColor(cor);
  doc.setLineWidth(0.5);

  const meio = 5;

  doc.line(
    cx - largura / 2,
    y,
    cx - meio,
    y
  );

  doc.line(
    cx + meio,
    y,
    cx + largura / 2,
    y
  );

  doc.setFillColor(cor);

  const d = 2;

  doc.lines(
    [
      [d, d],
      [-d, d],
      [-d, -d],
      [d, -d]
    ],
    cx,
    y - d,
    [1, 1],
    "F",
    true
  );
}


// ------------------------------------------------------------
// Ornamento de canto
// ------------------------------------------------------------

function ornamentoCanto(
  doc,
  x,
  y,
  ladoX,
  ladoY,
  cor = DOURADO
) {

  doc.setDrawColor(cor);
  doc.setLineWidth(0.55);

  doc.line(
    x,
    y,
    x + ladoX,
    y
  );

  doc.line(
    x,
    y,
    x,
    y + ladoY
  );

  doc.setLineWidth(0.25);

  doc.line(
    x + 2,
    y + 2,
    x + ladoX - 2,
    y + 2
  );

  doc.line(
    x + 2,
    y + 2,
    x + 2,
    y + ladoY - 2
  );
}


// ------------------------------------------------------------
// Moldura completa
// ------------------------------------------------------------

function desenharMoldura(
  doc,
  W,
  H,
  cor = DOURADO
) {

  // Fundo
  doc.setFillColor(CREME);
  doc.rect(
    0,
    0,
    W,
    H,
    "F"
  );

  // Moldura externa
  doc.setDrawColor(cor);
  doc.setLineWidth(1.8);

  doc.rect(
    6,
    6,
    W - 12,
    H - 12
  );

  // Moldura intermediária
  doc.setLineWidth(0.35);

  doc.rect(
    8.5,
    8.5,
    W - 17,
    H - 17
  );

  // Moldura interna
  doc.setLineWidth(0.7);

  doc.rect(
    11,
    11,
    W - 22,
    H - 22
  );

  // Cantos
  ornamentoCanto(
    doc,
    14,
    14,
    13,
    13,
    cor
  );

  ornamentoCanto(
    doc,
    W - 14,
    14,
    -13,
    13,
    cor
  );

  ornamentoCanto(
    doc,
    14,
    H - 14,
    13,
    -13,
    cor
  );

  ornamentoCanto(
    doc,
    W - 14,
    H - 14,
    -13,
    -13,
    cor
  );
}


// ------------------------------------------------------------
// Barras vinho
// ------------------------------------------------------------

function desenharBarras(
  doc,
  W,
  H,
  cor = VINHO
) {

  doc.setFillColor(cor);

  doc.rect(
    6,
    6,
    W - 12,
    7,
    "F"
  );

  doc.rect(
    6,
    H - 13,
    W - 12,
    7,
    "F"
  );
}


// ============================================================
// SELO
// ============================================================

function desenharSelo(
  doc,
  d,
  cx,
  cy,
  tamanho
) {

  // Sombra
  doc.setFillColor("#D9D0BA");

  doc.circle(
    cx + 1,
    cy + 1,
    tamanho,
    "F"
  );

  // Círculo externo
  doc.setFillColor(DOURADO);
  doc.setDrawColor(VINHO2);
  doc.setLineWidth(0.8);

  doc.circle(
    cx,
    cy,
    tamanho,
    "FD"
  );

  // Círculo interno
  doc.setFillColor(CREME);
  doc.setDrawColor(VINHO2);
  doc.setLineWidth(0.5);

  doc.circle(
    cx,
    cy,
    tamanho - 2.2,
    "FD"
  );

  // Texto
  const seloTexto =
    String(d.selo || "NR")
      .trim()
      .split(/\s+/);

  doc.setTextColor(VINHO2);
  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(8.5);

  doc.text(
    seloTexto[0] || "NR",
    cx,
    cy - 1,
    { align: "center" }
  );

  doc.setFontSize(6.5);

  doc.text(
    seloTexto.slice(1).join(" ") || "CERTIFICADO",
    cx,
    cy + 4,
    { align: "center" }
  );

  // Estrelinhas laterais
  doc.setFontSize(6);

  doc.text(
    "✦",
    cx - tamanho + 3,
    cy + 1,
    { align: "center" }
  );

  doc.text(
    "✦",
    cx + tamanho - 3,
    cy + 1,
    { align: "center" }
  );
}


// ============================================================
// FRENTE DO DIPLOMA
// ============================================================

function frente(
  doc,
  W,
  H,
  d
) {

  const ap = {
    ...AP_PADRAO,
    ...(d.aparencia || {})
  };

  const MX = 18;
  const cx = W / 2;

  const corBorda =
    ap.corBorda || DOURADO;

  const corBarra =
    ap.corBarra || VINHO;

  // ----------------------------------------------------------
  // Fundo e moldura
  // ----------------------------------------------------------

  desenharMoldura(
    doc,
    W,
    H,
    corBorda
  );

  desenharBarras(
    doc,
    W,
    H,
    corBarra
  );


  // ----------------------------------------------------------
  // Logo
  // ----------------------------------------------------------

  if (d.logoDataUrl) {

    try {

      doc.addImage(
        d.logoDataUrl,
        "PNG",
        20,
        18,
        50,
        18
      );

    } catch (e) {

      console.warn(
        "Erro ao inserir logo:",
        e
      );

    }

  }


  // ----------------------------------------------------------
  // Selo
  // ----------------------------------------------------------

  const seloTam = 15;

  const seloX =
    W - 28;

  const seloY =
    28;

  if (d.seloDataUrl) {

    try {

      doc.addImage(
        d.seloDataUrl,
        "PNG",
        seloX - seloTam,
        seloY - seloTam,
        seloTam * 2,
        seloTam * 2
      );

    } catch (e) {

      console.warn(
        "Erro ao inserir selo:",
        e
      );

      desenharSelo(
        doc,
        d,
        seloX,
        seloY,
        seloTam
      );
    }

  } else {

    desenharSelo(
      doc,
      d,
      seloX,
      seloY,
      seloTam
    );

  }


  // ----------------------------------------------------------
  // Identificação institucional
  // ----------------------------------------------------------

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(7.5);

  doc.setTextColor(
    DOURADO
  );

  doc.text(
    "RICHARD CONSULTORIA EM SEGURANÇA DO TRABALHO",
    cx,
    21,
    { align: "center" }
  );


  // ----------------------------------------------------------
  // Título
  // ----------------------------------------------------------

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(
    Number(ap.tamanhoTitulo) || 34
  );

  doc.setTextColor(
    TINTA
  );

  doc.text(
    "CERTIFICADO",
    cx,
    43,
    { align: "center" }
  );

  ornamentoCentral(
    doc,
    cx,
    47,
    100,
    corBorda
  );


  // ----------------------------------------------------------
  // Texto "Conferido a"
  // ----------------------------------------------------------

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(10);

  doc.setTextColor(
    CINZA
  );

  doc.text(
    "Conferido a",
    cx,
    56,
    { align: "center" }
  );


  // ----------------------------------------------------------
  // Nome
  // ----------------------------------------------------------

  const nome =
    String(d.nome || "")
      .trim()
      .toUpperCase();

  let tamanhoNome =
    Number(ap.tamanhoNome) || 23;

  // Reduz automaticamente nomes muito grandes
  while (
    tamanhoNome > 16 &&
    medirTexto(
      doc,
      nome,
      tamanhoNome,
      true
    ) > 190
  ) {

    tamanhoNome -= 0.5;

  }

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(
    tamanhoNome
  );

  doc.setTextColor(
    ap.corNome || TINTA
  );

  doc.text(
    nome,
    cx,
    68,
    { align: "center" }
  );


  // Linha ornamental abaixo do nome
  const larguraNome =
    Math.min(
      medirTexto(
        doc,
        nome,
        tamanhoNome,
        true
      ) + 20,
      205
    );

  doc.setDrawColor(
    corBorda
  );

  doc.setLineWidth(
    0.45
  );

  doc.line(
    cx - larguraNome / 2,
    72,
    cx + larguraNome / 2,
    72
  );


  // ----------------------------------------------------------
  // Texto principal
  // ----------------------------------------------------------

  const bodyX = 39;
  const bodyW = W - 78;

  const trechoCarga =
    d.cargaHoraria
      ? `, com carga horária de ${d.cargaHoraria}`
      : "";

  const temVerso =
    (d.conteudoItens || []).length > 0;

  const partes = [

    {
      t: `Portador do CPF ${d.cpfFmt || ""}, pela participação do `,
      b: false
    },

    {
      t: d.treinamentoNome || "",
      b: true
    },

    {
      t:
        ` no dia ${d.dataTreino || ""}` +
        `${trechoCarga}, ` +
        `pela Empresa Richard Consultoria em Segurança do Trabalho ` +
        `nas dependências da Empresa ${d.empresaRazao || ""}` +
        `${
          d.endereco
            ? `, localizada na ${d.endereco}`
            : ""
        }` +
        `${
          temVerso
            ? ", conforme conteúdo programático, vide verso:"
            : "."
        }`,

      b: false
    }

  ];

  doc.setTextColor(
    PRETO
  );

  const yFim =
    paraJust(
      doc,
      bodyX,
      82,
      bodyW,
      Number(ap.fontCorpo) || 12.5,
      Number(ap.leading) || 6.8,
      partes
    );


  // ----------------------------------------------------------
  // Frase institucional
  // ----------------------------------------------------------

  const fraseY =
    Math.max(
      yFim + 3,
      104
    );

  doc.setFont(
    "helvetica",
    "italic"
  );

  doc.setFontSize(8.5);

  doc.setTextColor(
    CINZA
  );

  doc.text(
    "Certificamos, para os devidos fins, a conclusão da capacitação acima descrita.",
    cx,
    fraseY,
    { align: "center" }
  );


  // ----------------------------------------------------------
  // Assinaturas
  // ----------------------------------------------------------

  const yb = Math.max(
    Math.min(
      Number(ap.yAssin) || 151,
      H - 39
    ),
    fraseY + 15
  );

  const linhaW = 72;

  // Participante
  const xPart =
    70;

  // Instrutor
  const xInstr =
    W - 70;


  // Linhas
  doc.setDrawColor(
    CINZA
  );

  doc.setLineWidth(
    0.4
  );

  doc.line(
    xPart - linhaW / 2,
    yb,
    xPart + linhaW / 2,
    yb
  );

  doc.line(
    xInstr - linhaW / 2,
    yb,
    xInstr + linhaW / 2,
    yb
  );


  // ----------------------------------------------------------
  // Assinatura do instrutor
  // ----------------------------------------------------------

  if (
    d.assinaturaInstrutorDataUrl
  ) {

    try {

      doc.addImage(
        d.assinaturaInstrutorDataUrl,
        "PNG",
        xInstr - 27,
        yb - 17,
        54,
        15
      );

    } catch (e) {

      console.warn(
        "Erro ao inserir assinatura:",
        e
      );

    }

  }


  // ----------------------------------------------------------
  // Dados participante
  // ----------------------------------------------------------

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(9);

  doc.setTextColor(
    TINTA
  );

  doc.text(
    nome,
    xPart,
    yb + 5,
    { align: "center" }
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(8);

  doc.setTextColor(
    CINZA
  );

  doc.text(
    "Participante",
    xPart,
    yb + 10,
    { align: "center" }
  );


  // ----------------------------------------------------------
  // Dados instrutor
  // ----------------------------------------------------------

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(9);

  doc.setTextColor(
    TINTA
  );

  doc.text(
    "Elvio Richard Gonçalves",
    xInstr,
    yb + 5,
    { align: "center" }
  );

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(8);

  doc.setTextColor(
    CINZA
  );

  doc.text(
    "Eng. Seg. Trab. / Instrutor",
    xInstr,
    yb + 10,
    { align: "center" }
  );

  doc.setFont(
    "helvetica",
    "italic"
  );

  doc.setFontSize(7.5);

  doc.text(
    "CREA nº 5070103113",
    xInstr,
    yb + 15,
    { align: "center" }
  );


  // ----------------------------------------------------------
  // Pequenos ornamentos próximos às assinaturas
  // ----------------------------------------------------------

  doc.setFillColor(
    corBorda
  );

  doc.circle(
    cx,
    yb + 4,
    1.1,
    "F"
  );


  // ----------------------------------------------------------
  // Rodapé
  // ----------------------------------------------------------

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(7.5);

  doc.setTextColor(
    BRANCO
  );

  doc.text(
    "RICHARD Consultoria em Segurança do Trabalho",
    cx,
    H - 9.3,
    { align: "center" }
  );

  doc.setFontSize(6.8);

  doc.text(
    "Rua Tiro ao Pombo, 402 - Freguesia do Ó - São Paulo - SP   •   Tel.: (11) 9 5826 5323",
    cx,
    H - 6.4,
    { align: "center" }
  );
}


// ============================================================
// VERSO
// ============================================================

function verso(
  doc,
  W,
  H,
  d
) {

  const MX = 20;
  const cx = W / 2;

  // ----------------------------------------------------------
  // Fundo + moldura
  // ----------------------------------------------------------

  desenharMoldura(
    doc,
    W,
    H,
    DOURADO
  );

  desenharBarras(
    doc,
    W,
    H,
    VINHO
  );


  // ----------------------------------------------------------
  // Cabeçalho
  // ----------------------------------------------------------

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(7);

  doc.setTextColor(
    DOURADO
  );

  doc.text(
    "RICHARD CONSULTORIA EM SEGURANÇA DO TRABALHO",
    cx,
    21,
    { align: "center" }
  );


  // ----------------------------------------------------------
  // Título
  // ----------------------------------------------------------

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(24);

  doc.setTextColor(
    TINTA
  );

  doc.text(
    "CONTEÚDO PROGRAMÁTICO",
    cx,
    37,
    { align: "center" }
  );

  ornamentoCentral(
    doc,
    cx,
    41,
    110,
    DOURADO
  );


  // ----------------------------------------------------------
  // Subtítulo
  // ----------------------------------------------------------

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(9);

  doc.setTextColor(
    CINZA
  );

  doc.text(
    d.treinamentoNome || "Capacitação Profissional",
    cx,
    49,
    { align: "center" }
  );


  // ----------------------------------------------------------
  // Conteúdo
  // ----------------------------------------------------------

  const itens =
    Array.isArray(d.conteudoItens)
      ? d.conteudoItens
      : [];

  if (!itens.length) {
    return;
  }


  // Quantidade de colunas
  let colunas = 1;

  if (itens.length > 7) {
    colunas = 2;
  }

  const areaX = MX + 15;
  const areaW = W - (areaX * 2);

  const espacamentoColuna =
    colunas === 2
      ? 12
      : 0;

  const colW =
    colunas === 2
      ? (areaW - espacamentoColuna) / 2
      : areaW;


  const inicioY = 58;

  const meio =
    colunas === 2
      ? Math.ceil(itens.length / 2)
      : itens.length;


  let y1 = inicioY;
  let y2 = inicioY;


  // ----------------------------------------------------------
  // Função de renderização do item
  // ----------------------------------------------------------

  const desenharItem = (
    texto,
    x,
    y,
    largura
  ) => {

    const bulletX =
      x + 2;

    const textoX =
      x + 8;

    const textoW =
      largura - 8;

    // Bullet
    doc.setFillColor(
      DOURADO
    );

    doc.circle(
      bulletX,
      y - 1.5,
      1.15,
      "F"
    );

    // Texto
    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(10.5);

    doc.setTextColor(
      PRETO
    );

    const linhas =
      doc.splitTextToSize(
        String(texto || ""),
        textoW
      );

    doc.text(
      linhas,
      textoX,
      y
    );

    return (
      linhas.length * 5.2
    ) + 4.5;
  };


  // ----------------------------------------------------------
  // Renderização dos itens
  // ----------------------------------------------------------

  itens.forEach(
    (item, index) => {

      if (
        colunas === 2 &&
        index >= meio
      ) {

        y2 += desenharItem(
          item,
          areaX + colW + espacamentoColuna,
          y2,
          colW
        );

      } else {

        y1 += desenharItem(
          item,
          areaX,
          y1,
          colW
        );

      }

    }
  );


  // ----------------------------------------------------------
  // Referências normativas
  // ----------------------------------------------------------

  const yFinal =
    Math.max(y1, y2);


  if (d.referencias) {

    const linhaY =
      Math.min(
        yFinal + 5,
        H - 29
      );

    doc.setDrawColor(
      DOURADO
    );

    doc.setLineWidth(
      0.35
    );

    doc.line(
      60,
      linhaY,
      W - 60,
      linhaY
    );


    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(8);

    doc.setTextColor(
      TINTA
    );

    doc.text(
      "REFERÊNCIAS NORMATIVAS",
      cx,
      linhaY + 5,
      { align: "center" }
    );


    doc.setFont(
      "helvetica",
      "italic"
    );

    doc.setFontSize(8);

    doc.setTextColor(
      CINZA
    );

    const referencias =
      doc.splitTextToSize(
        String(d.referencias),
        W - 80
      );

    let refY =
      linhaY + 10;

    referencias.forEach(
      linha => {

        doc.text(
          linha,
          cx,
          refY,
          { align: "center" }
        );

        refY += 4;

      }
    );

  }


  // ----------------------------------------------------------
  // Identificação do certificado
  // ----------------------------------------------------------

  if (d.nome) {

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(7.5);

    doc.setTextColor(
      CINZA2
    );

    doc.text(
      `Certificado emitido para: ${String(d.nome).toUpperCase()}`,
      cx,
      H - 20,
      { align: "center" }
    );

  }


  // ----------------------------------------------------------
  // Rodapé
  // ----------------------------------------------------------

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(7.5);

  doc.setTextColor(
    BRANCO
  );

  doc.text(
    "RICHARD Consultoria em Segurança do Trabalho",
    cx,
    H - 8.5,
    { align: "center" }
  );
}


// ============================================================
// EXPORTAÇÃO OPCIONAL
// ============================================================
//
// Mantém as funções principais disponíveis pelo módulo.
//
// ============================================================

export {
  frente,
  verso
};
