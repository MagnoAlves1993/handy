---
description: "Task list for Handy — Widget de Copiar e Colar"
---

# Tasks: Handy — Widget de Copiar e Colar

**Input**: Design documents from `/specs/001-handy-clipboard/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: não solicitados; validação é manual (ver quickstart.md).

**Organization**: tarefas agrupadas por user story para implementação e teste
independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: user story a que a tarefa pertence (US1, US2, US3)

## Path Conventions

- Projeto único (extensão): código na raiz em `extension/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: inicialização do projeto e estrutura básica.

- [X] T001 Criar `extension/manifest.json` (MV3) com permissões mínimas
  (`storage`, `activeTab`, `scripting`), service worker módulo, `content_scripts`
  para `<all_urls>` e `web_accessible_resources`.
- [X] T002 [P] Definir a estrutura de pastas de `extension/` (`content/`,
  `popup/`, `options/`, `shared/`, `assets/`).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: infraestrutura central exigida por todas as histórias.

**⚠️ CRITICAL**: nenhuma user story pode começar antes desta fase.

- [X] T003 Implementar `extension/shared/storage.js` conforme
  [contracts/storage.md](./contracts/storage.md): `getHandyData`, `setHandyData`,
  `getLines`, `setLines`, `getSettings`, `setSettings`, `isEnabled`, `setEnabled`,
  com mesclagem sobre `DEFAULT_DATA`.
- [X] T004 Definir `DEFAULT_DATA` e `Settings` conforme
  [data-model.md](./data-model.md).
- [X] T005 Implementar `extension/background.js`: tratar `HANDY_TOGGLE` e
  `HANDY_GET_STATE`, persistir e enviar `HANDY_STATE_CHANGED` a todas as abas
  elegíveis (ignorar `chrome://`); inicializar padrões em `onInstalled`.

**Checkpoint**: fundação pronta — histórias podem iniciar.

---

## Phase 3: User Story 1 - Guardar e copiar textos rapidamente (Priority: P1) 🎯 MVP

**Goal**: botão flutuante + painel de linhas com salvamento automático e cópia.

**Independent Test**: abrir o painel, digitar/colar em uma linha e copiar o texto.

- [X] T006 [US1] Criar `extension/content/content.js`: montar `#handy-root` com
  Shadow DOM e carregar `content.css` via `<link>` interno.
- [X] T007 [US1] Renderizar o botão flutuante (SVG via `fetch`+`DOMParser`,
  recolorir `.layer-fills path`).
- [X] T008 [US1] Renderizar o painel de linhas: inputs, botão de copiar por linha,
  botão de fechar; alternar botão↔painel na mesma posição.
- [X] T009 [US1] Persistência automática por linha (`input` → `setLines`).
- [X] T010 [US1] Cópia para a área de transferência com confirmação visual e
  falha silenciosa.
- [X] T011 [P] [US1] Criar `extension/content/content.css` com estilos isolados
  do botão e do painel nos três tamanhos.
- [X] T012 [P] [US1] Adicionar `assets/button-jjk-gojo.svg` e `assets/hand-default.svg`.

**Checkpoint**: US1 funcional e testável de forma independente (MVP).

---

## Phase 4: User Story 2 - Persistência entre sessões (Priority: P2)

**Goal**: dados salvos sobrevivem a fechar/reabrir o navegador.

**Independent Test**: salvar textos, reabrir o navegador e conferir persistência.

- [X] T013 [US2] Garantir que `setLines` persiste em `chrome.storage.local` sem
  sobrescrever `settings`/`enabled` (via `shared/storage.js`).
- [X] T014 [US2] Restaurar linhas salvas ao construir o widget (`refresh`).

**Checkpoint**: US1 + US2 funcionam de forma independente.

---

## Phase 5: User Story 3 - Personalização visual (Priority: P3)

**Goal**: opções de tamanho, cor, opacidade e variantes refletidas em tempo real.

**Independent Test**: alterar configurações e ver o widget mudar em todas as abas.

- [X] T015 [P] [US3] Criar `extension/popup/` (`popup.html`, `popup.css`,
  `popup.js`) para ligar/desligar via `HANDY_TOGGLE`.
- [X] T016 [P] [US3] Criar `extension/options/` (`options.html`, `options.css`,
  `options.js`) para variante, tamanho, cor e opacidade; emitir
  `HANDY_SETTINGS_CHANGED`.
- [X] T017 [US3] Aplicar configurações (tamanho, cor, opacidade) e reagir a
  `HANDY_STATE_CHANGED` / `HANDY_SETTINGS_CHANGED` no content script.

**Checkpoint**: todas as histórias funcionam de forma independente.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: acabamento e validação (pendentes).

- [ ] T018 Gerar ícones PNG (`icon16/48/128.png`) e referenciá-los no manifesto.
- [ ] T019 Executar o roteiro de [quickstart.md](./quickstart.md) no Chrome.
- [ ] T020 [P] Testar persistência ao fechar/reabrir o navegador (US2).
- [ ] T021 [P] Testar aplicação de configurações em tempo real (US3).
- [ ] T022 [P] Testar isolamento de CSS em sites diversos.
- [ ] T023 Revisar responsividade do painel nos tamanhos pequeno e grande.

---

## Dependencies & Execution Order

- **Setup (Phase 1)**: sem dependências.
- **Foundational (Phase 2)**: depende do Setup; BLOQUEIA todas as histórias.
- **US1 (Phase 3)**: após a Fundação — é o MVP.
- **US2 (Phase 4)**: após a Fundação; reforça a persistência da US1.
- **US3 (Phase 5)**: após a Fundação; independente da US2.
- **Polish (Phase N)**: após as histórias desejadas.

## Parallel Opportunities

```
# Dentro da US1:
T011  content.css
T012  assets (SVGs)

# US3 (após a Fundação):
T015  popup/
T016  options/
```
