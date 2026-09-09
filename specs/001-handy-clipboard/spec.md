# Feature Specification: Handy — Widget de Copiar e Colar

**Feature Branch**: `001-handy-clipboard`

**Created**: 2026-09-09

**Status**: Draft

**Input**: User description: "Extensão do Chrome com botão flutuante que abre um painel de linhas para colar, salvar e copiar textos, persistente e personalizável."

## Clarifications

### Session 2026-09-09

- Q: Quantas linhas de texto o painel deve ter por padrão? → A: 6 linhas fixas (alinhar `storage.js` ao `content.js`).
- Q: Ao editar uma linha em uma aba, as outras abas refletem em tempo real? → A: Não; cada aba reflete o conteúdo salvo ao (re)abrir o painel.
- Q: Além do botão "X", o painel pode ser fechado pela tecla `Esc`? → A: Sim; `Esc` fecha o painel e volta ao botão.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Guardar e copiar textos rapidamente (Priority: P1)

Como usuário navegando na web, quero um lugar sempre acessível para guardar
pequenos trechos de texto e copiá-los com um clique, sem alternar para um bloco
de notas ou outro aplicativo.

**Why this priority**: É o coração do produto — sem isso não há valor. Entrega um
MVP utilizável por si só.

**Independent Test**: Ativar a extensão, abrir o painel pelo botão flutuante,
digitar/colar texto em uma linha e copiá-lo de volta para a área de transferência.

**Acceptance Scenarios**:

1. **Given** a extensão ativada, **When** abro qualquer página web, **Then** vejo
   um botão flutuante no canto inferior direito.
2. **Given** o botão visível, **When** clico nele, **Then** abre um painel com
   múltiplas linhas de texto na mesma posição.
3. **Given** o painel aberto, **When** digito ou colo texto em uma linha,
   **Then** o conteúdo é salvo automaticamente.
4. **Given** uma linha com texto, **When** aciono o botão de copiar, **Then** o
   texto vai para a área de transferência com confirmação visual.
5. **Given** o painel aberto, **When** aciono o botão de fechar, **Then** o painel
   some e o botão flutuante reaparece na mesma posição.

---

### User Story 2 - Persistência entre sessões (Priority: P2)

Como usuário, quero que meus textos salvos continuem disponíveis mesmo após fechar
e reabrir o navegador, para não perder informações.

**Why this priority**: Aumenta muito o valor, mas depende da funcionalidade base
(US1) já existir.

**Independent Test**: Salvar textos, fechar o navegador, reabrir e verificar que
os textos continuam nas mesmas linhas.

**Acceptance Scenarios**:

1. **Given** textos salvos anteriormente, **When** fecho e reabro o navegador,
   **Then** os textos continuam disponíveis.
2. **Given** a extensão desativada e reativada, **When** reabro o painel,
   **Then** os dados anteriores permanecem intactos.

---

### User Story 3 - Personalização visual (Priority: P3)

Como usuário, quero ajustar tamanho, cor, opacidade e variante visual do botão e
do painel, para adequar o widget ao meu gosto e à página.

**Why this priority**: Melhora a experiência, mas é opcional ao uso principal.

**Independent Test**: Abrir as opções, alterar tamanho/cor/opacidade e verificar
que o widget reflete imediatamente em todas as abas.

**Acceptance Scenarios**:

1. **Given** as configurações abertas, **When** altero tamanho/cor/opacidade,
   **Then** o botão e o painel refletem os ajustes imediatamente.
2. **Given** múltiplas abas abertas, **When** altero uma configuração,
   **Then** todas as abas refletem a mudança sem recarregar.
3. **Given** a extensão ativa, **When** eu a desativo pelo popup, **Then** o botão
   deixa de aparecer nas páginas.

---

### Edge Cases

- Cópia para a área de transferência falha (permissão negada) → a ação falha
  silenciosamente sem quebrar o painel.
- Páginas restritas do navegador (`chrome://`) → o widget não é injetado.
- Site com CSS agressivo → o widget mantém a aparência isolada, sem vazamento.
- Copiar uma linha vazia → nenhuma ação é realizada.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST exibir um botão flutuante no canto inferior direito
  das páginas quando a extensão estiver ativada.
- **FR-002**: O botão MUST abrir um painel de linhas de texto ao ser acionado.
- **FR-003**: O painel MUST ocupar a mesma posição do botão, que reaparece ao fechar.
- **FR-004**: O usuário MUST poder ativar e desativar a extensão pelo popup.
- **FR-005**: O painel MUST conter 6 linhas fixas de entrada de texto.
- **FR-006**: O usuário MUST poder digitar ou colar texto em cada linha.
- **FR-007**: As alterações nas linhas MUST ser salvas automaticamente.
- **FR-008**: Cada linha MUST oferecer uma ação de copiar seu texto para a área
  de transferência, com confirmação visual.
- **FR-009**: O painel MUST oferecer uma ação de fechar que retorna ao botão,
  acionável pelo botão "X" e pela tecla `Esc`.
- **FR-010**: Os dados salvos MUST persistir entre sessões do navegador.
- **FR-011**: O usuário MUST poder personalizar tamanho, cor e opacidade do botão
  e do painel.
- **FR-012**: O sistema MUST suportar variantes visuais de botão e painel,
  selecionáveis nas configurações.
- **FR-013**: Mudanças de estado (on/off) e de configuração MUST refletir em todas
  as abas abertas sem recarregar a página. O conteúdo das linhas NOT precisa
  sincronizar em tempo real entre abas; cada aba reflete o salvo ao (re)abrir o painel.
- **FR-014**: O widget MUST NOT interferir visualmente na página hospedeira.

### Key Entities

- **handyData**: conjunto único de estado do usuário, contendo o indicador
  ativo/inativo, a lista de linhas de texto e as configurações visuais.
- **Linha**: um trecho de texto individual salvo, identificado pela posição.
- **Settings**: preferências visuais (variante do botão, variante do painel,
  tamanho, cores e opacidades).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O usuário consegue salvar e copiar um texto em menos de 5 segundos a
  partir da abertura do painel.
- **SC-002**: 100% dos textos salvos permanecem disponíveis após fechar e reabrir
  o navegador.
- **SC-003**: Mudanças de configuração refletem em todas as abas abertas em menos
  de 1 segundo, sem recarregar a página.
- **SC-004**: O widget mantém aparência consistente em pelo menos 95% dos sites
  testados, sem interferência de CSS da página.

## Assumptions

- O usuário utiliza Google Chrome desktop com suporte a Manifest V3.
- O uso é individual; não há sincronização entre dispositivos no escopo v1.
- A quantidade de linhas é pequena (poucas dezenas), sem necessidade de busca.
- A permissão de área de transferência normalmente está disponível; falhas são
  tratadas de forma não bloqueante.
