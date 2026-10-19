// Testes em node puro: node test/lib.test.mjs
import assert from 'node:assert/strict'
import { readdirSync } from 'node:fs'
import * as core from '../src/core.js'
import { precarregar } from '../src/resolvedor.js'

const { svgBanco, svgBancoSync, svgBancoAsync, viewBoxDoBanco, listarBancos, obterPreset } = core
import { ICONES } from '../src/icones.js'
import { temGlob } from '../src/resolvedor.js'

let ok = 0
const teste = async (nome, fn) => {
  try {
    await fn()
    ok++
  } catch (e) {
    console.error(`✗ ${nome}\n  ${e.message}`)
    process.exitCode = 1
  }
}

const nomes = Object.keys(ICONES)

await teste('fora do Vite não há glob (cai no monolítico)', () => assert.equal(temGlob(), false))

await teste('svgBanco é síncrono no node e devolve string', () => {
  const svg = svgBanco({ nome: 'nubank' })
  assert.equal(typeof svg, 'string')
  assert.match(svg, /^<svg width="64" height="64" viewBox="0 0 64 64"/)
  assert.match(svg, /fill="#820AD1"/)
})

await teste('nome sem diferenciar maiúscula e espaços', () => assert.equal(svgBanco({ nome: '  NuBank ' }), svgBanco({ nome: 'nubank' })))

await teste('opções sobrescrevem o preset', () => {
  const svg = svgBanco({ nome: 'itau', cor: '#111111', fundo: '#222222', formato: 'circulo', tamanho: 40, className: 'x' })
  assert.match(svg, /width="40"/)
  assert.match(svg, /<circle cx="20" cy="20" r="20" fill="#222222"\/>/)
  assert.match(svg, /fill="#111111"/)
  assert.match(svg, /class="x"/)
})

await teste('formato "sem" não desenha fundo', () => {
  const svg = svgBanco({ nome: 'inter', formato: 'sem' })
  assert.doesNotMatch(svg, /<rect|<circle cx="32"/)
})

await teste('svgBancoAsync dá o mesmo resultado do síncrono', async () => {
  for (const nome of nomes) assert.equal(await svgBancoAsync({ nome }), svgBanco({ nome }), nome)
})

await teste('banco inexistente: null nas duas versões', async () => {
  assert.equal(svgBanco({ nome: 'banco-que-nao-existe' }), null)
  assert.equal(await svgBancoAsync({ nome: 'banco-que-nao-existe' }), null)
  assert.equal(svgBanco({ nome: '' }), null)
  assert.equal(svgBanco({}), null)
})

await teste('svgBancoSync dá a string na hora no node e null para inexistente', () => {
  for (const nome of nomes) assert.equal(svgBancoSync({ nome }), svgBanco({ nome }), nome)
  assert.equal(svgBancoSync({ nome: 'nao-existe' }), null)
})

await teste('await svgBanco(...) (padrão do README) continua funcionando', async () => {
  assert.equal(await svgBanco({ nome: 'cora' }), svgBanco({ nome: 'cora' }))
})

await teste('viewBoxDoBanco devolve o viewBox original', () => {
  assert.match(viewBoxDoBanco('nubank'), /^\d+(\.\d+)? \d+(\.\d+)? \d+(\.\d+)? \d+(\.\d+)?$/)
  assert.equal(viewBoxDoBanco('nao-existe'), null)
})

await teste('precarregar resolve sem erro', async () => {
  await precarregar(['nubank', 'cora', 'nao-existe'])
})

await teste('listarBancos traz os 41 bancos, todos com SVG', () => {
  const lista = listarBancos()
  assert.equal(lista.length, 41)
  for (const nome of lista) assert.ok(ICONES[nome], nome)
})

await teste('obterPreset', () => {
  assert.deepEqual(obterPreset('Nubank'), { cor: '#FFFFFF', fundo: '#820AD1', formato: 'quadrado', tamanho: 64 })
  assert.equal(obterPreset('nao-existe'), null)
})

await teste('cada arquivo de src/bancos bate com o monolítico', async () => {
  const arquivos = readdirSync(new URL('../src/bancos/', import.meta.url)).filter((a) => a.endsWith('.js'))
  assert.equal(arquivos.length, nomes.length)
  for (const arquivo of arquivos) {
    const nome = arquivo.slice(0, -3)
    const mod = await import(`../src/bancos/${arquivo}`)
    assert.equal(mod.default, ICONES[nome], nome)
  }
})

await teste('entrada ./core não depende de vue', () => {
  assert.equal(typeof core.svgBanco, 'function')
  assert.equal(typeof core.svgBancoAsync, 'function')
})

console.log(process.exitCode ? `\n${ok} passaram, houve falhas` : `\n✓ ${ok} testes passaram`)
