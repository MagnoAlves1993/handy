# Implementation Plan: Handy — Widget de Copiar e Colar

**Branch**: `001-handy-clipboard` | **Date**: 2026-09-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-handy-clipboard/spec.md`

## Summary

Extensão Chrome (Manifest V3) que injeta um botão flutuante e um painel de linhas
de texto em qualquer página, com persistência local e personalização visual. A
abordagem usa apenas APIs nativas do navegador, Shadow DOM para isolamento e um
único módulo de acesso ao `chrome.storage.local` como fonte da verdade.

## Technical Context

**Language/Version**: JavaScript (ES Modules), runtime do Chrome MV3
**Primary Dependencies**: nenhuma (apenas APIs `chrome.*` e Web APIs)
**Storage**: `chrome.storage.local` (chave única `handyData`)
**Testing**: validação manual no Chrome em modo desenvolvedor (carregar sem compactar)
**Target Platform**: Google Chrome desktop, Manifest V3
**Project Type**: extensão de navegador (single project)
**Performance Goals**: injeção do widget imperceptível; sem impacto notável no carregamento
**Constraints**: sem código remoto; permissões mínimas; isolamento total de CSS
**Scale/Scope**: uso individual; poucos KB de dados; até algumas dezenas de linhas

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Situação | Observação |
|-----------|----------|------------|
| I. Separação Dados/Apresentação | PASS | `handyData` guarda dados; a UI apenas renderiza. |
| II. Isolamento na Página | PASS | Content script usa Shadow DOM; CSS via `<link>` interno. |
| III. Persistência Local Primeiro | PASS | Todo acesso ao storage passa por `shared/storage.js`. |
| IV. Extensibilidade por Variantes | PASS | Variantes configuráveis sem mudar o modelo. |
| V. Simplicidade sem Dependências | PASS | Zero bibliotecas de terceiros. |

**Resultado**: PASS — nenhuma violação; tabela de complexidade vazia.

## Project Structure

### Documentation (this feature)

```text
specs/001-handy-clipboard/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
extension/
├── manifest.json        # Manifesto MV3
├── background.js        # Service worker: estado on/off + sincronização de abas
├── content/
│   ├── content.js       # Injeta botão + painel (Shadow DOM)
│   └── content.css      # Estilos isolados do widget
├── popup/               # Liga/desliga a extensão
├── options/             # Configurações visuais
├── shared/
│   └── storage.js       # Fonte única de acesso ao storage
└── assets/              # SVGs das variantes
```

**Structure Decision**: projeto único (extensão de navegador), sem back-end nem
app separado. Os componentes comunicam-se por mensagens do runtime da extensão.
As pastas reais em `extension/` já refletem esta estrutura.

## Complexity Tracking

> Nenhuma violação da constituição — tabela vazia.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
