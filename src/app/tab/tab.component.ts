import { Component, ViewEncapsulation } from '@angular/core';
import { SharedService } from '../_shared/shared.service';

@Component({
  selector: 'app-tab',
  template: `
    <div style="font-size: 10vw;">12:00:00</div>
    <button
      (click)="toggleOptions()"
      id="toggleOptions"
      [ngClass]="{'toggleOptions--open': shared.optionsToggle}"
      title="Open Settings">
      <span><i class="fas fa-ellipsis-v"></i></span>
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./_scss/tab.scss']
})
export class TabComponent {

  constructor(public shared: SharedService) {
  }

  toggleOptions() {
    this.shared.optionsToggle = !this.shared.optionsToggle;
  }

}
