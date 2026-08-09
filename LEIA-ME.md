# Sistema Richard Assessoria — Guia de Arquivos

Sistema de gestão de segurança do trabalho: vencimentos, certificados,
pipeline de renovação, financeiro, medição e locação de equipamentos.

## Como rodar localmente (validação)

Coloque TODOS os arquivos numa pasta só e, no terminal dentro dela:

    python -m http.server 8000

Acesse http://localhost:8000  (abre o login).
Para parar: Ctrl + C.

> Módulos ES exigem servidor HTTP — abrir o arquivo direto (file://) não funciona.
> A importação em lote (importar.html) só funciona publicada no Claude.ai,
> pois usa a API do Claude. O resto funciona local.

## Antes de usar (configuração no Firebase — feita por você)
1. Console Firebase → Firestore Database → Create (modo produção)
2. Authentication → Email/senha → ativar → criar seu usuário
3. Firestore → Rules → colar:
       rules_version = '2';
       service cloud.firestore {
         match /databases/{database}/documents {
           match /{document=**} { allow read, write: if request.auth != null; }
         }
       }

## Páginas (11)
- index.html .......... Login
- dashboard.html ...... Painel de vencimentos
- pipeline.html ....... Acompanhamento (Kanban de renovação)
- cadastro.html ....... Novo registro de vencimento
- emitir.html ......... Emitir certificado (PDF + registra vencimento)
- importar.html ....... Importação em lote (PDF/PPTX/DOCX)
- empresas.html ....... Cadastro de empresas (CNPJ)
- funcionarios.html ... Cadastro de funcionários (CPF)
- equipamentos.html ... Locação de equipamentos + checklist
- financeiro.html ..... Módulo financeiro (faturamento/cobrança)
- medicao.html ........ Relatório de medição mensal (dia 30)

## Módulos de apoio (.js)
- firebase-config.js .... Conexão Firebase (sua config já está aqui)
- menu.js ............... Menu lateral (compartilhado)
- estilo.css ............ Identidade visual (compartilhado)
- vigencias.js .......... Prazos de cada NR
- conteudos.js .......... Conteúdo programático dos certificados
- certificado.js ........ Geração do PDF do certificado
- documento-br.js ....... Validação de CPF/CNPJ
- config-empresa.js ..... URL da assinatura e logo (você edita)
- etapas.js ............. Etapas do pipeline de renovação
- financeiro-fluxo.js ... Etapas e condições do financeiro
- equipamentos-def.js ... Tipos, situações e checklist de equipamentos
- alerta-vencimento.js .. Pop-up persistente de vencimentos

## Ainda pendente (depende de você)
- Configurar Firebase (acima) e publicar no GitHub Pages
- Colar a URL raw da assinatura em config-empresa.js
- Fornecer os conteúdos programáticos das outras NRs em conteudos.js
- Importar os certificados existentes pela tela de importação
