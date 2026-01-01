<script setup>
import { svgBanco } from './index.js'
import { ref, watchEffect } from 'vue'

const props = defineProps({
  nome: { type: String, required: true },
  formato: String,
  cor: String,
  fundo: String,
  tamanho: Number
})

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
</script>

<template>
  <div v-html="svg"></div>
</template>
