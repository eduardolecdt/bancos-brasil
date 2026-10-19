import SvgBanco from './SvgBanco.js'

// Registro global sem o módulo (plugin próprio do projeto): funciona igual na tela, mas sem o plugin
// Vite o build gera um arquivo por banco (só os usados são baixados pelo visitante, os outros ficam como prefetch).
export function instalarBancos(nuxtApp) {
  nuxtApp.vueApp.component('SvgBanco', SvgBanco)
}

export default instalarBancos
