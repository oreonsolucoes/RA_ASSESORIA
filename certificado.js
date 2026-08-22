// ============================================================
// certificado.js  (v2 — RETRATO, fiel ao modelo NR-12)
// Gera o PDF do certificado no navegador com jsPDF.
// jsPDF é carregado via CDN na página que usa este módulo.
//
// dados = {
//   nome, cpfFmt, treinamentoNome, dataTreino (dd/mm/aaaa),
//   cargaHoraria, empresaRazao, endereco, selo, conteudoItens[],
//   referencias, assinaturaInstrutorDataUrl (PNG base64 | null)
// }
// ============================================================

const VINHO = "#8b0000";
const AMARELO = "#f5c518";
const TINTA = "#12233f";
const PRETO = "#111111";

// Carrega imagem de URL (raw do GitHub) e devolve dataURL PNG p/ o jsPDF.
// Precisa de CORS liberado na origem (o raw.githubusercontent.com libera).
export async function carregarImagemComoDataUrl(url) {
  if (!url) return null;
  return new Promise((resolve) => {
    const img = new Image();
    // Só pede modo CORS quando a imagem vem de OUTRO domínio (ex.: raw do GitHub).
    // Para arquivo na mesma pasta do site (mesma origem), CORS não é necessário
    // e definir crossOrigin poderia atrapalhar em alguns navegadores.
    const ehOutraOrigem = /^https?:\/\//i.test(url) &&
      !url.startsWith(location.origin);
    if (ehOutraOrigem) img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
        canvas.getContext("2d").drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch (e) { console.warn("Falha ao processar assinatura (CORS?).", e); resolve(null); }
    };
    img.onerror = () => { console.warn("Falha ao carregar assinatura:", url); resolve(null); };
    img.src = url;
  });
}

export function gerarCertificado(dados) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();   // 210
  const H = doc.internal.pageSize.getHeight();  // 297

  frente(doc, W, H, dados);
  doc.addPage();
  verso(doc, W, H, dados);
  return doc;
}

// Desenha um parágrafo justificado que pode ter UM trecho em negrito
// (o nome do treinamento). Retorna o Y final.
function paragrafoJustificado(doc, x, y, larguraMax, fontSize, leading, partes) {
  // partes = [{t: "texto", b: true/false}, ...]
  doc.setFontSize(fontSize);
  // quebra tudo em "tokens" preservando o estado de negrito
  const tokens = [];
  partes.forEach((p) => {
    p.t.split(/(\s+)/).forEach((w) => { if (w.length) tokens.push({ w, b: p.b }); });
  });

  let linha = [];
  let larguraLinha = 0;
  const espaco = () => { doc.setFont("helvetica", "normal"); return doc.getTextWidth(" "); };

  const larguraTok = (tok) => { doc.setFont("helvetica", tok.b ? "bold" : "normal"); return doc.getTextWidth(tok.w); };

  const linhas = [];
  tokens.forEach((tok) => {
    if (tok.w.trim() === "") return; // ignoramos espaços "brutos", recompomos depois
    const wTok = larguraTok(tok);
    const add = (linha.length ? espaco() : 0) + wTok;
    if (larguraLinha + add > larguraMax && linha.length) {
      linhas.push(linha); linha = [tok]; larguraLinha = wTok;
    } else {
      linha.push(tok); larguraLinha += add;
    }
  });
  if (linha.length) linhas.push(linha);

  // desenha cada linha; justifica todas menos a última
  linhas.forEach((ln, idx) => {
    const ehUltima = idx === linhas.length - 1;
    const somaPalavras = ln.reduce((s, t) => s + larguraTok(t), 0);
    const nEspacos = ln.length - 1;
    let larguraEspaco = espaco();
    if (!ehUltima && nEspacos > 0) {
      larguraEspaco = (larguraMax - somaPalavras) / nEspacos;
    }
    let cx = x;
    ln.forEach((t, i) => {
      doc.setFont("helvetica", t.b ? "bold" : "normal");
      doc.text(t.w, cx, y);
      cx += larguraTok(t) + (i < nEspacos ? larguraEspaco : 0);
    });
    y += leading;
  });
  return y;
}

function frente(doc, W, H, d) {
  // Moldura externa
  doc.setDrawColor("#cccccc"); doc.setLineWidth(0.6);
  doc.rect(8, 8, W - 16, H - 16);

  // Barra vinho superior (deixa espaço à direita p/ o selo)
  doc.setFillColor(VINHO); doc.rect(20, 24, W - 74, 7, "F");

  // Logo da empresa (topo esquerdo) — opcional
  if (d.logoDataUrl) {
    try {
      // caixa ~32x16mm no canto superior esquerdo, acima do título
      doc.addImage(d.logoDataUrl, "PNG", 22, 38, 34, 16);
    } catch (e) { console.warn("Logo:", e); }
  }

  // Selo losango amarelo
  const cx = W - 34, cy = 38;
  const lado = 12.5;
  // desenha losango como polígono
  doc.setFillColor(AMARELO); doc.setDrawColor(PRETO); doc.setLineWidth(1.2);
  doc.lines(
    [[lado, lado], [lado, -lado], [-lado, -lado], [-lado, lado]],
    cx, cy - lado, [1, 1], "FD", true
  );
  doc.setTextColor(PRETO); doc.setFont("helvetica", "bold"); doc.setFontSize(13);
  const sp = (d.selo || "NR").split(" ");
  doc.text(sp[0] || "NR", cx, cy - 1, { align: "center" });
  doc.text(sp[1] || "", cx, cy + 6, { align: "center" });

  // Título
  doc.setTextColor(PRETO); doc.setFont("helvetica", "bold"); doc.setFontSize(28);
  doc.text("C E R T I F I C A D O", W / 2, 52, { align: "center" });
  doc.setFontSize(16);
  doc.text("Conferido a", W / 2, 62, { align: "center" });

  // Nome
  doc.setFontSize(18);
  doc.text((d.nome || "").toUpperCase(), W / 2, 78, { align: "center" });

  // Corpo justificado com negrito no nome do treinamento.
  // A frase de carga horária só aparece quando há carga (NR-01 não tem).
  const trechoCarga = d.cargaHoraria ? `, com carga horária de ${d.cargaHoraria}` : "";
  const partes = [
    { t: `Portador do CPF ${d.cpfFmt}, pela participação do `, b: false },
    { t: `${d.treinamentoNome}`, b: true },
    { t: ` no dia ${d.dataTreino}${trechoCarga}, pela Empresa Richard ` +
         `Consultoria em Segurança do Trabalho nas dependências da Empresa ${d.empresaRazao}` +
         `${d.endereco ? ", localizada na " + d.endereco : ""}, conforme conteúdo programático, vide verso:`, b: false },
  ];
  doc.setTextColor(PRETO);
  const yFimTexto = paragrafoJustificado(doc, 25, 95, W - 50, 13.5, 7, partes);

  // Assinaturas — logo abaixo do texto, reduzindo o vão do meio
  const yb = Math.min(yFimTexto + 34, 170);
  doc.setDrawColor(PRETO); doc.setLineWidth(0.4);
  if (d.assinaturaInstrutorDataUrl) {
    try { doc.addImage(d.assinaturaInstrutorDataUrl, "PNG", 40, yb - 20, 45, 17); }
    catch (e) { console.warn("Assinatura:", e); }
  }
  doc.line(30, yb, 95, yb);
  doc.line(W - 95, yb, W - 30, yb);
  doc.setFont("helvetica", "bold"); doc.setFontSize(10);
  doc.text("Elvio Richard Gonçalves", 62.5, yb + 5, { align: "center" });
  doc.setFont("helvetica", "normal"); doc.setFontSize(7.5);
  doc.text("ENG. SEGURANÇA DO TRABALHO", 62.5, yb + 9, { align: "center" });
  doc.text("CREA nº 5070103113  -  INSTRUTOR", 62.5, yb + 12.5, { align: "center" });
  doc.setFont("helvetica", "bold"); doc.setFontSize(10);
  doc.text(d.nome || "", W - 62.5, yb + 5, { align: "center" });
  doc.setFont("helvetica", "normal"); doc.setFontSize(8);
  doc.text("Participante", W - 62.5, yb + 9, { align: "center" });

  // Rodapé
  doc.setDrawColor(VINHO); doc.setLineWidth(1); doc.line(20, H - 40, W - 20, H - 40);
  doc.setTextColor(VINHO); doc.setFont("helvetica", "normal"); doc.setFontSize(9);
  doc.text("RICHARD Consultoria em Segurança do Trabalho", W / 2, H - 34, { align: "center" });
  doc.setFontSize(7.5);
  doc.text("Rua Tiro ao Pombo, 402 - Freguesia do Ó - São Paulo - SP", W / 2, H - 30, { align: "center" });
  doc.text("Tel.: (11) 9 5826 5323", W / 2, H - 26.5, { align: "center" });
}

function verso(doc, W, H, d) {
  doc.setDrawColor("#cccccc"); doc.setLineWidth(0.6); doc.rect(8, 8, W - 16, H - 16);
  doc.setFillColor(VINHO); doc.rect(20, 22, W - 40, 8, "F");
  doc.setTextColor(TINTA); doc.setFont("helvetica", "bold"); doc.setFontSize(22);
  doc.text("Conteúdo Programático", W / 2, 48, { align: "center" });

  const itens = d.conteudoItens || [];
  doc.setFontSize(12.5); doc.setFont("helvetica", "normal");
  let y = 68;
  itens.forEach((it) => {
    doc.setFillColor(AMARELO); doc.setDrawColor(PRETO); doc.setLineWidth(0.3);
    doc.circle(28, y - 1.3, 1.4, "FD");
    doc.setTextColor(PRETO);
    const linhas = doc.splitTextToSize(it, W - 58);
    doc.text(linhas, 34, y);
    y += 8 + (linhas.length - 1) * 6;
  });
  if (d.referencias) {
    doc.setTextColor(TINTA); doc.setFont("helvetica", "italic"); doc.setFontSize(10.5);
    doc.text(`Referências Normativas: ${d.referencias}`, 28, y + 3);
  }

  // rodapé simples no verso
  doc.setDrawColor(VINHO); doc.setLineWidth(1); doc.line(20, H - 30, W - 20, H - 30);
  doc.setTextColor(VINHO); doc.setFont("helvetica", "normal"); doc.setFontSize(8);
  doc.text("RICHARD Consultoria em Segurança do Trabalho", W / 2, H - 24, { align: "center" });
}
