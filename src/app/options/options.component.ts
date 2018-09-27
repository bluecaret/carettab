import { Component, ViewEncapsulation, HostBinding } from '@angular/core';
import { transition, trigger, style, state, animate } from '@angular/animations';
import { SharedService } from '../_shared/shared.service';
import { slideIn } from '../_shared/animations';

@Component({
  selector: 'app-options',
  templateUrl: 'options.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./_scss/options.scss'],
  animations: [
    slideIn
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
