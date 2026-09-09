# Quickstart: Carregar e Validar o Handy

**Funcionalidade:** `001-handy-clipboard` | **Data:** 2026-09-09

Guia rápido para carregar a extensão no Chrome e validar os cenários da spec.

## Carregar a extensão (modo desenvolvedor)

1. Abra `chrome://extensions`.
2. Ative **Modo do desenvolvedor** (canto superior direito).
3. Clique em **Carregar sem compactação**.
4. Selecione a pasta `extension/`.

## Roteiro de validação (mapeado à spec)

| Passo | Ação | Resultado esperado | Requisito |
|-------|------|--------------------|-----------|
| 1 | Abrir qualquer página web | Botão flutuante no canto inferior direito | RF-001 |
| 2 | Clicar no botão | Painel de linhas abre na mesma posição | RF-002, RF-003 |
| 3 | Digitar/colar texto em uma linha | Texto salvo automaticamente | RF-006, RF-007 |
| 4 | Clicar em copiar na linha | Texto na área de transferência + confirmação visual | RF-008 |
| 5 | Clicar em fechar (X) | Painel some, botão reaparece | RF-009 |
| 6 | Fechar e reabrir o navegador | Textos continuam salvos | RF-010 |
| 7 | Desativar pelo popup | Botão some de todas as abas | RF-004, RF-013 |
| 8 | Ajustar tamanho/cor/opacidade nas opções | Widget reflete imediatamente | RF-011, RF-013 |
| 9 | Abrir em um site com CSS agressivo | Widget mantém aparência isolada | RF-014 |

## Verificações de borda

- Copiar linha vazia → nenhuma ação.
- Página `chrome://` → widget não é injetado.
- Permissão de área de transferência negada → falha silenciosa, painel intacto.
