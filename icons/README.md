# \u00cdcones SVG dos Bancos

Esta pasta cont\u00e9m os \u00edcones dos bancos brasileiros em formato SVG.

## Caracter\u00edsticas

- **Formato**: SVG (Scalable Vector Graphics)
- **Cor**: Customiz\u00e1vel via propriedade `currentColor`
- **Nomenclatura**: O nome do arquivo corresponde ao c\u00f3digo FEBRABAN do banco (ex: `001.svg` para Banco do Brasil)

## Como usar

### HTML direto

```html
<img src="001.svg" style="color: #FFDD00; width: 48px; height: 48px;" />
```

### Com a biblioteca

```typescript
import { obterIcone } from "@edusites/bancos-brasil";

const icone = obterIcone("001", { cor: "#FFDD00", width: 48, height: 48 });
```

## Customiza\u00e7\u00e3o de cores

Todos os \u00edcones usam `currentColor` como preenchimento, permitindo que voc\u00ea altere a cor facilmente:

- Via CSS: `color: #FFDD00`
- Via atributo style: `style="color: #FFDD00"`
- Via biblioteca: `{ cor: '#FFDD00' }`

## Lista de \u00edcones dispon\u00edveis

| C\u00f3digo | Banco           | Arquivo   |
| ----------- | --------------- | --------- |
| 001         | Banco do Brasil | `001.svg` |
| 033         | Santander       | `033.svg` |
| 104         | Caixa           | `104.svg` |
| 237         | Bradesco        | `237.svg` |
| 341         | Ita\u00fa       | `341.svg` |
| 260         | Nubank          | `260.svg` |
| 077         | Inter           | `077.svg` |

## Contribuindo

Para adicionar novos \u00edcones:

1. Use o c\u00f3digo FEBRABAN como nome do arquivo (ex: `237.svg`)
2. Certifique-se de usar `fill="currentColor"` no SVG
3. Mantenha o viewBox como `0 0 24 24` para consist\u00eancia
4. Adicione o banco na lista acima

---

Desenvolvido por **Lecdt.com** | @edusites
