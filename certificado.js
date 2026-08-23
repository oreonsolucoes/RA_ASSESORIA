// ============================================================
// certificado.js  (v5 — PAISAGEM, estética de diploma)
// ============================================================

const VINHO   = "#7a0000";
const DOURADO = "#b8952e";
const CREME   = "#fdf8f0";
const TINTA   = "#1a1a2e";
const CINZA   = "#5a5a6a";
const PRETO   = "#111111";

const AP_PADRAO = {
  fontCorpo: 13, leading: 7.2,
  tamanhoTitulo: 38, tamanhoNome: 22,
  corBarra: "#7a0000", corRodape: "#7a0000",
  corNome: "#1a1a2e", corBorda: "#b8952e",
  yAssin: 148,
};

// ─── Carga de imagem ───────────────────────────────────────────────
export async function carregarImagemComoDataUrl(url) {
  if (!url) return null;
  return new Promise(resolve => {
    const img = new Image();
    const ehOutra = /^https?:\/\//i.test(url) && !url.startsWith(location.origin);
    if (ehOutra) img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const c = document.createElement("canvas");
        c.width = img.naturalWidth; c.height = img.naturalHeight;
        c.getContext("2d").drawImage(img, 0, 0);
        resolve(c.toDataURL("image/png"));
      } catch(e) { console.warn("CORS:", e); resolve(null); }
    };
    img.onerror = () => { console.warn("Falha:", url); resolve(null); };
    img.src = url;
  });
}

// ─── Geração ───────────────────────────────────────────────────────
export function gerarCertificado(dados) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();   // 297
  const H = doc.internal.pageSize.getHeight();  // 210

  frente(doc, W, H, dados);
  if ((dados.conteudoItens || []).length > 0) {
    doc.addPage();
    verso(doc, W, H, dados);
  }
  return doc;
}

// ─── Parágrafo justificado com negrito parcial ─────────────────────
function paraJust(doc, x, y, maxW, fs, lead, partes) {
  doc.setFontSize(fs);
  const tokens = [];
  partes.forEach(p => p.t.split(/(\s+)/).forEach(w => { if(w.length) tokens.push({w, b:p.b}); }));
  const esp    = () => { doc.setFont("helvetica","normal"); return doc.getTextWidth(" "); };
  const wTok   = t  => { doc.setFont("helvetica", t.b?"bold":"normal"); return doc.getTextWidth(t.w); };
  const linhas = []; let ln=[], wLn=0;
  tokens.forEach(t => {
    if(!t.w.trim()) return;
    const wt=wTok(t), add=(ln.length?esp():0)+wt;
    if(wLn+add>maxW && ln.length){ linhas.push(ln); ln=[t]; wLn=wt; }
    else { ln.push(t); wLn+=add; }
  });
  if(ln.length) linhas.push(ln);
  linhas.forEach((ln, idx) => {
    const last=idx===linhas.length-1;
    const soma=ln.reduce((s,t)=>s+wTok(t),0), nE=ln.length-1;
    let e=esp(); if(!last&&nE>0) e=(maxW-soma)/nE;
    let cx=x;
    ln.forEach((t,i)=>{ doc.setFont("helvetica",t.b?"bold":"normal"); doc.text(t.w,cx,y); cx+=wTok(t)+(i<nE?e:0); });
    y+=lead;
  });
  return y;
}

// Texto centralizado em caixa de largura fixa
function textoCentralizado(doc, texto, cx, y, maxW, fs, fonte="normal") {
  doc.setFontSize(fs); doc.setFont("helvetica", fonte);
  const linhas = doc.splitTextToSize(texto, maxW);
  linhas.forEach(l => { doc.text(l, cx, y, {align:"center"}); y += fs*0.42; });
  return y;
}

// ─── FRENTE ────────────────────────────────────────────────────────
function frente(doc, W, H, d) {
  const ap = { ...AP_PADRAO, ...(d.aparencia || {}) };
  const MX = 14; // margem lateral

  // ── Fundo levemente creme ──
  doc.setFillColor(CREME); doc.rect(0, 0, W, H, "F");

  // ── Moldura dupla elegante ──
  // Externa (dourada)
  doc.setDrawColor(ap.corBorda || DOURADO); doc.setLineWidth(2);
  doc.rect(6, 6, W-12, H-12);
  // Interna (fina)
  doc.setDrawColor(ap.corBorda || DOURADO); doc.setLineWidth(0.5);
  doc.rect(9.5, 9.5, W-19, H-19);

  // ── Barra vinho topo ──
  doc.setFillColor(ap.corBarra || VINHO);
  doc.rect(6, 6, W-12, 9, "F");

  // ── Barra vinho fundo ──
  doc.setFillColor(ap.corBarra || VINHO);
  doc.rect(6, H-15, W-12, 9, "F");

  // ── Logo (topo esquerdo, sobre a barra) ──
  if (d.logoDataUrl) {
    try { doc.addImage(d.logoDataUrl, "PNG", MX+2, 17, 50, 18); }
    catch(e) { console.warn("Logo:", e); }
  }

  // ── Selo (topo direito, sobre a barra) ──
  const seloSz = 28, seloX = W - MX - seloSz - 2, seloY = 15;
  if (d.seloDataUrl) {
    try { doc.addImage(d.seloDataUrl, "PNG", seloX, seloY, seloSz, seloSz); }
    catch(e) { desenharLosango(doc, d, seloX+seloSz/2, seloY+seloSz/2, 13, ap); }
  } else {
    desenharLosango(doc, d, seloX+seloSz/2, seloY+seloSz/2, 13, ap);
  }

  // ── Ornamentos de canto (linhas diagonais curtas douradas) ──
  const cor = ap.corBorda || DOURADO;
  doc.setDrawColor(cor); doc.setLineWidth(0.6);
  [[14,14,22,14],[14,14,14,22],[W-14,14,W-22,14],[W-14,14,W-14,22],
   [14,H-14,22,H-14],[14,H-14,14,H-22],[W-14,H-14,W-22,H-14],[W-14,H-14,W-14,H-22]
  ].forEach(([x1,y1,x2,y2])=>doc.line(x1,y1,x2,y2));

  // ── Título CERTIFICADO ──
  const cx = W / 2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(Number(ap.tamanhoTitulo) || 38);
  doc.setTextColor(TINTA);
  doc.text("C E R T I F I C A D O", cx, 36, {align:"center"});

  // Linha decorativa dourada sob o título
  doc.setDrawColor(cor); doc.setLineWidth(0.8);
  const lw = 90;
  doc.line(cx-lw, 39, cx-6, 39);
  doc.line(cx+6, 39, cx+lw, 39);
  // losango central
  doc.setFillColor(cor);
  const dm=2;
  doc.lines([[dm,dm],[dm,-dm],[-dm,-dm],[-dm,dm]], cx, 39-dm, [1,1], "F", true);

  // ── "Conferido a" ──
  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(CINZA);
  doc.text("Conferido a", cx, 47, {align:"center"});

  // ── Nome do participante ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(Number(ap.tamanhoNome) || 22);
  doc.setTextColor(ap.corNome || TINTA);
  doc.text((d.nome||"").toUpperCase(), cx, 57, {align:"center"});

  // Linha fina sob o nome
  doc.setDrawColor(cor); doc.setLineWidth(0.4);
  const nw = Math.min(doc.getTextWidth((d.nome||"").toUpperCase()) + 10, W-60);
  doc.line(cx-nw/2, 60, cx+nw/2, 60);

  // ── Corpo de texto justificado ──
  const bodyX = MX+10, bodyW = W - (MX+10)*2;
  const trechoCarga = d.cargaHoraria ? `, com carga horária de ${d.cargaHoraria}` : "";
  const temVerso = (d.conteudoItens||[]).length > 0;
  const partes = [
    { t: `Portador do CPF ${d.cpfFmt}, pela participação do `, b: false },
    { t: d.treinamentoNome, b: true },
    { t: ` no dia ${d.dataTreino}${trechoCarga}, pela Empresa Richard Consultoria em Segurança do Trabalho nas dependências da Empresa ${d.empresaRazao}${d.endereco?", localizada na "+d.endereco:""}${temVerso?", conforme conteúdo programático, vide verso:":"."}`, b: false },
  ];
  doc.setTextColor(PRETO);
  const yFim = paraJust(doc, bodyX, 68, bodyW,
    Number(ap.fontCorpo)||13, Number(ap.leading)||7.2, partes);

  // ── Assinaturas ──
  const yb = Math.max(Math.min(Number(ap.yAssin)||148, H-42), yFim+14);
  const linhaW = 72;

  // Participante — esquerda
  const xPart = MX + 20 + linhaW/2;
  doc.setDrawColor(CINZA); doc.setLineWidth(0.4);
  doc.line(xPart-linhaW/2, yb, xPart+linhaW/2, yb);
  doc.setFont("helvetica","bold"); doc.setFontSize(9.5); doc.setTextColor(TINTA);
  doc.text(d.nome||"", xPart, yb+5, {align:"center"});
  doc.setFont("helvetica","normal"); doc.setFontSize(8.5); doc.setTextColor(CINZA);
  doc.text("Participante", xPart, yb+10, {align:"center"});

  // Instrutor — direita (com assinatura sobre a linha)
  const xInstr = W - MX - 20 - linhaW/2;
  if (d.assinaturaInstrutorDataUrl) {
    try { doc.addImage(d.assinaturaInstrutorDataUrl, "PNG", xInstr-28, yb-18, 56, 16); }
    catch(e) { console.warn("Assinatura:", e); }
  }
  doc.setDrawColor(CINZA); doc.setLineWidth(0.4);
  doc.line(xInstr-linhaW/2, yb, xInstr+linhaW/2, yb);
  doc.setFont("helvetica","bold"); doc.setFontSize(9.5); doc.setTextColor(TINTA);
  doc.text("Elvio Richard Gonçalves", xInstr, yb+5, {align:"center"});
  doc.setFont("helvetica","normal"); doc.setFontSize(8.5); doc.setTextColor(CINZA);
  doc.text("Eng. Seg. Trab. / Instrutor", xInstr, yb+10, {align:"center"});
  doc.setFont("helvetica","italic"); doc.setFontSize(8); doc.setTextColor(CINZA);
  doc.text("CREA nº 5070103113", xInstr, yb+15, {align:"center"});

  // ── Rodapé (sobre barra vinho) ──
  doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor("#ffffff");
  doc.text("RICHARD Consultoria em Segurança do Trabalho   •   Rua Tiro ao Pombo, 402 - Freguesia do Ó - São Paulo - SP   •   Tel.: (11) 9 5826 5323",
    cx, H-9.5, {align:"center"});
}

function desenharLosango(doc, d, cx, cy, lado, ap) {
  doc.setFillColor("#f5c518"); doc.setDrawColor(PRETO); doc.setLineWidth(1.2);
  doc.lines([[lado,lado],[lado,-lado],[-lado,-lado],[-lado,lado]], cx, cy-lado, [1,1], "FD", true);
  doc.setTextColor(PRETO); doc.setFont("helvetica","bold"); doc.setFontSize(10);
  const sp=(d.selo||"NR").split(" ");
  doc.text(sp[0]||"NR", cx, cy-1.5, {align:"center"});
  doc.text(sp[1]||"",   cx, cy+4.5, {align:"center"});
}

// ─── VERSO ────────────────────────────────────────────────────────
function verso(doc, W, H, d) {
  const MX = 14;
  const cx = W/2;
  const cor = DOURADO;

  // Fundo creme
  doc.setFillColor(CREME); doc.rect(0, 0, W, H, "F");

  // Moldura dupla
  doc.setDrawColor(cor); doc.setLineWidth(2);   doc.rect(6, 6, W-12, H-12);
  doc.setDrawColor(cor); doc.setLineWidth(0.5); doc.rect(9.5, 9.5, W-19, H-19);

  // Barra topo + fundo
  doc.setFillColor(VINHO);
  doc.rect(6, 6, W-12, 9, "F");
  doc.rect(6, H-15, W-12, 9, "F");

  // Ornamentos de canto
  doc.setDrawColor(cor); doc.setLineWidth(0.6);
  [[14,14,22,14],[14,14,14,22],[W-14,14,W-22,14],[W-14,14,W-14,22],
   [14,H-14,22,H-14],[14,H-14,14,H-22],[W-14,H-14,W-22,H-14],[W-14,H-14,W-14,H-22]
  ].forEach(([x1,y1,x2,y2])=>doc.line(x1,y1,x2,y2));

  // Título centralizado
  doc.setFont("helvetica","bold"); doc.setFontSize(22);
  doc.setTextColor(TINTA);
  doc.text("Conteúdo Programático", cx, 30, {align:"center"});

  // Linha decorativa
  doc.setDrawColor(cor); doc.setLineWidth(0.8);
  doc.line(cx-70, 33, cx-5, 33);
  doc.line(cx+5, 33, cx+70, 33);
  const dm=1.8;
  doc.setFillColor(cor);
  doc.lines([[dm,dm],[dm,-dm],[-dm,-dm],[-dm,dm]], cx, 33-dm, [1,1], "F", true);

  // Itens em duas colunas se muitos, senão coluna única centralizada
  const itens = d.conteudoItens || [];
  const colunas = itens.length > 6 ? 2 : 1;
  const colW = colunas === 2 ? (W - MX*2 - 20)/2 : W - MX*2 - 20;
  const col1X = colunas === 2 ? MX+12 : MX+12;
  const col2X = col1X + colW + 20;

  let y1 = 42, y2 = 42;
  const meio = Math.ceil(itens.length/2);

  doc.setFontSize(11.5); doc.setFont("helvetica","normal"); doc.setTextColor(PRETO);

  itens.forEach((it, i) => {
    const isCol2 = colunas === 2 && i >= meio;
    const xB = isCol2 ? col2X : col1X;
    const xT = xB + 6;
    const y  = isCol2 ? y2 : y1;
    const wT = isCol2 ? colW-6 : (colunas===1 ? colW-6 : colW-6);

    // Bullet dourado
    doc.setFillColor(DOURADO); doc.setDrawColor(DOURADO); doc.setLineWidth(0.2);
    doc.circle(xB+1.2, y-1.5, 1.2, "F");

    doc.setTextColor(PRETO);
    const linhas = doc.splitTextToSize(it, wT);
    doc.text(linhas, xT, y);
    const delta = 6.5 * linhas.length + 1.5;
    if (isCol2) y2 += delta; else y1 += delta;
  });

  // Referências
  const yRef = Math.max(y1, y2) + 4;
  if (d.referencias) {
    doc.setFont("helvetica","italic"); doc.setFontSize(10); doc.setTextColor(CINZA);
    doc.text(`Referências Normativas: ${d.referencias}`, cx, yRef, {align:"center"});
  }

  // Rodapé
  doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor("#ffffff");
  doc.text("RICHARD Consultoria em Segurança do Trabalho", cx, H-9.5, {align:"center"});
}
