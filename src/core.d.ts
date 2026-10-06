export type FormatoBanco = 'quadrado' | 'circulo' | 'sem'

export interface PresetBanco {
  cor: string
  fundo: string
  formato: FormatoBanco
  tamanho: number
}

export interface OpcoesSvgBanco extends Partial<PresetBanco> {
  nome: string
  className?: string
}

export declare function svgBanco(options: OpcoesSvgBanco): string | null

export declare function listarBancos(): string[]

export declare function obterPreset(nome: string): PresetBanco | null
