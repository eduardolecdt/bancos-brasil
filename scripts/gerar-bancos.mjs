// Gera src/bancos/<nome>.js (um arquivo por banco) a partir do monolítico src/icones.js.
// Rodar sempre que um banco for adicionado ou alterado em icones.js: node scripts/gerar-bancos.mjs
import { writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs'
import { ICONES } from '../src/icones.js'

const pasta = new URL('../src/bancos/', import.meta.url)
mkdirSync(pasta, { recursive: true })
for (const antigo of readdirSync(pasta)) if (antigo.endsWith('.js')) unlinkSync(new URL(antigo, pasta))

const escapar = (svg) => svg.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
for (const [nome, svg] of Object.entries(ICONES)) {
  writeFileSync(new URL(`${nome}.js`, pasta), `export default \`${escapar(svg)}\`\n`)
}
console.log(`${Object.keys(ICONES).length} bancos em src/bancos/`)
