import { ICONES } from './icones.js'

const PRESETS = {
  nubank: {
    cor: '#FFFFFF',
    fundo: '#820AD1',
    formato: 'quadrado',
    tamanho: 64
  },
  cora: {
    cor: '#FFFFFF',
    fundo: '#FE3E6D',
    formato: 'quadrado',
    tamanho: 64
  },
  itau: {
    cor: '#FFFFFF',
    fundo: '#EC7000',
    formato: 'quadrado',
    tamanho: 64
  },
  inter: {
    cor: '#FFFFFF',
    fundo: '#FF7A00',
    formato: 'quadrado',
    tamanho: 64
  },
  bancodobrasil: {
    cor: '#FFDD00',
    fundo: '#003D7A',
    formato: 'quadrado',
    tamanho: 64
  },
  bradesco: {
    cor: '#FFFFFF',
    fundo: '#CC092F',
    formato: 'quadrado',
    tamanho: 64
  },
  santander: {
    cor: '#FFFFFF',
    fundo: '#EC0000',
    formato: 'quadrado',
    tamanho: 64
  },
  caixa: {
    cor: '#FFFFFF',
    fundo: '#0066A1',
    formato: 'quadrado',
    tamanho: 64
  },
  btg: {
    cor: '#FFFFFF',
    fundo: '#000000',
    formato: 'quadrado',
    tamanho: 64
  },
  xp: {
    cor: '#1D1D1B',
    fundo: '#FFED00',
    formato: 'quadrado',
    tamanho: 64
  }
}

function normalizarNome(nome) {
  return String(nome).toLowerCase().trim()
}

function obterIcone(nome) {
  return ICONES[nome] || null
}

function criarFundo(formato, tamanho, corFundo) {
  const borderRadius = formato === 'quadrado' ? tamanho * 0.15 : 0

  if (formato === 'circulo') {
    return `<circle cx="${tamanho / 2}" cy="${tamanho / 2}" r="${tamanho / 2}" fill="${corFundo}"/>`
  } else if (formato === 'quadrado') {
    return `<rect width="${tamanho}" height="${tamanho}" rx="${borderRadius}" fill="${corFundo}"/>`
  }
  return ''
}

function aplicarCor(conteudoSVG, cor) {
  return conteudoSVG.replace(/fill="[^"]*"/g, `fill="${cor}"`)
}

function centralizarIcone(conteudoSVG, tamanhoOriginal, tamanhoFinal, padding = 0.2) {
  const escala = 1 - padding
  const offset = (tamanhoFinal * padding) / 2

  return `<g transform="translate(${offset}, ${offset}) scale(${(escala * tamanhoFinal) / tamanhoOriginal})">${conteudoSVG}</g>`
}

export function svgBanco(options) {
  const { nome, cor, fundo, formato, tamanho, className } = options

  const nomeNormalizado = normalizarNome(nome)

  const preset = PRESETS[nomeNormalizado] || {
    cor: '#FFFFFF',
    fundo: '#000000',
    formato: 'quadrado',
    tamanho: 64
  }

  const config = {
    cor: cor || preset.cor,
    fundo: fundo || preset.fundo,
    formato: formato || preset.formato,
    tamanho: tamanho || preset.tamanho
  }

  const iconeOriginal = obterIcone(nomeNormalizado)
  if (!iconeOriginal) return null

  let conteudoIcone = aplicarCor(iconeOriginal, config.cor)
  conteudoIcone = centralizarIcone(conteudoIcone, 108, config.tamanho)

  const elementoFundo = config.formato !== 'sem' ? criarFundo(config.formato, config.tamanho, config.fundo) : ''

  const classAttr = className ? ` class="${className}"` : ''
  return `<svg width="${config.tamanho}" height="${config.tamanho}" viewBox="0 0 ${config.tamanho} ${config.tamanho}" fill="none" xmlns="http://www.w3.org/2000/svg"${classAttr}>${elementoFundo}${conteudoIcone}</svg>`
}

export function listarBancos() {
  return Object.keys(PRESETS)
}

export function obterPreset(nome) {
  const nomeNormalizado = normalizarNome(nome)
  return PRESETS[nomeNormalizado] || null
}

export { default as SvgBanco } from './SvgBanco.vue'

export default svgBanco
