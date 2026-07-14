# NSS Engenharia — Projeto React + Vite (TypeScript)

Este repositório contém o código-fonte do site institucional desenvolvido com Vite, React, TypeScript, Tailwind CSS e componentes shadcn-ui. O projeto também integra Supabase para dados e autenticação.

## Sumário
- Tecnologias
- Pré-requisitos
- Instalação e execução
- Scripts disponíveis
- Variáveis de ambiente
- Estrutura do projeto
- Rotas da aplicação
- Build e deploy
- Dicas e problemas comuns
- Contribuição

## Tecnologias
- Vite 5 (dev server e build)
- React 18 + TypeScript
- Tailwind CSS + tailwindcss-animate
- shadcn-ui (baseado em Radix UI)
- TanStack Query (requisições e cache)
- Supabase (SDK `@supabase/supabase-js`)

## Pré-requisitos
- Node.js (recomendado LTS)
- npm (ou outro gerenciador, ex.: pnpm, bun)

## Instalação e execução
1) Instale as dependências:

```
npm install
```

2) Execute o servidor de desenvolvimento:

```
npm run dev
```

- O servidor inicia em: http://localhost:8080/
- Hot Module Replacement (HMR) está habilitado.

## Scripts disponíveis
Definidos em `package.json`:
- `dev`: inicia o Vite em modo desenvolvimento
- `build`: build de produção
- `build:dev`: build em modo desenvolvimento
- `lint`: executa ESLint
- `preview`: levanta um servidor para pré-visualizar o build

Exemplos:
```
npm run build
npm run preview
npm run lint
```

## Variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto com:

```
VITE_SUPABASE_URL="https://<SEU_PROJETO>.supabase.co"
VITE_SUPABASE_PROJECT_ID="<ID_DO_PROJETO>"
VITE_SUPABASE_PUBLISHABLE_KEY="<CHAVE_PUBLICA>"
```

Observações importantes:
- Nunca commit valores sensíveis (mesmo chaves públicas devem ser gerenciadas com cuidado).
- Em produção, configure variáveis de ambiente no provedor de hospedagem.

## Estrutura do projeto
Principais pastas e arquivos:
- `src/` código-fonte do app
  - `pages/` páginas da aplicação (Home, Serviços, etc.)
  - `components/` componentes reutilizáveis
  - `assets/` imagens e ícones
  - `App.tsx` configuração de rotas
- `public/` arquivos estáticos (favicon, robots.txt, _redirects)
- `vite.config.ts` configuração do Vite (porta 8080, alias `@` → `src`)
- `tailwind.config.ts` configuração Tailwind

## Rotas da aplicação
Definidas em `src/App.tsx`:
- `/` Home
- `/fg-laport`
- `/servicos`
- `/servicos/:slug`
- `/obras-executadas`
- `/informativo`
- `/informativo/:slug`
- `/contato`
- `/auth`
- `/admin/*`
- `*` NotFound

UX adicional:
- O app inclui um componente `ScrollToTop` para rolar ao topo ao mudar de rota.

## Build e deploy
Gerar build de produção:
```
npm run build
```
Os arquivos serão gerados em `dist/`.

Pré-visualizar o build:
```
npm run preview
```

Hospedagem estática (Vercel, Netlify, etc.):
- Suba o conteúdo de `dist/`.
- O arquivo `public/_redirects` ajuda a tratar rotas de SPA em provedores como Netlify.

## Dicas e problemas comuns
- Porta já em uso: altere `server.port` em `vite.config.ts`.
- PowerShell bloqueando `npm.ps1`: use `npm.cmd` no Windows ou ajuste a execution policy.
- Estrutura de pastas: garanta executar os comandos na pasta onde está o `package.json`.

## Contribuição
- Crie uma branch para sua alteração.
- Rode `npm run lint` antes de abrir PR.
- Descreva claramente mudanças e impacto.

Em caso de dúvidas ou melhorias, sinta-se à vontade para abrir uma issue ou solicitar suporte.
