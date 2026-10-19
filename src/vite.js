// Plugin Vite: no BUILD, o bundle só leva os bancos que o projeto usa.
//
// Sem ele, o `import.meta.glob('./bancos/*.js')` do resolvedor vira um arquivo por banco (e o Nuxt
// manda o navegador pré-carregar todos com rel="prefetch"), e o monolítico também é emitido. Com ele:
//
// 1. Varre o código do projeto (vue, js, ts, json, md...) atrás de textos entre aspas que sejam nomes
//    de banco ("nubank", 'itau') e troca o glob por um mapa só com esses. Pega `nome="nubank"` no
//    template e também listas de dados (`{ banco: 'inter' }`).
// 2. No bundle do NAVEGADOR, troca o import do monolítico por um objeto vazio: o cliente resolve pelo
//    HTML do SSR e pelos arquivos individuais, nunca pelo monolítico.
//
// Nome montado em tempo de execução não aparece no código: passe em `incluir`.
// No `dev` nada muda (o glob completo continua, sem varredura a cada arquivo salvo).
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, extname, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const PASTA_BANCOS = fileURLToPath(new URL('./bancos/', import.meta.url))
const GLOB_ORIGINAL = "import.meta.glob('./bancos/*.js')"
const MONOLITICO_ORIGINAL = "import('./icones.js')"

const EXTENSOES = new Set(['.vue', '.js', '.mjs', '.cjs', '.ts', '.mts', '.cts', '.jsx', '.tsx', '.json', '.md', '.mdx', '.html', '.svelte'])
const PASTAS_FORA = new Set(['node_modules', '.nuxt', '.output', '.data', '.git', 'dist', '.cache', '.vercel', '.netlify', 'coverage'])
const LIMITE_ARQUIVO = 2 * 1024 * 1024
const TEXTO_ENTRE_ASPAS = /["'`]([a-zA-Z0-9]+)["'`]/g

function nomesDaLib() {
  return new Set(readdirSync(PASTA_BANCOS).filter((arquivo) => arquivo.endsWith('.js')).map((arquivo) => arquivo.slice(0, -3)))
}

// Arquivos de código do projeto (sem dependências, builds e pastas ocultas)
function arquivosDoProjeto(raiz) {
  const lista = []
  const visitar = (pasta) => {
    let entradas
    try {
      entradas = readdirSync(pasta, { withFileTypes: true })
    } catch {
      return
    }
    for (const entrada of entradas) {
      if (entrada.isSymbolicLink()) continue
      const caminho = join(pasta, entrada.name)
      if (entrada.isDirectory()) {
        if (!PASTAS_FORA.has(entrada.name) && !entrada.name.startsWith('.')) visitar(caminho)
      } else if (EXTENSOES.has(extname(entrada.name))) {
        lista.push(caminho)
      }
    }
  }
  visitar(raiz)
  return lista
}

// Bancos usados no projeto: textos entre aspas que existem na lib (sem diferenciar maiúscula), mais os de `incluir`
export function bancosUsados(raiz, { incluir = [] } = {}) {
  const existentes = nomesDaLib()
  const usados = new Set()
  for (const nome of incluir) {
    const n = String(nome).toLowerCase().trim()
    if (existentes.has(n)) usados.add(n)
  }
  for (const arquivo of arquivosDoProjeto(raiz)) {
    let texto
    try {
      if (statSync(arquivo).size > LIMITE_ARQUIVO) continue
      texto = readFileSync(arquivo, 'utf8')
    } catch {
      continue
    }
    for (const achado of texto.matchAll(TEXTO_ENTRE_ASPAS)) {
      const n = achado[1].toLowerCase()
      if (existentes.has(n)) usados.add(n)
    }
  }
  return [...usados].sort()
}

function mapaDoGlob(nomes) {
  const linhas = nomes.map((nome) => `${JSON.stringify(`./bancos/${nome}.js`)}: () => import(${JSON.stringify(`./bancos/${nome}.js`)})`)
  return `({${linhas.join(',')}})`
}

const ehResolvedorDaLib = (id) => {
  const limpo = id.split('?')[0].split(sep).join('/')
  return limpo.endsWith('/src/resolvedor.js') && (limpo.includes('@edusites/bancos-brasil/') || limpo.includes('bancos-brasil/'))
}

export function edusitesBancosVite(opcoes = {}) {
  let raiz = opcoes.raiz || null
  let usados = null

  return {
    name: 'edusites-bancos-brasil',
    apply: 'build',
    // Antes do vite:import-glob, que transformaria o glob completo
    enforce: 'pre',
    configResolved(config) {
      raiz = raiz || config.root
    },
    buildStart() {
      usados = bancosUsados(raiz, { incluir: opcoes.incluir || [] })
    },
    transform(codigo, id, transformacao) {
      if (!ehResolvedorDaLib(id) || !codigo.includes(GLOB_ORIGINAL)) return null
      usados = usados || bancosUsados(raiz, { incluir: opcoes.incluir || [] })
      let resultado = codigo.replace(GLOB_ORIGINAL, mapaDoGlob(usados))
      // Bundle do navegador: sem o monolítico (o servidor continua com ele para o SSR síncrono)
      if (!transformacao?.ssr) resultado = resultado.replace(MONOLITICO_ORIGINAL, 'Promise.resolve({ ICONES: {} })')
      return { code: resultado, map: null }
    }
  }
}

export default edusitesBancosVite
