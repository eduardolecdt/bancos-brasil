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
| `agibank`       | `#FFFFFF` | `#0133B0` |
| `asaas`         | `#FFFFFF` | `#0036E1` |
| `avenue`        | `#FFFFFF` | `#002820` |
| `bancodobrasil` | `#FFDD00` | `#003D7A` |
| `bmg`           | `#FFFFFF` | `#F26321` |
| `bradesco`      | `#FFFFFF` | `#CC092F` |
| `bs2`           | `#FFFFFF` | `#0021AF` |
| `btg`           | `#FFFFFF` | `#001E62` |
| `bv`            | `#223AD2` | `#FFFFFF` |
| `c6`            | `#FFFFFF` | `#121212` |
| `caixa`         | `#FFFFFF` | `#0066A1` |
| `cora`          | `#FFFFFF` | `#FE3E6D` |
| `digio`         | `#FFFFFF` | `#00275C` |
| `efibank`       | `#F37025` | `#000000` |
| `infinitepay`   | `#7DDB13` | `#171527` |
| `inter`         | `#FFFFFF` | `#FF7A00` |
| `itau`          | `#FFFFFF` | `#EC7000` |
| `iugu`          | `#000000` | `#FFFFFF` |
| `mercadopago`   | `#0A0080` | `#00BCFF` |
| `mercantil`     | `#FFFFFF` | `#1526FF` |
| `neon`          | `#01C4E0` | `#161C3E` |
| `next`          | `#000000` | `#00FF5F` |
| `ngcash`        | `#FFFFFF` | `#000000` |
| `nomad`         | `#000000` | `#FFCE04` |
| `nubank`        | `#FFFFFF` | `#820AD1` |
| `original`      | `#FFFFFF` | `#00A857` |
| `pagbank`       | `#000000` | `#42A936` |
| `pan`           | `#414141` | `#FFFFFF` |
| `paypal`        | `#222D65` | `#FFFFFF` |
| `picpay`        | `#FFFFFF` | `#21C25E` |
| `revolut`       | `#FFFFFF` | `#000000` |
| `rico`          | `#FF5200` | `#010042` |
| `safra`         | `#C3AC6C` | `#151D43` |
| `santander`     | `#FFFFFF` | `#EC0000` |
| `sicoob`        | `#B8D335` | `#003B43` |
| `sicredi`       | `#3DAE2B` | `#FFFFFF` |
| `stone`         | `#00A868` | `#FFFFFF` |
| `stripe`        | `#FFFFFF` | `#635BFF` |
| `ton`           | `#FFFFFF` | `#0DEA4A` |
| `wise`          | `#163300` | `#9FE870` |
| `xp`            | `#000000` | `#FFFFFF` |

## Formatos

- **`quadrado`** - Quadrado com bordas arredondadas (padrão)
- **`circulo`** - Circular
- **`sem`** - Sem fundo, apenas o ícone

## Licença

MIT © [Lecdt.com](https://lecdt.com)

---

**Desenvolvido por [@edusites](https://instagram.com/edusites) na [Lecdt.com](https://lecdt.com)**
