import { defineComponent, ref, watchEffect, h } from 'vue'
import { svgBanco } from './core.js'

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
    const svg = ref('')

    watchEffect(() => {
      svg.value =
        svgBanco({
          nome: props.nome,
          formato: props.formato,
          cor: props.cor,
          fundo: props.fundo,
          tamanho: props.tamanho
        }) || ''
    })

    return () => h('div', { innerHTML: svg.value })
  }
})
