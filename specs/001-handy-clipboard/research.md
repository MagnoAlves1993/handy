# Pesquisa Técnica: Handy

**Data:** 2026-09-09 | **Funcionalidade:** `001-handy-clipboard`

Este documento registra as decisões técnicas da Fase 0, cada uma com a opção
escolhida, a justificativa e as alternativas consideradas.

## D-01: Isolamento do widget na página hospedeira

- **Decisão:** injetar o widget em um Shadow DOM (`mode: 'open'`), carregando o
  CSS via `<link>` interno ao shadow.
- **Justificativa:** garante que o CSS da página não afete o widget e vice-versa,
  atendendo ao Princípio II. Overhead mínimo e acesso direto ao DOM.
- **Alternativas consideradas:**
  - *iframe*: isolamento forte, porém comunicação e dimensionamento mais custosos.
  - *CSS com prefixos e `!important`*: frágil em sites com estilos agressivos.

## D-02: Formato de armazenamento

- **Decisão:** uma única chave `handyData` em `chrome.storage.local`, contendo
  `enabled`, `lines[]` e `settings{}`.
- **Justificativa:** leitura/escrita atômica de todo o estado, migração futura
  simples e coerência entre componentes (Princípio III).
- **Alternativas consideradas:**
  - *Múltiplas chaves* (`lines`, `settings`, `enabled`): mais chamadas e risco de
    estado parcialmente atualizado.
  - *`chrome.storage.sync`*: adiciona limites de cota e complexidade de conflito
    desnecessários para uso local.

## D-03: Renderização das variantes de botão/mão

- **Decisão:** carregar o SVG como texto (`fetch` + `DOMParser`) e inseri-lo no
  DOM, permitindo recolorir camadas específicas (`.layer-fills path`).
- **Justificativa:** recolorir dinamicamente conforme a configuração do usuário
  exige acesso aos nós internos do SVG, impossível via `<img>`.
- **Alternativas consideradas:**
  - *`<img src=...>`*: não permite recolorir camadas internas.
  - *SVG embutido no JS*: dificulta manutenção e troca de variantes.

## D-04: Sincronização de estado entre abas

- **Decisão:** o `background.js` (service worker) recebe o toggle e envia
  mensagens `HANDY_STATE_CHANGED` para todas as abas; o content script reage
  mostrando/ocultando o widget.
- **Justificativa:** mantém todas as abas coerentes sem recarregar a página
  (RF-013), respeitando o modelo de mensagens do MV3.
- **Alternativas consideradas:**
  - *Escutar `chrome.storage.onChanged` em cada content script*: viável, porém
    mistura responsabilidades; a orquestração central é mais previsível.

## D-05: Ausência de dependências e build

- **Decisão:** não usar frameworks nem bundler; apenas ES Modules nativos.
- **Justificativa:** Princípio V (simplicidade); a extensão é pequena, auditável
  e carrega diretamente no Chrome sem etapa de build.
- **Alternativas consideradas:**
  - *React/Vite*: overhead injustificado para um widget simples.

## Pendências de esclarecimento

Nenhuma. Todos os pontos da spec foram resolvidos nas decisões acima.
