# Contrato: Mensagens entre Componentes

**Funcionalidade:** `001-handy-clipboard` | **Princípio relacionado:** III, IV

Comunicação via `chrome.runtime`/`chrome.tabs`. Todas as mensagens têm um campo
`type`. O `background.js` é o orquestrador do estado global.

## Mensagens

| `type` | Origem → Destino | Payload | Efeito |
|--------|------------------|---------|--------|
| `HANDY_TOGGLE` | popup → background | `{ enabled?: boolean }` | Alterna/define on/off; persiste; notifica abas. Responde `{ enabled }`. |
| `HANDY_GET_STATE` | popup → background | — | Responde `{ enabled }`. |
| `HANDY_STATE_CHANGED` | background → content (todas as abas) | `{ enabled: boolean }` | Content mostra/oculta o widget. |
| `HANDY_SETTINGS_CHANGED` | options → content | — | Content recarrega dados e reaplica configurações. |

## Regras

- Handlers assíncronos que respondem DEVEM retornar `true` para manter o canal
  aberto (padrão MV3).
- Abas em URLs restritas (`chrome://`) DEVEM ser ignoradas ao notificar.
- Falha ao enviar mensagem a uma aba sem content script DEVE ser ignorada
  silenciosamente.

## Critérios de Aceitação

- [ ] `HANDY_TOGGLE` sem `enabled` inverte o estado atual.
- [ ] `HANDY_STATE_CHANGED` atinge todas as abas elegíveis sem recarregar.
- [ ] `HANDY_SETTINGS_CHANGED` reflete cor/tamanho/opacidade imediatamente.
