import { Component, ViewEncapsulation, HostBinding } from '@angular/core';
import { transition, trigger, style, state, animate } from '@angular/animations';
import { SharedService } from '../_shared/shared.service';

@Component({
  selector: 'app-options',
  templateUrl: 'options.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./_scss/options.scss'],
  animations: [
    trigger('page', [
      state('*', style({
        opacity: 1,
        transform: 'scaleY(1)'
      })),
      state('void', style({
        opacity: 0,
        transform: 'scaleY(0.6)'
      })),
      transition('* => void', animate('250ms ease-out')),
      transition('void => *', animate('250ms ease-in'))
    ])
  ]
})
export class OptionsComponent {
  @HostBinding('class.options-wrapper') options = true;

  constructor(public shared: SharedService) {
  }

  goToPage(page: string) {
    this.shared.optionsPage = page;
  }

}