// ============================================================
// alerta-vencimento.js
// Pop-up persistente de vencimentos. Importado por qualquer página.
// Mostra um aviso fixo no rodapé quando há certificados vencidos
// ou vencendo em <=30 dias. Substitui as notificações automáticas
// (que exigiriam servidor) por um alerta visual sempre presente.
//
// Uso na página:
//   import { iniciarAlertaVencimento } from "./alerta-vencimento.js";
//   iniciarAlertaVencimento(db);   // db = Firestore já inicializado
// ============================================================

import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const CSS = `
.alerta-venc-flut {
  position: fixed; bottom: 18px; right: 18px; z-index: 900;
  background: #fff; border: 1px solid var(--borda, #e3e6ec);
  border-left: 5px solid #c0392b; border-radius: 12px;
  box-shadow: 0 8px 30px rgba(18,35,63,.18);
  padding: 14px 16px; max-width: 320px;
  font-family: 'Inter', system-ui, sans-serif;
  animation: avSlide .3s ease;
}
@keyframes avSlide { from { transform: translateY(12px); opacity: 0; } to { transform: none; opacity: 1; } }
.alerta-venc-flut.oculto { display: none; }
.alerta-venc-flut .av-topo { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
.alerta-venc-flut .av-tit { font-weight:700; font-size:.9rem; color:#12233f; display:flex; align-items:center; gap:7px; }
.alerta-venc-flut .av-tit .pt { width:9px; height:9px; border-radius:50%; background:#c0392b; }
.alerta-venc-flut .av-fechar { border:0; background:transparent; cursor:pointer; color:#8a94a6; font-size:1.1rem; line-height:1; padding:2px 4px; }
.alerta-venc-flut .av-linha { font-size:.83rem; color:#4a5262; margin:3px 0; }
.alerta-venc-flut .av-linha b { color:#c0392b; }
.alerta-venc-flut .av-acao { display:inline-block; margin-top:10px; font-size:.82rem; font-weight:600; color:#12233f; text-decoration:none; background:#eef1f6; padding:7px 12px; border-radius:7px; }
.alerta-venc-flut .av-acao:hover { background:#e2e7f0; }
`;

function diasAte(data) {
  const hoje = new Date(); hoje.setHours(0,0,0,0);
  return Math.ceil((data - hoje) / 86400000);
}

export async function iniciarAlertaVencimento(db) {
  // injeta CSS uma vez
  if (!document.getElementById("av-css")) {
    const st = document.createElement("style");
    st.id = "av-css"; st.textContent = CSS;
    document.head.appendChild(st);
  }

  try {
    const snap = await getDocs(collection(db, "documentos"));
    let vencidos = 0, vencendo = 0;
    snap.forEach(d => {
      const x = d.data();
      if (x.renovado) return;
      const venc = x.dataVencimento?.toDate?.() ?? new Date(x.dataVencimento);
      const dias = diasAte(venc);
      if (dias < 0) vencidos++;
      else if (dias <= 30) vencendo++;
    });

    if (vencidos === 0 && vencendo === 0) return; // nada a alertar

    // se o usuário fechou nesta sessão, respeita
    if (sessionStorage.getItem("av-fechado") === "1") return;

    const box = document.createElement("div");
    box.className = "alerta-venc-flut";
    box.innerHTML = `
      <div class="av-topo">
        <div class="av-tit"><span class="pt"></span>Atenção aos vencimentos</div>
        <button class="av-fechar" title="Fechar">×</button>
      </div>
      ${vencidos ? `<div class="av-linha"><b>${vencidos}</b> certificado(s) já vencido(s)</div>` : ""}
      ${vencendo ? `<div class="av-linha"><b>${vencendo}</b> vencem em até 30 dias</div>` : ""}
      <a class="av-acao" href="pipeline.html">Abrir acompanhamento →</a>
    `;
    document.body.appendChild(box);
    box.querySelector(".av-fechar").addEventListener("click", () => {
      box.classList.add("oculto");
      sessionStorage.setItem("av-fechado", "1");
    });
  } catch (e) {
    console.warn("Alerta de vencimento não pôde carregar:", e);
  }
}
