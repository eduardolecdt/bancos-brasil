// Resolvedor do SVG bruto de cada banco — mesma arquitetura do @edusites/icons 1.12.0.
//
// O dilema: com `<SvgBanco nome="nubank">` (nome dinâmico em runtime) não dá para ter, ao mesmo
// tempo, resolução síncrona, tree-shaking e nome dinâmico — o bundler não sabe o nome no build.
// A saída é separar por ambiente:
//
// - SERVIDOR (SSR/Node): o peso não vai pro cliente, então carregamos TODOS os bancos do monolítico
//   e resolvemos SÍNCRONO. `svgBanco()` continua devolvendo a string na hora (retrocompatível) e o
//   SVG entra no HTML do SSR.
//
// - CLIENTE: `import.meta.glob` LAZY — cada banco é um chunk separado, baixado sob demanda. Com o
//   plugin `@edusites/bancos-brasil/vite` (ou o módulo Nuxt), só os bancos citados no código entram
//   no build. Os já desenhados pelo SSR chegam quentes no cache (lidos do HTML).

// ---- Detecção de ambiente ----
function ehServidor() {
  try {
    if (typeof import.meta !== 'undefined' && typeof import.meta.server !== 'undefined') {
      return import.meta.server
    }
  } catch {
    /* noop */
  }
  return typeof window === 'undefined'
}

// ---- Glob lazy (só resolvido pelo Vite; null fora dele) ----
// Chamada DIRETA, sem testar `typeof import.meta.glob` antes: o Vite troca a CHAMADA pelo mapa dos
// bancos no build, mas deixa o `typeof` como está — e no navegador `import.meta.glob` não existe,
// então o teste daria sempre falso e o cliente cairia no monolítico. Fora do Vite a chamada lança
// (import.meta.glob é undefined) e o catch segue com o fallback.
// O plugin `@edusites/bancos-brasil/vite` troca esta linha, no build, por um mapa só com os bancos usados.
let GLOB = null
try {
  GLOB = import.meta.glob('./bancos/*.js')
} catch {
  GLOB = null
}

const CACHE_BRUTO = new Map()

// ---- Monolítico (servidor / fallback sem Vite) ----
// Import DINÂMICO: nunca entra no bundle do cliente Vite (o plugin troca por um objeto vazio).
let monoliticoSync = null
let promessaMono = null

function carregarMonoAsync() {
  if (monoliticoSync) return Promise.resolve(monoliticoSync)
  if (!promessaMono) {
    promessaMono = import('./icones.js').then((mod) => {
      monoliticoSync = mod.ICONES
      return monoliticoSync
    })
  }
  return promessaMono
}

// No servidor carrega bloqueante (top-level await) para `svgBanco()` síncrono funcionar já na
// primeira chamada — sem custo para o cliente, porque o import é dinâmico.
if (ehServidor()) {
  try {
    await carregarMonoAsync()
  } catch {
    /* segue com fallback async */
  }
}

function chaveGlob(nome) {
  return `./bancos/${nome}.js`
}

export function temGlob() {
  return GLOB !== null
}

// ---- Hidratação: recupera do DOM os bancos que o SSR já desenhou ----
// O SVG final tem fundo e escala, mas o desenho do banco está inteiro no <g> de dentro (sem os
// `fill`, que o render remove de qualquer jeito). Com o viewBox original, que o componente grava em
// `data-banco-viewbox`, dá para reconstruir o bruto e o cliente não baixa de novo o que já está na tela.
// Roda uma vez só: varrer o documento a cada resolução trava o renderer.
let semeadoDoDom = false

function semearDoDom() {
  if (semeadoDoDom || typeof document === 'undefined') return
  semeadoDoDom = true
  try {
    for (const no of document.querySelectorAll('[data-banco][data-banco-viewbox]')) {
      const nome = no.getAttribute('data-banco')
      const grupo = no.querySelector('svg > g')
      if (!nome || !grupo || CACHE_BRUTO.has(nome)) continue
      CACHE_BRUTO.set(nome, `<svg viewBox="${no.getAttribute('data-banco-viewbox')}" xmlns="http://www.w3.org/2000/svg">${grupo.innerHTML}</svg>`)
    }
  } catch {
    /* DOM indisponível: segue pelo caminho async normal */
  }
}

// ---- Resolução assíncrona (caminho universal) ----
export async function resolverBruto(nome) {
  if (CACHE_BRUTO.has(nome)) return CACHE_BRUTO.get(nome)

  if (!ehServidor()) {
    semearDoDom()
    if (CACHE_BRUTO.has(nome)) return CACHE_BRUTO.get(nome)
  }

  let bruto = null
  // "Este banco não existe" é diferente de "não consegui carregar agora": só o primeiro é estável.
  let inexistente = false

  if (ehServidor() || !GLOB) {
    const icones = await carregarMonoAsync()
    bruto = (icones && icones[nome]) || null
    // No servidor o monolítico é a fonte completa; no cliente sem glob pode ser o stub vazio do bundle.
    inexistente = ehServidor() && !!icones && !bruto
  } else {
    const carregar = GLOB[chaveGlob(nome)]
    if (carregar) {
      const mod = await carregar()
      bruto = (mod && mod.default) || null
    } else {
      // Fora do mapa = arquivo não existe (ou não foi incluído no build): ausência confirmada.
      inexistente = true
    }
  }

  // Cacheia sucesso e ausência confirmada, nunca a falha: um tropeço de rede não pode virar permanente.
  if (bruto || inexistente) CACHE_BRUTO.set(nome, bruto)
  return bruto
}

// ---- Resolução síncrona (retrocompatível com svgBanco) ----
// Servidor: resolve de verdade a partir do monolítico já em memória.
// Cliente: devolve do cache (quente via SSR) ou null, disparando o carregamento async.
export function resolverBrutoSync(nome) {
  if (CACHE_BRUTO.has(nome)) return CACHE_BRUTO.get(nome)

  if (!ehServidor()) {
    semearDoDom()
    if (CACHE_BRUTO.has(nome)) return CACHE_BRUTO.get(nome)
  }

  // A guarda `ehServidor()` é essencial: no cliente o monolítico é um stub vazio (`{}` é truthy) e
  // cachear o null aqui mataria o banco pelo resto da sessão.
  if (ehServidor() && monoliticoSync) {
    const bruto = monoliticoSync[nome] || null
    if (bruto) CACHE_BRUTO.set(nome, bruto)
    return bruto
  }

  resolverBruto(nome).catch(() => {})
  return null
}

// Ausência CONFIRMADA (não "ainda não carregou"): já cacheado como inexistente, ou o servidor tem o
// monolítico completo e o banco não está nele.
export function bancoAusente(nome) {
  if (CACHE_BRUTO.has(nome)) return CACHE_BRUTO.get(nome) === null
  return ehServidor() && !!monoliticoSync && !monoliticoSync[nome]
}

// Pré-carrega bancos (útil para garantir `svgBanco()` síncrono no cliente).
export async function precarregar(nomes) {
  const lista = Array.isArray(nomes) ? nomes : [nomes]
  await Promise.all(lista.map((n) => resolverBruto(n)))
}

// Semeia o cache a partir de dados externos (ex.: payload de hidratação).
export function semear(mapa) {
  if (!mapa) return
  for (const nome of Object.keys(mapa)) {
    if (!CACHE_BRUTO.has(nome)) CACHE_BRUTO.set(nome, mapa[nome])
  }
}
