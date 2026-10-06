import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { svgBanco, type FormatoBanco } from '@edusites/bancos-brasil/core'

@Component({
  selector: 'svg-banco',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[innerHTML]': 'svg()' }
})
export class SvgBanco {
  private readonly sanitizer = inject(DomSanitizer)

  readonly nome = input.required<string>()
  readonly formato = input<FormatoBanco>()
  readonly cor = input<string>()
  readonly fundo = input<string>()
  readonly tamanho = input<number>()

  protected readonly svg = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(
      svgBanco({
        nome: this.nome(),
        formato: this.formato(),
        cor: this.cor(),
        fundo: this.fundo(),
        tamanho: this.tamanho()
      }) ?? ''
    )
  )
}
