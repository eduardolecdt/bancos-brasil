# Changelog

## 1.3.0

### O problema

`core.js` importava estaticamente o `icones.js` (os 41 bancos, 112 KB). Quem usava um banco só levava os 41 para o navegador, dentro do bundle principal.

Medido num app Nuxt com 4 bancos (`ssr: false`, versão 1.2.0 do npm): **253 KB** de JS baixado, maior arquivo com **155 KB**.

### A correção

Mesma arquitetura do `@edusites/icons` 1.12.0:

- **Um arquivo por banco** em `src/bancos/<nome>.js`. `node scripts/gerar-bancos.mjs` gera tudo a partir do `icones.js`.
- **Resolvedor** (`src/resolvedor.js`):
  - No navegador, cada banco é baixado sob demanda por `import.meta.glob`, chamado direto, sem testar `typeof`, que o Vite não troca.
  - No servidor o monolítico continua carregado, então tudo resolve na hora.
  - Na hidratação, o cliente reaproveita o SVG que o SSR já desenhou (`data-banco` + `data-banco-viewbox`).
  - O cache guarda sucesso e ausência confirmada, nunca falha de rede.
- **`@edusites/bancos-brasil/vite`**: no build, troca o glob por um mapa só com os bancos citados no código (mais `incluir`). No bundle do navegador, o monolítico vira um objeto vazio.
- **`@edusites/bancos-brasil/nuxt-module`**: registra `<SvgBanco>` e liga o plugin. Configuração em `edusitesBancos: { incluir: [] }`.
- **`@edusites/bancos-brasil/nuxt`**: `instalarBancos(nuxtApp)`, para quem prefere um plugin próprio.
- **`@edusites/bancos-brasil/core`**: entrada sem Vue.

Mesmo app, com o módulo: **169 KB** de JS baixado (−33%), maior arquivo com **84 KB**. Só os 4 bancos usados vão para o build e para o `prefetch`.

Com SSR, os 4 SVGs saem no HTML do servidor. O cliente não importa os arquivos dos bancos na hidratação e não há aviso de divergência.

### Compatibilidade

- `svgBanco()` devolve a string na hora quando o banco está em memória: sempre no servidor/Node, e no navegador depois do SSR ou do primeiro carregamento. Fora disso devolve uma Promise da string, então o `await svgBanco(...)` do README continua funcionando. A saída é idêntica à da 1.2.0 nos 41 bancos.
- Novos: `svgBancoAsync()` (sempre Promise), `svgBancoSync()` (string ou `null`, nunca Promise), `viewBoxDoBanco()` e `precarregar()`.
- `<SvgBanco>` mantém as mesmas props e o mesmo `<div>`. Enquanto o banco carrega, o placeholder tem o tamanho final.
- `files` do pacote: saiu a pasta `icons`, que não existia.
- `vue` virou peer dependency opcional.
