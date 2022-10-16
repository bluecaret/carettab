import { Component, Input } from '@angular/core';

@Component({
  selector: 'tooltip',
  template: `
    <button
      type="button"
      class="tipToggle"
      data-pop
      data-pop-no-shadow
      [attr.aria-label]="text">
    </button>
  `
})

export class TooltipComponent {
  @Input() text: string;

  constructor(
  ) {
  }

}
