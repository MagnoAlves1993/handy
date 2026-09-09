# Handy — Clipboard Widget

Uma extensão Chrome (Manifest V3) que injeta um painel flutuante para salvar, copiar e colar textos rapidamente em qualquer página.

## 🎯 Sobre

**Handy** é um exemplo prático de desenvolvimento **Spec-Driven Development (SDD)** — metodologia que coloca a especificação como primeira, antes do código. O projeto foi documentado e planejado usando o [GitHub Spec Kit](https://github.com/github/spec-kit) toolkit oficial, garantindo clareza, rastreabilidade e qualidade desde o início.

## Exemplo

https://github.com/user-attachments/assets/ffa6640d-8ec3-46e2-becc-0a88ec3e6fcb


### Botão

<img width="132" height="183" alt="Captura de tela 2026-09-09 201529" src="https://github.com/user-attachments/assets/9eb073e5-4d92-4f04-9401-0586fd26e055" />

---
### Input do texto

<img width="387" height="342" alt="Captura de tela 2026-09-09 201547" src="https://github.com/user-attachments/assets/86ecc9c3-af12-42d5-bf65-fa0de8a6f5d5" />

---
### Configuração da extensão

<img width="432" height="314" alt="Captura de tela 2026-09-09 201605" src="https://github.com/user-attachments/assets/02b52a06-df7b-4bd3-a708-4590c6c14d37" />

<img width="618" height="563" alt="Captura de tela 2026-09-09 201928" src="https://github.com/user-attachments/assets/04f295af-9735-4065-b3c8-cb87a43a27fe" />

---

## 📁 Estrutura

```
handy/
├── extension/              # Código-fonte da extensão Chrome (MV3)
│   ├── manifest.json       # Configuração da extensão
│   ├── background.js       # Service worker (sincronização de estado)
│   ├── content/            # Content script + estilos isolados
│   ├── popup/              # UI do botão de toggle
│   ├── options/            # Página de configurações visuais
│   └── shared/             # Módulo centralizado de storage
├── specs/001-handy-clipboard/  # Especificação do recurso (SDD)
│   ├── spec.md             # Especificação formal com user stories e FRs
│   ├── plan.md             # Plano de implementação e contexto técnico
│   ├── tasks.md            # Tarefas ordenadas por dependência
│   ├── research.md         # Pesquisa de tecnologias e decisões
│   ├── data-model.md       # Modelo de dados
│   ├── quickstart.md       # Guia de setup para desenvolvedores
│   └── contracts/          # Contratos de APIs internas
├── .specify/               # Configuração do Spec Kit
│   └── memory/constitution.md  # Constituição do projeto (5 princípios)
└── .github/skills/         # Skills do Spec Kit (/speckit-* commands)
```

## 🛠 Tecnologias

- **JavaScript (ES Modules)** — código puro, sem dependências externas
- **Chrome Manifest V3** — arquitetura moderna de segurança
- **Shadow DOM** — isolamento de CSS da página hospedeira
- **chrome.storage.local** — persistência local única fonte da verdade

## 📋 Especificação (Spec Kit)

A funcionalidade foi especificada seguindo o fluxo SDD oficial:

1. **Specification** → [spec.md](specs/001-handy-clipboard/spec.md)  
   User stories, functional requirements, acceptance criteria, edge cases

2. **Planning** → [plan.md](specs/001-handy-clipboard/plan.md)  
   Contexto técnico, verificação da constituição, estrutura do projeto

3. **Tasks** → [tasks.md](specs/001-handy-clipboard/tasks.md)  
   Tarefas ordenadas por dependência e fase de implementação

## 🏗 Constituição do Projeto

Veja [.specify/memory/constitution.md](.specify/memory/constitution.md) — 5 princípios arquiteturais:

- **I. Separação Dados/Apresentação** — `handyData` guarda tudo; UI apenas renderiza
- **II. Isolamento na Página Hospedeira** — Shadow DOM + CSS interno; zero interferência
- **III. Persistência Local Primeiro** — `chrome.storage.local` como única fonte
- **IV. Extensibilidade por Variantes** — Temas/configurações sem quebra de modelo
- **V. Simplicidade sem Dependências** — Zero bibliotecas externas

## 🚀 Como usar (Desenvolvimento)

### Setup

```bash
# Clonar
git clone <this-repo>
cd handy

# Instalar a extensão no Chrome
# 1. Abrir chrome://extensions/
# 2. Ativar "Developer mode" (canto superior direito)
# 3. Clicar "Load unpacked" e selecionar a pasta extension/
```

### Rodar especificações (opcional)

```bash
# Instalar o Spec Kit (uvx — precisa git + uv/pip instalados)
uvx --from git+https://github.com/github/spec-kit.git specify check

# Rodar o clarify (esclarecer ambiguidades)
uvx --from git+https://github.com/github/spec-kit.git specify check --clarify
```

## 📝 Fluxo de Trabalho SDD

Para quem quer entender ou estender este projeto:

```bash
# 1. Verificar spec/plan/tasks por inconsistências
/speckit-analyze

# 2. Se tiver dúvidas sobre decisões de design
/speckit-clarify

# 3. Depois de mudar a spec, regenerar tasks
/speckit-tasks

# 4. Implementar as tasks
/speckit-implement

# 5. Validar contra a spec após implementar
/speckit-converge
```

(Estes comandos estão instalados como skills em `.github/skills/` — rode no Copilot Chat com `/` no VS Code)

## 📚 Para Aprender Mais

- [GitHub Spec Kit Docs](https://github.com/github/spec-kit)
- [Spec-Driven Development (SDD)](https://github.com/github/spec-kit/blob/main/docs/README.md)
- [Chrome Manifest V3 API](https://developer.chrome.com/docs/extensions/mv3/)

## 📄 Licença

Projeto pessoal de portfólio. Use como referência livre.

---

**Criado**: 2026-09-09  
**Metodologia**: Spec-Driven Development (GitHub Spec Kit)
