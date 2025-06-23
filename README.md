
# JurisIntel Dashboard

Um aplicativo inteligente para pesquisa de jurisprudência, análise de precedentes e apresentação de insights jurídicos em dashboards, complementado por guias práticos para peticionamento e um gerador de prompts para pesquisa aprofundada.

## Funcionalidades Principais

*   **Análise Jurisprudencial Detalhada:** Pesquisa e exibe teses firmadas pelo STJ, precedentes relevantes, evolução temporal de casos e entendimentos, além de identificar divergências jurisprudenciais.
*   **Guias Práticos para Advogados:** Oferece explicações e exemplos sobre prequestionamento e elementos essenciais do Recurso Especial.
*   **Gerador de Prompts Avançados:** Cria prompts personalizados para pesquisa jurídica profunda, direcionados a Tribunais Estaduais e fontes doutrinárias, utilizando o tema da pesquisa principal como base.
*   **Relatórios Exportáveis:** Permite gerar e baixar relatórios completos da análise e dos guias em formatos HTML (com estilo) e Markdown.
*   **Links para Fontes:** Inclui links diretos para as fontes das teses e precedentes, quando disponíveis.
*   **Interface Moderna e Responsiva:** Construído com foco na experiência do usuário, utilizando Tailwind CSS para um design limpo e adaptável.

## Tecnologias Utilizadas

*   **React:** Biblioteca JavaScript para construção da interface do usuário.
*   **TypeScript:** Superset do JavaScript que adiciona tipagem estática.
*   **Tailwind CSS:** Framework CSS utility-first para estilização rápida e customizável.
*   **Google Gemini API (`@google/genai`):** Para análise jurídica inteligente e geração de conteúdo.
*   **Recharts:** Biblioteca de gráficos para visualização de dados (evolução temporal).
*   **ES Modules no Navegador:** Carregamento de módulos JavaScript diretamente no navegador via `importmap`.

## Como Começar

Siga estas instruções para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos

*   [Git](https://git-scm.com/) instalado.
*   Um navegador web moderno (Chrome, Firefox, Edge, Safari).
*   Uma chave de API válida para o Google Gemini. Você pode obter uma no [Google AI Studio](https://aistudio.google.com/app/apikey).

### 1. Clonar o Repositório

Primeiro, clone este repositório para sua máquina local. Se você ainda não criou um repositório no GitHub para este projeto, veja a seção "Configurando o Repositório no GitHub" mais abaixo.

```bash
# Substitua pela URL do seu repositório (se já existir)
# git clone https://github.com/SEU_USUARIO/jurisintel-dashboard.git

# Se você recebeu os arquivos de outra forma, apenas navegue até o diretório do projeto
cd path/to/your/jurisintel-dashboard
```

### 2. Configurar a Chave da API do Gemini

O aplicativo requer uma chave de API do Google Gemini para funcionar.

**a. Crie um arquivo `.env` (Opcional, mas boa prática para referência):**

Na raiz do seu projeto, crie um arquivo chamado `.env` e adicione sua chave de API:

```env
API_KEY=SUA_CHAVE_API_DO_GEMINI_AQUI
```

**Importante:** Este arquivo `.env` **não será lido diretamente pelo navegador** na configuração atual do projeto (que não usa Node.js no backend ou um processo de build como Vite/Webpack para injetar variáveis de ambiente). Ele serve como um local seguro para você armazenar sua chave e como referência.

**b. Disponibilizando a API Key para o Aplicativo em Desenvolvimento Local:**

Como este é um projeto frontend que utiliza `process.env.API_KEY` no arquivo `services/geminiService.ts`, e não há um processo de build configurado para substituir essa variável, você precisará fornecer a chave de outra forma para testes locais:

1.  Abra o arquivo `services/geminiService.ts`.
2.  Localize a linha:
    ```javascript
    const API_KEY = process.env.API_KEY;
    ```
3.  **Temporariamente**, para fins de desenvolvimento local, modifique esta linha para incluir sua chave de API diretamente. Você pode comentar a linha original e adicionar a nova:
    ```javascript
    // const API_KEY = process.env.API_KEY; // Linha original comentada
    const API_KEY = "SUA_CHAVE_API_DO_GEMINI_AQUI"; // Adicione sua chave real aqui
    ```
4.  **AVISO DE SEGURANÇA MUITO IMPORTANTE:**
    *   **NUNCA FAÇA COMMIT DESTA ALTERAÇÃO COM SUA CHAVE DE API VISÍVEL PARA O SEU REPOSITÓRIO GIT PÚBLICO OU COMPARTILHADO.**
    *   Esta é uma solução **apenas para teste local**.
    *   Lembre-se de remover sua chave codificada ou reverter para `process.env.API_KEY` antes de fazer commit ou compartilhar o código extensivamente.

**Para um ambiente de produção ou um fluxo de desenvolvimento mais robusto:** Você deve usar um processo de build (com ferramentas como Vite ou Webpack) que possa substituir `process.env.API_KEY` pelo valor real durante a compilação, ou servir o aplicativo através de um backend que possa injetar a chave de forma segura, ou usar um proxy para as chamadas de API.

### 3. Executar a Aplicação Localmente

Após configurar a chave da API conforme o passo anterior (modificando `services/geminiService.ts` temporariamente):

1.  Certifique-se de que todos os arquivos (`index.html`, `index.tsx`, `App.tsx`, etc.) estão na mesma estrutura de diretórios que você recebeu.
2.  Abra o arquivo `index.html` diretamente no seu navegador web.

O aplicativo deve carregar e estar pronto para uso.

## Configurando o Repositório no GitHub (Se você ainda não o fez)

Se você recebeu os arquivos do projeto e quer criar seu próprio repositório no GitHub para versionamento:

1.  Vá para o [GitHub](https://github.com) e crie um novo repositório. Você pode nomeá-lo, por exemplo, `jurisintel-dashboard`.
2.  No diretório do seu projeto local (onde estão os arquivos `index.html`, etc.), inicialize um repositório Git (se ainda não for um):
    ```bash
    git init -b main
    ```
3.  Adicione todos os arquivos ao Git:
    ```bash
    git add .
    ```
4.  Faça o primeiro commit:
    ```bash
    git commit -m "Commit inicial do JurisIntel Dashboard"
    ```
5.  Conecte seu repositório local ao repositório remoto que você criou no GitHub:
    ```bash
    # Substitua SEU_USUARIO e NOME_DO_SEU_REPOSITORIO pela URL correta do seu repo no GitHub
    git remote add origin https://github.com/SEU_USUARIO/NOME_DO_SEU_REPOSITORIO.git
    ```
6.  Envie seus arquivos para o GitHub:
    ```bash
    git push -u origin main
    ```

Agora seu código estará no GitHub! Lembre-se do aviso sobre a chave de API: não envie sua chave diretamente no código para um repositório público.

## Estrutura do Projeto (Visão Geral)

```
jurisintel-dashboard/
├── README.md                   # Este arquivo
├── index.html                  # Ponto de entrada HTML principal
├── index.tsx                   # Ponto de entrada do React
├── App.tsx                     # Componente principal da aplicação
├── metadata.json               # Metadados da aplicação
├── services/
│   └── geminiService.ts        # Lógica para interagir com a API Gemini
├── components/                 # Componentes React reutilizáveis
│   ├── SearchBar.tsx
│   ├── Tabs.tsx
│   ├── Card.tsx
│   ├── LoadingSpinner.tsx
│   ├── DashboardSection.tsx
│   ├── GuidanceSection.tsx
│   ├── PromptGeneratorSection.tsx
│   └── Icons.tsx               # Componentes de ícones SVG
└── types.ts                    # Definições de tipos TypeScript
```

## Contribuições

Contribuições são bem-vindas! Se você tiver sugestões ou melhorias, sinta-se à vontade para abrir uma *issue* ou um *pull request* (se aplicável ao seu fluxo de trabalho).

## Licença

Este projeto pode ser distribuído sob a licença MIT (ou outra de sua escolha). Adicione um arquivo `LICENSE` se desejar especificar uma.
```