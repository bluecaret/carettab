import { Component, OnInit, NgZone } from '@angular/core';
import { transition, trigger, style, state, animate } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from './_shared/shared.service';
import { Storage } from './_storage/storage.service';
import { tab } from './_shared/animations';
import * as moment from 'moment';

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
export class AppComponent implements OnInit {
  status: string;

  constructor(
    public shared: SharedService,
    public settings: Storage,
    private zone: NgZone,
    private translate: TranslateService
  ) {
    console.log('Thank you for using CaretTab!');
    this.translate.setDefaultLang('en-US');
    let savedImg = localStorage.getItem('bgImg');
    if (savedImg) {
      this.shared.bg = savedImg;
    }
  }

  ngOnInit() {
    chrome.storage.sync.get('caretTabStatus', (data) => this.zone.run(() => {
      this.shared.status = data['caretTabStatus'];
      // console.log('CaretTab status: ' + this.shared.status);
    }));
    this.settings.onChange().subscribe((data) => {
      if (
        this.settings.config.title.type === 20 ||
        this.settings.config.title.type === 40 ||
        this.settings.config.title.type === 50
      ) {
        // TODO: What was I doing here???
      }
    });
    this.shared.zoneGuess = moment.tz.guess();
  }

}
