import { Component, Input } from '@angular/core';

@Component({
  selector: 'help',
  template: `
    <span [title]="title">
      <ng-content></ng-content>
    </span>
  `,
})
export class HelpComponent {
  @Input() title;
}
