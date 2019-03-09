import { Component } from '@angular/core';
import { transition, trigger, style, state, animate, query, group } from '@angular/animations';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { SharedService } from './_shared/shared.service';
import { Storage } from './_storage/storage.service';
import { bgSize, bgBlend } from './_shared/lists/lists';
import { tab } from './_shared/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [
    tab,
    trigger('fade', [
      state('*', style({
        opacity: 1
      })),
      state('void',   style({
        opacity: 0
      })),
      transition('* => void', animate('250ms ease-out')),
      transition('void => *', animate('250ms ease-in'))
    ]),
    trigger('slideIn', [
      state('*', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      state('void',   style({
        opacity: 0,
        transform: 'scale(0)'
      })),
      transition('* => void', animate('250ms ease-out')),
      transition('void => *', animate('250ms ease-in'))
    ])
  ]
})
export class AppComponent {
  bgSize = bgSize;
  bgBlend = bgBlend;

  constructor(
    public sanitizer: DomSanitizer,
    public shared: SharedService,
    public settings: Storage
  ) {
    let savedImg = localStorage.getItem('bgImg');
    if (savedImg) {
      this.shared.bg = savedImg;
    }
  }

  getBgSize() {
    let s = this.bgSize.find(x => x.id === this.settings.config.design.imageSize).size;
    return s;
  }

  getBgBlend() {
    let m = this.bgBlend.find(x => x.id === this.settings.config.design.imageBlend).mode;
    return m;
  }

}
