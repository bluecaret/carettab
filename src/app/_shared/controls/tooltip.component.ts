import { Component, Input } from '@angular/core';
import { GoogleAnalyticsService } from '../ga.service';

@Component({
  selector: 'tooltip',
  template: `
    <button 
      type="button" 
      class="tipToggle" 
      (click)="ga.field('button.tooltip','true')"
      data-pop
      data-pop-no-shadow
      [attr.aria-label]="text"> 
    </button>
  `
})

export class TooltipComponent {
  @Input() text: string;

  constructor(
    public ga: GoogleAnalyticsService
  ) {
  }

}
