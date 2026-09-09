# Modelo de Dados: Handy

**Data:** 2026-09-09 | **Funcionalidade:** `001-handy-clipboard`

Todo o estado do usuário é armazenado sob uma única chave (`handyData`) em
`chrome.storage.local`. Dados e apresentação são separados (Princípio I).

## Entidade: `handyData`

| Campo      | Tipo     | Descrição                                   | Padrão |
|------------|----------|---------------------------------------------|--------|
| `enabled`  | boolean  | Indica se a extensão está ativa.            | `true` |
| `lines`    | string[] | Lista de linhas de texto salvas.            | `['', '', '', '', '']` |
| `settings` | Settings | Preferências visuais (ver abaixo).          | ver `Settings` |

### Sub-entidade: `Settings`

| Campo           | Tipo    | Descrição                                  | Padrão       |
|-----------------|---------|--------------------------------------------|--------------|
| `buttonVariant` | string  | Identificador da variante do botão.        | `'jjk-gojo'` |
| `handVariant`   | string  | Identificador da variante do painel/mão.   | `'default'`  |
| `size`          | string  | Tamanho do widget (`small`/`medium`/`large`). | `'medium'` |
| `buttonColor`   | string  | Cor do botão em hexadecimal.               | `'#ffffff'`  |
| `buttonOpacity` | number  | Opacidade do botão (0–1).                  | `1`          |
| `handColor`     | string  | Cor do painel/mão em hexadecimal.          | `'#b2b2b2'`  |
| `handOpacity`   | number  | Opacidade do painel/mão (0–1).             | `1`          |

## Regras de Validação

- `lines` DEVE ser um array de strings; posições vazias são permitidas.
- `buttonOpacity` e `handOpacity` DEVEM estar no intervalo `[0, 1]`.
- `size` DEVE ser um dos valores enumerados.
- Cores DEVEM estar no formato hexadecimal `#RRGGBB`.

## Regras de Migração/Compatibilidade

- A leitura DEVE mesclar o conteúdo salvo sobre os padrões
  (`{ ...DEFAULT_DATA, ...salvo }`), garantindo que novos campos tenham padrão
  sem exigir migração destrutiva.
- Adicionar novas variantes NÃO altera o formato de `handyData` (Princípio IV).

## Transições de Estado

```
[desativado] --toggle(on)--> [ativado, widget visível]
[ativado] --toggle(off)--> [desativado, widget oculto]
[painel fechado] --abrir--> [painel aberto, botão oculto]
[painel aberto] --fechar--> [painel fechado, botão visível]
[linha editada] --input--> [handyData.lines atualizado e persistido]
```
