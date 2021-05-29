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
    this.shared.echo('Thank you for using CaretTab!');
    this.shared.echo('Loaded settings:', '', this.settings.config);
    this.translate.setDefaultLang('en-US');

    // Set background image
    let savedImg = localStorage.getItem('bgImg');
    if (savedImg != null || savedImg != undefined) {
      this.shared.bg = savedImg;
      this.shared.echo('Background image found in storage', savedImg.substr(0,20))
    } else {
      let patternId = this.settings.config.design.patternId;
      let img = '0.png';

      // Check for "900" is for backwards compatibility with an old bug
      if (patternId !== 0 && patternId !== 99999 && patternId !== 900) {
        img = patterns.find(p => p.id === patternId).pattern;
        this.shared.echo('No background, use selected pattern:', patternId)
      } else {
        this.shared.echo('No background or pattern set', patternId)
      }
      let bg = './assets/patterns/' + img;
      this.shared.bg = bg;
    }
  }

  ngOnInit() {
    this.handleVersionNumbers();
    
    this.settings.onChange().subscribe((data) => {
      if (
        this.settings.config.misc.title.type === 20 ||
        this.settings.config.misc.title.type === 40 ||
        this.settings.config.misc.title.type === 50
      ) {
        // TODO: What was I doing here???
      }
    });
    this.shared.zoneGuess = moment.tz.guess();
    this.shared.echo('Timezone guess:', this.shared.zoneGuess);
  }

  handleVersionNumbers() {
    let prevVer: string = localStorage.getItem("caretTabPrevVersion");
    let newVer: string = localStorage.getItem("caretTabNewVersion");
    this.shared.status = localStorage.getItem("caretTabStatus");

    this.shared.echo('Extension status:', this.shared.status);

    // Display major update splash screen for version 3.0.0
    if (compare(prevVer, '3.0.0', '<')) {
      this.shared.updateType = "major";
    } else if (compare(prevVer, '3.3.0', '<')) {
      this.shared.updateType = "quiet"
    } else {
      this.shared.updateType = "hidden"
    }

    localStorage.setItem('caretTabUpdateType', this.shared.updateType);

    this.shared.echo(`Version check:`, `Prev: ${prevVer} | Old: ${newVer} | Type: ${this.shared.updateType}`);
  }

}
