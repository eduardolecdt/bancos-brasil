// Módulo Nuxt: registra <SvgBanco> no app inteiro e liga o plugin Vite que leva para o build só os
// bancos que o site usa. Uso: modules: ['@edusites/bancos-brasil/nuxt-module']
import { fileURLToPath } from 'node:url'
import { edusitesBancosVite } from './vite.js'

export default function edusitesBancosModule(opcoesInline = {}, nuxt) {
  const opcoes = { ...(nuxt.options.edusitesBancos || {}), ...(opcoesInline || {}) }
  nuxt.options.plugins.push(fileURLToPath(new URL('./runtime-plugin.js', import.meta.url)))
  nuxt.hook('vite:extendConfig', (config) => {
    config.plugins = config.plugins || []
    config.plugins.push(edusitesBancosVite({ raiz: nuxt.options.rootDir, incluir: opcoes.incluir || [] }))
  })
}

edusitesBancosModule.meta = { name: '@edusites/bancos-brasil', configKey: 'edusitesBancos' }
