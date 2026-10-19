import { defineComponent, ref, watchEffect, h } from 'vue'
import { svgBancoSync, svgBancoAsync, viewBoxDoBanco } from './core.js'

export default defineComponent({
  name: 'SvgBanco',
  props: {
    nome: { type: String, required: true },
    formato: String,
    cor: String,
    fundo: String,
    tamanho: Number
  },
  setup(props) {
    const opcoes = () => ({
      nome: props.nome,
      formato: props.formato,
      cor: props.cor,
      fundo: props.fundo,
      tamanho: props.tamanho
    })

    // Tenta SÍNCRONO já na criação: no SSR (e no cliente quando o banco já está em cache, ex.: veio
    // do HTML do servidor) o SVG sai na hora — entra no HTML renderizado e não pisca na hidratação.
    const svg = ref(svgBancoSync(opcoes()) || '')

    // No cliente, se o síncrono não resolveu (arquivo do banco ainda não baixado) ou as props mudaram,
    // carrega sob demanda e atualiza. Só aplica se ainda for o mesmo banco (evita corrida).
    watchEffect(async () => {
      const atual = opcoes()
      const sincrono = svgBancoSync(atual)
      if (sincrono) {
        svg.value = sincrono
        return
      }
      const resultado = await svgBancoAsync(atual)
      if (props.nome === atual.nome) svg.value = resultado || ''
    })

    return () => {
      // Mesmo <div> de sempre. Enquanto o SVG não chega, o placeholder reserva o tamanho final
      // (evita layout shift enquanto o arquivo do banco carrega).
      const tamanho = props.tamanho || 64
      const attrs = { 'data-banco': String(props.nome || '').toLowerCase().trim() }

      if (!svg.value) return h('div', { ...attrs, style: `width:${tamanho}px;height:${tamanho}px` })

      // viewBox original: deixa o cliente reconstruir o banco a partir do HTML do SSR, sem baixar de novo
      const viewBox = viewBoxDoBanco(props.nome)
      if (viewBox) attrs['data-banco-viewbox'] = viewBox
      return h('div', { ...attrs, innerHTML: svg.value })
    }
  }
})
