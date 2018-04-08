import { Component, OnInit } from '@angular/core';
import { transition, trigger, style, state, animate, query, group } from '@angular/animations';
import { SharedService } from './lib/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [
    trigger('fade', [
      state('*', style({
        opacity: 1
      })),
      state('void',   style({
        opacity: 0
      })),
      transition('* => void', animate('250ms ease-out')),
      transition('void => *', animate('250ms ease-in'))
    ])
  ]
})
export class AppComponent implements OnInit {
  constructor(public shared: SharedService) {
  }

  ngOnInit() {
    // this.shared.getStorage();
  }
}
