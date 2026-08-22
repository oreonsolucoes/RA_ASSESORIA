// ============================================================
// config-empresa.js
// Configurações que VOCÊ edita à mão. Um lugar só.
// ============================================================

// URL da assinatura do instrutor (Elvio Richard), usada nos certificados.
//
// DUAS FORMAS de apontar:
//
// (A) Arquivo na MESMA PASTA do site (mais simples, recomendado):
//     Coloque "assinatura.png" junto dos outros arquivos e use só o nome:
//         export const ASSINATURA_INSTRUTOR_URL = "assinatura.png";
//     Vantagem: mesma origem, sem complicação de CORS.
//
// (B) Link RAW de um repositório público no GitHub:
//         export const ASSINATURA_INSTRUTOR_URL =
//           "https://raw.githubusercontent.com/usuario/repo/main/assinatura.png";
//     (precisa ser o link "raw", não a página do arquivo, e repo público)
//
// Enquanto estiver "" (vazio), a opção "usar assinatura" fica indisponível
// e só o modo "deixar em branco (Gov.br)" aparece.
export const ASSINATURA_INSTRUTOR_URL = "assinatura.png";

// (Opcional) Logo da Richard Assessoria — mesma lógica (arquivo local ou raw).
// Deixe "" para manter o selo "RA" atual.
export const LOGO_URL = "";

// Opções de "dados de pagamento" que aparecem no menu suspenso do
// relatório de medição. Edite/adicione conforme suas contas.
export const DADOS_PAGAMENTO = [
  "PIX: 07.014.529/0001-03 (CNPJ) — Richard Assessoria",
  "Banco do Brasil — Ag. 0000-0 / C/C 00000-0",
  "Transferência/PIX — consultar contato",
  "Boleto bancário",
  "Dinheiro / à vista",
];
