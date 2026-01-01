# @edusites/bancos-brasil

[![NPM Version](https://img.shields.io/npm/v/@edusites/bancos-brasil)](https://www.npmjs.com/package/@edusites/bancos-brasil)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Biblioteca JavaScript para renderizar ícones SVG de bancos brasileiros com total customização.

## Instalação

```bash
npm install @edusites/bancos-brasil
```

```bash
yarn add @edusites/bancos-brasil
```

```bash
pnpm add @edusites/bancos-brasil
```

## Uso

### JavaScript Puro

```javascript
import { svgBanco } from '@edusites/bancos-brasil'

// Com preset (configuração padrão)
const svg = await svgBanco({ nome: 'nubank' })
document.getElementById('app').innerHTML = svg

// Customizado
const svg = await svgBanco({
  nome: 'cora',
  formato: 'circulo',
  cor: '#FFFFFF',
  fundo: '#FE3E6D',
  tamanho: 96
})
```

### React

```jsx
import { svgBanco } from '@edusites/bancos-brasil'
import { useEffect, useState } from 'react'

function BancoIcon({ nome, formato, cor, fundo, tamanho }) {
  const [svg, setSvg] = useState('')

  useEffect(() => {
    svgBanco({ nome, formato, cor, fundo, tamanho }).then(setSvg)
  }, [nome, formato, cor, fundo, tamanho])

  return <div dangerouslySetInnerHTML={{ __html: svg }} />
}

// Uso
export default function App() {
  return (
    <div>
      <BancoIcon nome="nubank" />
      <BancoIcon nome="cora" formato="circulo" />
      <BancoIcon nome="itau" cor="#FFFFFF" fundo="#EC7000" tamanho={96} />
    </div>
  )
}
```

### Vue 3 / Nuxt 3

Crie o componente `SvgBanco.vue`:

```vue
<script setup>
import { svgBanco } from '@edusites/bancos-brasil'
import { ref, watchEffect } from 'vue'

const props = defineProps({
  nome: { type: String, required: true },
  formato: String,
  cor: String,
  fundo: String,
  tamanho: Number
})

const svg = ref('')

watchEffect(async () => {
  svg.value = await svgBanco({
    nome: props.nome,
    formato: props.formato,
    cor: props.cor,
    fundo: props.fundo,
    tamanho: props.tamanho
  })
})
</script>

<template>
  <div v-html="svg"></div>
</template>
```

**Uso no template:**

```vue
<template>
  <div>
    <SvgBanco nome="nubank" />
    <SvgBanco nome="cora" formato="circulo" />
    <SvgBanco nome="itau" cor="#FFFFFF" fundo="#EC7000" :tamanho="96" />
  </div>
</template>
```

### Svelte

Crie o componente `SvgBanco.svelte`:

```svelte
<script>
  import { svgBanco } from "@edusites/bancos-brasil";

  export let nome;
  export let formato = undefined;
  export let cor = undefined;
  export let fundo = undefined;
  export let tamanho = undefined;

  let svg = "";

  $: svgBanco({ nome, formato, cor, fundo, tamanho }).then((s) => (svg = s));
</script>

{@html svg}
```

**Uso:**

```svelte
<SvgBanco nome="nubank" />
<SvgBanco nome="cora" formato="circulo" />
<SvgBanco nome="itau" cor="#FFFFFF" fundo="#EC7000" tamanho={96} />
```

## Parâmetros

| Propriedade | Tipo     | Obrigatório | Padrão       | Descrição                            |
| ----------- | -------- | ----------- | ------------ | ------------------------------------ |
| `nome`      | `string` | ✅ Sim      | -            | Nome do banco                        |
| `formato`   | `string` | ❌ Não      | `"quadrado"` | `"quadrado"`, `"circulo"` ou `"sem"` |
| `cor`       | `string` | ❌ Não      | Preset       | Cor do ícone (hex)                   |
| `fundo`     | `string` | ❌ Não      | Preset       | Cor de fundo (hex)                   |
| `tamanho`   | `number` | ❌ Não      | `64`         | Tamanho em pixels                    |
| `className` | `string` | ❌ Não      | -            | Classe CSS                           |

## Bancos Disponíveis

| Nome            | Cor Ícone | Cor Fundo |
| --------------- | --------- | --------- |
| `nubank`        | `#FFFFFF` | `#820AD1` |
| `cora`          | `#FFFFFF` | `#FE3E6D` |
| `itau`          | `#FFFFFF` | `#EC7000` |
| `inter`         | `#FFFFFF` | `#FF7A00` |
| `bancodobrasil` | `#FFDD00` | `#003D7A` |
| `bradesco`      | `#FFFFFF` | `#CC092F` |
| `santander`     | `#FFFFFF` | `#EC0000` |
| `caixa`         | `#FFFFFF` | `#0066A1` |
| `btg`           | `#FFFFFF` | `#000000` |
| `xp`            | `#1D1D1B` | `#FFED00` |

## Formatos

- **`quadrado`** - Quadrado com bordas arredondadas (padrão)
- **`circulo`** - Circular
- **`sem`** - Sem fundo, apenas o ícone

## Licença

MIT © [Lecdt.com](https://lecdt.com)

---

**Desenvolvido por [@edusites](https://instagram.com/edusites) na [Lecdt.com](https://lecdt.com)**
