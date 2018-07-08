import { Component, ViewEncapsulation, HostBinding } from '@angular/core';
import { SharedService } from '../_shared/shared.service';

@Component({
  selector: 'app-options',
  templateUrl: 'options.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./_scss/options.scss']
})
export class OptionsComponent {
  @HostBinding('class.options') pageClass = true;

  page: string;

  constructor(public shared: SharedService) {
    this.page = 'time';
  }

  toggleOptions() {
    this.shared.optionsToggle = !this.shared.optionsToggle;
  }

}