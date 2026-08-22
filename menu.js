// ============================================================
// menu.js
// Monta os itens do menu lateral. Centralizado para que
// adicionar/renomear uma página seja feito num lugar só.
// Chame montarMenu("<id da página ativa>").
// ============================================================

const ITENS = [
  { id: "dashboard",    href: "dashboard.html",    rotulo: "Painel",
    icone: '<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>' },
  { id: "pipeline",     href: "pipeline.html",     rotulo: "Acompanhamento",
    icone: '<line x1="3" y1="6" x2="3" y2="20"/><line x1="9" y1="6" x2="9" y2="14"/><line x1="15" y1="6" x2="15" y2="18"/><line x1="21" y1="6" x2="21" y2="11"/><circle cx="3" cy="4" r="1.5"/><circle cx="9" cy="4" r="1.5"/><circle cx="15" cy="4" r="1.5"/><circle cx="21" cy="4" r="1.5"/>' },
  { id: "cadastro",     href: "cadastro.html",     rotulo: "Novo registro",
    icone: '<path d="M12 5v14M5 12h14"/>' },
  { id: "emitir",       href: "emitir.html",       rotulo: "Emitir certificado",
    icone: '<path d="M9 12l2 2 4-4"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 5c0 1.66 4 3 9 3s9-1.34 9-3-4-3-9-3-9 1.34-9 3"/>' },
  { id: "importar",     href: "importar.html",     rotulo: "Importar em lote",
    icone: '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>' },
  { id: "empresas",     href: "empresas.html",     rotulo: "Empresas",
    icone: '<path d="M3 21h18M6 21V7l6-4 6 4v14M10 9h.01M14 9h.01M10 13h.01M14 13h.01M10 17h.01M14 17h.01"/>' },
  { id: "funcionarios", href: "funcionarios.html", rotulo: "Funcionários",
    icone: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>' },
  { id: "equipamentos", href: "equipamentos.html", rotulo: "Equipamentos",
    icone: '<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>' },
  { id: "financeiro",   href: "financeiro.html",   rotulo: "Módulo Financeiro", destaque: true,
    icone: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>' },
  { id: "configuracoes", href: "configuracoes.html", rotulo: "Configurações",
    icone: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>' },
];

export function montarMenu(ativo) {
  const nav = document.getElementById("nav");
  if (!nav) return;
  nav.innerHTML = ITENS.map((it) => `
    <a href="${it.href}" class="${it.id === ativo ? "ativo" : ""}${it.destaque ? " item-destaque" : ""}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${it.icone}</svg>
      ${it.rotulo}
    </a>`).join("");
}
