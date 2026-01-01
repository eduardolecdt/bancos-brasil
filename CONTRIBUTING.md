# Contribuindo

Obrigado por considerar contribuir com `@edusites/bancos-brasil`!

## Como Contribuir

### Adicionar Novo Banco

1. Adicione o SVG em `icons/{nome}.svg`

   - Nome em lowercase
   - ViewBox: `0 0 108 108` (ou similar)
   - Use apenas `fill` para cores

2. Adicione o preset em `src/index.js`:

```javascript
const PRESETS = {
  // ...
  novobanco: {
    cor: '#FFFFFF',
    fundo: '#000000',
    formato: 'quadrado',
    tamanho: 64
  }
}
```

3. Atualize o README.md

### Pull Request

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/novo-banco`
3. Commit: `git commit -m 'feat: adiciona banco XYZ'`
4. Push: `git push origin feature/novo-banco`
5. Abra um Pull Request

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob MIT License.
