/**
 * Módulo de geração de certificados em PDF via jsPDF (Browser-side)
 * Richard Assessoria — Gestão de Segurança do Trabalho
 */

// Constantes de Cores (RGB Hexadecimal)
const CORES = {
  VINHO: "#720000",
  VINHO_ESC: "#4F0000",
  MAGENTA: "#9B1B4B",
  DOURADO: "#B8943D",
  DOURADO_CL: "#D7BE72",
  CREME: "#FBF7EE",
  TINTA: "#20202A",
  CINZA: "#686875",
  BRANCO: "#FFFFFF"
};

/**
 * Converte URLs de imagens locais/remotas para Data URL (Base64)
 * @param {string} url 
 * @returns {Promise<string>}
 */
export async function carregarImagemComoDataUrl(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = (err) => reject(err);
    img.src = url;
  });
}

/**
 * Gera o certificado em PDF (A4 Paisagem, 2 páginas)
 * @param {Object} dados - Estrutura com dados do certificado
 */
export function gerarCertificado(dados = {}) {
  const { window } = globalThis;
  const jsPDF = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;

  if (!jsPDF) {
    console.error("jsPDF não foi encontrado no escopo global.");
    return;
  }

  // Instância A4 Paisagem (297mm x 210mm)
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4"
  });

  const LARGURA = 297;
  const ALTURA = 210;

  // --- FUNÇÕES DE SUPORTE GRÁFICO ---
  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.replace("#", ""), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255
    };
  };

  const setCorPreenchimento = (hex) => {
    const { r, g, b } = hexToRgb(hex);
    doc.setFillColor(r, g, b);
  };

  const setCorLembranca = (hex) => {
    const { r, g, b } = hexToRgb(hex);
    doc.setDrawColor(r, g, b);
  };

  const setCorTexto = (hex) => {
    const { r, g, b } = hexToRgb(hex);
    doc.setTextColor(r, g, b);
  };

  // Desenha os polígonos geométricos na lateral esquerda
  const desenharFormasGeometricas = () => {
    // Camada 1: Vinho Escuro (Fundo base da geometria)
    setCorPreenchimento(CORES.VINHO_ESC);
    doc.triangle(0, 0, 125, 0, 0, 210, "F");
    doc.triangle(0, 210, 125, 0, 110, 210, "F");

    // Camada 2: Faixa Dourada Superior
    setCorPreenchimento(CORES.DOURADO);
    doc.triangle(0, 0, 130, 0, 0, 75, "F");

    // Camada 3: Magenta Intermediário
    setCorPreenchimento(CORES.MAGENTA);
    doc.triangle(0, 25, 115, 0, 0, 155, "F");

    // Camada 4: Vinho Principal
    setCorPreenchimento(CORES.VINHO);
    doc.triangle(0, 85, 105, 0, 0, 210, "F");

    // Camada 5: Faixa Dourada Inferior Diagonal
    setCorPreenchimento(CORES.DOURADO_CL);
    doc.triangle(0, 140, 95, 210, 0, 210, "F");

    // Camada 6: Recorte Inferior Vinho
    setCorPreenchimento(CORES.VINHO_ESC);
    doc.triangle(0, 165, 75, 210, 0, 210, "F");
  };

  const desenharEstruturaPagina = () => {
    // Fundo Creme
    setCorPreenchimento(CORES.CREME);
    doc.rect(0, 0, LARGURA, ALTURA, "F");

    // Formas Laterais
    desenharFormasGeometricas();

    // Moldura Dupla Dourada
    setCorLembranca(CORES.DOURADO);
    doc.setLineWidth(0.88); // ~2.5px
    doc.rect(7, 7, LARGURA - 14, ALTURA - 14, "D");
    doc.setLineWidth(0.21); // ~0.6px
    doc.rect(9.5, 9.5, LARGURA - 19, ALTURA - 19, "D");

    // Barra Vinho no Topo (8px / ~2.8mm)
    setCorPreenchimento(CORES.VINHO);
    doc.rect(0, 0, LARGURA, 2.8, "F");

    // Barra Vinho no Rodapé (28px / ~10mm)
    doc.rect(0, ALTURA - 10, LARGURA, 10, "F");

    // Texto do Rodapé
    setCorTexto(CORES.BRANCO);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const enderecoTexto = dados.endereco || "Richard Assessoria em Segurança do Trabalho — Contato e Atendimento";
    doc.text(enderecoTexto, LARGURA / 2, ALTURA - 3.8, { align: "center" });
  };

  const desenharLinhaOrnamental = (y) => {
    const cx = 195; // Centro da área útil do certificado (lado direito)
    setCorLembranca(CORES.DOURADO);
    doc.setLineWidth(0.3);
    doc.line(cx - 45, y, cx + 45, y);

    // Losango Central
    setCorPreenchimento(CORES.DOURADO);
    doc.saveGraphicsState();
    doc.setGState(new doc.GState({ opacity: 1 }));
    
    // Desenha o losango
    const size = 1.8;
    doc.triangle(cx, y - size, cx - size, y, cx + size, y, "F");
    doc.triangle(cx, y + size, cx - size, y, cx + size, y, "F");
    doc.restoreGraphicsState();
  };

  // ==========================================
  // PÁGINA 1: FRENTE (CERTIFICADO)
  // ==========================================
  desenharEstruturaPagina();

  // Logo da Empresa (Topo Esquerdo)
  if (dados.logoDataUrl) {
    try {
      doc.addImage(dados.logoDataUrl, "PNG", 15, 15, 38, 20, undefined, "FAST");
    } catch (e) {
      console.warn("Erro ao renderizar logo:", e);
    }
  }

  // Selo da NR (Topo Direito)
  if (dados.seloDataUrl) {
    try {
      doc.addImage(dados.seloDataUrl, "PNG", LARGURA - 33, 14, 18, 18, undefined, "FAST");
    } catch (e) {
      console.warn("Erro ao renderizar selo:", e);
    }
  }

  // Título: CERTIFICADO
  setCorTexto(CORES.TINTA);
  doc.setFont("times", "bold");
  doc.setFontSize(30);
  doc.text("C E R T I F I C A D O", 195, 35, { align: "center" });

  // Linha Ornamental abaixo do Título
  desenharLinhaOrnamental(40);

  // Subtítulo: DE CAPACITAÇÃO PROFISSIONAL
  setCorTexto(CORES.CINZA);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("DE CAPACITAÇÃO PROFISSIONAL", 195, 46, { align: "center" });

  // "Este certificado é conferido a"
  doc.setFont("times", "italic");
  doc.setFontSize(11);
  doc.text("Este certificado é conferido a", 195, 57, { align: "center" });

  // NOME DO PARTICIPANTE (Ajuste dinâmico de fonte)
  setCorTexto(CORES.VINHO);
  doc.setFont("times", "bolditalic");
  let tamanhoFonteNome = 24;
  const nome = (dados.nome || "NOME DO PARTICIPANTE").toUpperCase();
  
  doc.setFontSize(tamanhoFonteNome);
  while (doc.getTextWidth(nome) > 130 && tamanhoFonteNome > 13) {
    tamanhoFonteNome -= 1;
    doc.setFontSize(tamanhoFonteNome);
  }
  doc.text(nome, 195, 70, { align: "center" });

  // Linha fina sob o nome
  setCorLembranca(CORES.DOURADO);
  doc.setLineWidth(0.2);
  doc.line(135, 74, 255, 74);

  // Metadados (CPF, Data, Carga Horária)
  setCorTexto(CORES.CINZA);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  const infoLinha = [
    dados.cpfFmt ? `CPF: ${dados.cpfFmt}` : null,
    dados.dataTreino ? `Data: ${dados.dataTreino}` : null,
    dados.cargaHoraria ? `Carga Horária: ${dados.cargaHoraria}` : null
  ].filter(Boolean).join("   •   ");

  doc.text(infoLinha, 195, 82, { align: "center" });

  // "pela participação e conclusão do curso"
  doc.setFont("times", "italic");
  doc.setFontSize(11);
  doc.text("pela participação e conclusão do curso de capacitação em", 195, 93, { align: "center" });

  // Nome do Treinamento
  setCorTexto(CORES.TINTA);
  doc.setFont("times", "bold");
  let tamanhoFonteTreino = 15;
  const treinoNome = dados.treinamentoNome || "Treinamento em Segurança do Trabalho";
  
  doc.setFontSize(tamanhoFonteTreino);
  while (doc.getTextWidth(treinoNome) > 135 && tamanhoFonteTreino > 10) {
    tamanhoFonteTreino -= 0.5;
    doc.setFontSize(tamanhoFonteTreino);
  }
  doc.text(treinoNome, 195, 103, { align: "center" });

  // Texto Institucional (Justificado)
  setCorTexto(CORES.CINZA);
  doc.setFont("times", "italic");
  doc.setFontSize(10.5);
  const textoInstitucional = `Certificamos, para os devidos fins, que o profissional concluiu com aproveitamento a capacitação, estando apto a exercer as atividades referentes à norma, atendendo rigorosamente às exigências da Legislação de Segurança do Trabalho vigente.`;
  
  const linhasTexto = doc.splitTextToSize(textoInstitucional, 130);
  doc.text(linhasTexto, 195, 115, { align: "center", maxWidth: 130 });

  // Seção de Assinaturas (Linhas e Imagem)
  const yAssinatura = 162;
  setCorLembranca(CORES.CINZA);
  doc.setLineWidth(0.25);

  // Assinatura 1: Participante (Esquerda)
  doc.line(130, yAssinatura, 185, yAssinatura);
  setCorTexto(CORES.TINTA);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text(dados.nome || "Participante", 157.5, yAssinatura + 4, { align: "center" });
  setCorTexto(CORES.CINZA);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("Assinatura do Aluno", 157.5, yAssinatura + 8, { align: "center" });

  // Assinatura 2: Instrutor (Direita)
  if (dados.assinaturaInstrutorDataUrl) {
    try {
      doc.addImage(dados.assinaturaInstrutorDataUrl, "PNG", 212, yAssinatura - 14, 35, 13, undefined, "FAST");
    } catch (e) {
      console.warn("Erro ao renderizar assinatura:", e);
    }
  }

  doc.line(205, yAssinatura, 260, yAssinatura);
  setCorTexto(CORES.TINTA);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("Instrutor Responsável", 232.5, yAssinatura + 4, { align: "center" });
  setCorTexto(CORES.CINZA);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("Profissional Habilitado", 232.5, yAssinatura + 8, { align: "center" });

  // QR Code (Se existir)
  if (dados.qrCodeDataUrl) {
    try {
      doc.addImage(dados.qrCodeDataUrl, "PNG", LARGURA - 28, ALTURA - 32, 18, 18, undefined, "FAST");
    } catch (e) {
      console.warn("Erro ao renderizar QR Code:", e);
    }
  }

  // ==========================================
  // PÁGINA 2: VERSO (CONTEÚDO PROGRAMÁTICO)
  // ==========================================
  const itens = Array.isArray(dados.conteudoItens) ? dados.conteudoItens : [];

  if (itens.length > 0) {
    doc.addPage("a4", "landscape");

    // Reutiliza estrutura do verso
    desenharEstruturaPagina();

    // Cabeçalho da Empresa no Verso
    setCorPreenchimento(CORES.VINHO);
    doc.rect(15, 14, LARGURA - 30, 8, "F");
    setCorTexto(CORES.DOURADO_CL);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text((dados.empresaRazao || "RICHARD CONSULTORIA EM SEGURANÇA DO TRABALHO").toUpperCase(), LARGURA / 2, 19.3, { align: "center" });

    // Título do Verso
    setCorTexto(CORES.TINTA);
    doc.setFont("times", "bold");
    doc.setFontSize(20);
    doc.text("CONTEÚDO PROGRAMÁTICO", LARGURA / 2, 35, { align: "center" });

    desenharLinhaOrnamental(39);

    // Nome do Treinamento no Verso
    setCorTexto(CORES.CINZA);
    doc.setFont("times", "italic");
    doc.setFontSize(11);
    doc.text(treinoNome, LARGURA / 2, 46, { align: "center" });

    // Renderização dos Itens (1 ou 2 Colunas)
    const yInicio = 58;
    const yLimite = 160;
    const alturaDisponivel = yLimite - yInicio;

    setCorTexto(CORES.TINTA);
    doc.setFont("times", "normal");
    doc.setFontSize(11);

    if (itens.length <= 6) {
      // Layout de 1 Coluna Centralizada
      const espacamento = Math.min(15, alturaDisponivel / (itens.length + 1));
      
      itens.forEach((item, index) => {
        const yPos = yInicio + (index * espacamento) + 5;
        
        // Bullet Dourado
        setCorPreenchimento(CORES.DOURADO);
        doc.circle(75, yPos - 1.2, 1.2, "F");

        // Texto do Item
        doc.text(item, 80, yPos, { maxWidth: 140 });
      });
    } else {
      // Layout de 2 Colunas Equilibradas
      const metade = Math.ceil(itens.length / 2);
      const col1 = itens.slice(0, metade);
      const col2 = itens.slice(metade);

      const espacamento1 = Math.min(12, alturaDisponivel / (col1.length + 1));
      const espacamento2 = Math.min(12, alturaDisponivel / (col2.length + 1));

      // Coluna 1 (Esquerda)
      col1.forEach((item, index) => {
        const yPos = yInicio + (index * espacamento1) + 5;
        setCorPreenchimento(CORES.DOURADO);
        doc.circle(35, yPos - 1.2, 1.2, "F");
        doc.text(item, 40, yPos, { maxWidth: 100 });
      });

      // Coluna 2 (Direita)
      col2.forEach((item, index) => {
        const yPos = yInicio + (index * espacamento2) + 5;
        setCorPreenchimento(CORES.DOURADO);
        doc.circle(155, yPos - 1.2, 1.2, "F");
        doc.text(item, 160, yPos, { maxWidth: 100 });
      });
    }

    // Seção de Referências Normativas
    if (dados.referencias) {
      const yRef = 175;
      setCorTexto(CORES.DOURADO);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.text("REFERÊNCIAS NORMATIVAS", LARGURA / 2, yRef, { align: "center" });

      setCorTexto(CORES.CINZA);
      doc.setFont("times", "italic");
      doc.setFontSize(9.5);
      doc.text(dados.referencias, LARGURA / 2, yRef + 5, { align: "center" });
    }
  }

  // Finalização e Download do Arquivo
  const nomeArquivo = dados.numeroCertificado 
    ? `Certificado_${dados.numeroCertificado}.pdf` 
    : "Certificado.pdf";

  doc.save(nomeArquivo);
}
