import { Component, OnInit, NgZone } from '@angular/core';
import { transition, trigger, style, state, animate } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from './_shared/shared.service';
import { Storage } from './_storage/storage.service';
import { patterns } from './_shared/lists/lists';
import { tab } from './_shared/animations';
import * as moment from 'moment';
import { compare } from 'compare-versions';

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
  patterns = patterns;

  constructor(
    public shared: SharedService,
    public settings: Storage,
    private zone: NgZone,
    private translate: TranslateService
  ) {
    console.log('Thank you for using CaretTab!');
    this.translate.setDefaultLang('en-US');

    // Set background image
    let savedImg = localStorage.getItem('bgImg');
    if (savedImg != null || savedImg != undefined) {
      this.shared.bg = savedImg;
    } else {
      let patternId = this.settings.config.design.patternId;
      let img = '0.png';
      if (patternId !== 0) {
        img = patterns.find(p => p.id === patternId).pattern;
      }
      let bg = './assets/patterns/' + img;
      this.shared.bg = bg;
    }
  }

  ngOnInit() {
    this.handleVersionNumbers();
    
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

  handleVersionNumbers() {
    let prevVer: string = localStorage.getItem("caretTabPrevVersion");
    let newVer: string = localStorage.getItem("caretTabNewVersion");
    this.shared.status = localStorage.getItem("caretTabStatus");

    // Display major update splash screen for version 3.0.0
    if (compare(prevVer, '3.0.0', '<')) {
      this.shared.updateType = "major";
    } else {
      this.shared.updateType = "quiet"
    }

    localStorage.setItem('caretTabUpdateType', this.shared.updateType);
  }

}
