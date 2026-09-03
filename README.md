# Clareza — Análise SWOT

SPA para organizar uma análise SWOT em quatro perspectivas: Strengths, Opportunities, Weaknesses e Threats.

## Executar

```bash
npm install
npm run dev
```

A aplicação salva os itens automaticamente no `localStorage` do navegador e permite exportar a matriz em JSON.

## Publicar no GitHub Pages

1. Crie um repositório vazio no GitHub.
2. No terminal, dentro desta pasta, execute:

```bash
git init
git add .
git commit -m "Cria sistema de analise SWOT"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
git push -u origin main
```

3. No GitHub, abra **Settings > Pages**, selecione **GitHub Actions** em *Build and deployment*.
4. Aguarde o workflow terminar na aba **Actions**. O endereço publicado aparecerá em **Settings > Pages**.
