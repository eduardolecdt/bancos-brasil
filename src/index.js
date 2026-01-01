/**
 * @edusites/bancos-brasil - Versão Browser
 * Biblioteca JavaScript para renderizar ícones SVG de bancos brasileiros
 *
 * @author Eduardo Sites <edusites@lecdt.com>
 * @license MIT
 */

/**
 * Configurações padrão (preset) de cada banco
 */
const PRESETS = {
  nubank: {
    cor: "#FFFFFF",
    fundo: "#820AD1",
    formato: "quadrado",
    tamanho: 64,
  },
  cora: {
    cor: "#FFFFFF",
    fundo: "#FE3E6D",
    formato: "quadrado",
    tamanho: 64,
  },
  itau: {
    cor: "#FFFFFF",
    fundo: "#EC7000",
    formato: "quadrado",
    tamanho: 64,
  },
  inter: {
    cor: "#FFFFFF",
    fundo: "#FF7A00",
    formato: "quadrado",
    tamanho: 64,
  },
  bancodobrasil: {
    cor: "#FFDD00",
    fundo: "#003D7A",
    formato: "quadrado",
    tamanho: 64,
  },
  bradesco: {
    cor: "#FFFFFF",
    fundo: "#CC092F",
    formato: "quadrado",
    tamanho: 64,
  },
  santander: {
    cor: "#FFFFFF",
    fundo: "#EC0000",
    formato: "quadrado",
    tamanho: 64,
  },
  caixa: {
    cor: "#FFFFFF",
    fundo: "#0066A1",
    formato: "quadrado",
    tamanho: 64,
  },
  btg: {
    cor: "#FFFFFF",
    fundo: "#000000",
    formato: "quadrado",
    tamanho: 64,
  },
  xp: {
    cor: "#1D1D1B",
    fundo: "#FFED00",
    formato: "quadrado",
    tamanho: 64,
  },
};

/**
 * Cache de SVGs carregados
 */
const svgCache = {};

/**
 * Normaliza o nome do banco
 */
function normalizarNome(nome) {
  return String(nome).toLowerCase().trim();
}

/**
 * Carrega o SVG cru do banco via fetch
 */
async function carregarIcone(nome) {
  if (svgCache[nome]) {
    return svgCache[nome];
  }

  try {
    const response = await fetch(`./icons/${nome}.svg`);
    if (!response.ok) throw new Error("SVG não encontrado");
    const svg = await response.text();
    svgCache[nome] = svg;
    return svg;
  } catch (error) {
    console.error(`Ícone não encontrado: ${nome}`);
    return null;
  }
}

/**
 * Extrai o conteúdo interno do SVG (paths e shapes)
 */
function extrairConteudoSVG(svgString) {
  const match = svgString.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
  return match ? match[1].trim() : "";
}

/**
 * Cria o fundo conforme o formato especificado
 */
function criarFundo(formato, tamanho, corFundo) {
  const radius = formato === "circulo" ? tamanho / 2 : 0;
  const borderRadius = formato === "quadrado" ? tamanho * 0.15 : 0;

  if (formato === "circulo") {
    return `<circle cx="${tamanho / 2}" cy="${
      tamanho / 2
    }" r="${radius}" fill="${corFundo}"/>`;
  } else if (formato === "quadrado") {
    return `<rect width="${tamanho}" height="${tamanho}" rx="${borderRadius}" fill="${corFundo}"/>`;
  }
  return "";
}

/**
 * Aplica cor ao ícone
 */
function aplicarCor(conteudoSVG, cor) {
  return conteudoSVG.replace(/fill="[^"]*"/g, `fill="${cor}"`);
}

/**
 * Centraliza e escala o ícone dentro do viewBox
 */
function centralizarIcone(
  conteudoSVG,
  tamanhoOriginal,
  tamanhoFinal,
  padding = 0.2
) {
  const escala = 1 - padding;
  const offset = (tamanhoFinal * padding) / 2;

  return `<g transform="translate(${offset}, ${offset}) scale(${
    (escala * tamanhoFinal) / tamanhoOriginal
  })">${conteudoSVG}</g>`;
}

/**
 * Retorna o SVG de um banco brasileiro
 *
 * @param {Object} options - Opções de configuração
 * @param {string} options.nome - Nome do banco
 * @param {string} [options.cor] - Cor do ícone em hexadecimal
 * @param {string} [options.fundo] - Cor de fundo em hexadecimal
 * @param {string} [options.formato] - Formato: "circulo", "quadrado" ou "sem"
 * @param {number} [options.tamanho] - Tamanho do SVG em pixels
 * @param {string} [options.className] - Classe CSS para aplicar no SVG
 *
 * @returns {Promise<string|null>} String HTML do SVG ou null se não encontrado
 */
export async function svgBanco(options) {
  const { nome, cor, fundo, formato, tamanho, className } = options;

  const nomeNormalizado = normalizarNome(nome);

  const preset = PRESETS[nomeNormalizado] || {
    cor: "#FFFFFF",
    fundo: "#000000",
    formato: "quadrado",
    tamanho: 64,
  };

  const config = {
    cor: cor || preset.cor,
    fundo: fundo || preset.fundo,
    formato: formato || preset.formato,
    tamanho: tamanho || preset.tamanho,
  };

  const iconeOriginal = await carregarIcone(nomeNormalizado);
  if (!iconeOriginal) return null;

  let conteudoIcone = extrairConteudoSVG(iconeOriginal);
  conteudoIcone = aplicarCor(conteudoIcone, config.cor);

  const tamanhoOriginal = 108;
  conteudoIcone = centralizarIcone(
    conteudoIcone,
    tamanhoOriginal,
    config.tamanho
  );

  const elementoFundo =
    config.formato !== "sem"
      ? criarFundo(config.formato, config.tamanho, config.fundo)
      : "";

  const classAttr = className ? ` class="${className}"` : "";
  const svg = `<svg width="${config.tamanho}" height="${config.tamanho}" viewBox="0 0 ${config.tamanho} ${config.tamanho}" fill="none" xmlns="http://www.w3.org/2000/svg"${classAttr}>${elementoFundo}${conteudoIcone}</svg>`;

  return svg;
}

/**
 * Lista todos os bancos disponíveis
 * @returns {string[]} Array com nomes dos bancos
 */
export function listarBancos() {
  return Object.keys(PRESETS);
}

/**
 * Obtém o preset de um banco
 * @param {string} nome - Nome do banco
 * @returns {Object|null} Preset do banco ou null
 */
export function obterPreset(nome) {
  const nomeNormalizado = normalizarNome(nome);
  return PRESETS[nomeNormalizado] || null;
}

export default svgBanco;
