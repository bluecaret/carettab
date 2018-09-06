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
  @HostBinding('class.open') open = true;

  constructor(public shared: SharedService) {
  }

  toggleOptions() {
    this.shared.optionsToggle = !this.shared.optionsToggle;
    this.open = this.shared.optionsToggle;
  }

  goToPage(page: string) {
    this.shared.optionsPage = page;
  }

}
