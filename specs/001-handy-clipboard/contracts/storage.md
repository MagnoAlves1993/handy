# Contrato: Módulo de Storage (`shared/storage.js`)

**Funcionalidade:** `001-handy-clipboard` | **Princípio relacionado:** III

Este módulo é o **único** ponto de acesso a `chrome.storage.local`. Todos os
componentes (background, popup, options, content) DEVEM usar estas funções.

## API Pública

| Função | Assinatura | Comportamento |
|--------|------------|---------------|
| `getHandyData()` | `() => Promise<HandyData>` | Retorna o estado completo, mesclado sobre os padrões. |
| `setHandyData(data)` | `(HandyData) => Promise<void>` | Substitui o estado completo. |
| `getLines()` | `() => Promise<string[]>` | Retorna as linhas salvas. |
| `setLines(lines)` | `(string[]) => Promise<void>` | Persiste apenas as linhas. |
| `getSettings()` | `() => Promise<Settings>` | Retorna as configurações, mescladas sobre os padrões. |
| `setSettings(settings)` | `(Partial<Settings>) => Promise<void>` | Mescla e persiste configurações. |
| `isEnabled()` | `() => Promise<boolean>` | Retorna o estado ativo/inativo. |
| `setEnabled(enabled)` | `(boolean) => Promise<void>` | Persiste o estado ativo/inativo. |

## Invariantes

- Leituras SEMPRE aplicam os padrões antes de retornar (nunca retornam `undefined`
  para campos conhecidos).
- Escritas parciais (`setLines`, `setSettings`, `setEnabled`) NÃO podem sobrescrever
  campos não relacionados.
- Nenhum outro módulo pode chamar `chrome.storage.local` diretamente.

## Critérios de Aceitação

- [ ] `getHandyData()` retorna padrões quando o storage está vazio.
- [ ] `setLines()` preserva `settings` e `enabled`.
- [ ] `setSettings({size})` preserva as demais configurações.
- [ ] `setEnabled(false)` preserva `lines` e `settings`.
