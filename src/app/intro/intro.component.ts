import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { transition, trigger, style, state, animate } from '@angular/animations';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from '../_shared/shared.service';
import { Storage } from '../_storage/storage.service';
import { span, colors } from '../_shared/lists/lists';

@Component({
  selector: 'app-intro',
  templateUrl: 'intro.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('introFade', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition(':enter', animate('800ms ease-out')),
      transition(':leave', animate('800ms ease-in')),
    ])
  ]
})
export class IntroComponent implements OnInit {
  step = 6;
  colors = colors;

  constructor(
    public shared: SharedService,
    public settings: Storage,
    private titleService: Title,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
  }

  skipIntro() {
    this.settings.setAll(this.settings.config); // Save
    this.shared.status = null;
  }

  enableTime(enable: boolean) {
    if (enable) {
      this.settings.config.time.clocks = [];
      this.settings.config.time.clocks.push({
        timezone: 'Automatic',
        scaling: 10,
        span: 40,
        padding: 10,
        offset: 0,
        twentyFour: false,
        label: {
          text: 'Main clock',
          enabled: false,
          dim: false,
          scaling: 10,
          offset: 0
        },
        relativeTime: {
          enabled: false,
          dim: false,
          scaling: 10,
          offset: 0
        },
        seconds: {
          enabled: true,
          dim: false,
          scaling: 20,
          offset: 0
        },
        meridiem: {
          enabled: true,
          dim: false,
          scaling: 10,
          offset: 0,
          am: 'am',
          pm: 'pm'
        },
        delimiter: {
          enabled: true,
          dim: true,
          blink: false,
          symbol: ':',
          scaling: 10,
          offset: 0
        },
        brackets: {
          enabled: false,
          dim: false,
          left: '[',
          right: ']',
          scaling: 10,
          offset: 0,
          padding: 1
        },
        analog: {
          enabled: false,
          style: 10
        }
      });
    } else {
      this.settings.config.time.clocks = [];
    }
    this.step = 3;
  }

  enableDate(enable: boolean) {
    if (enable) {
      this.settings.config.date.enabled = true;
    } else {
      this.settings.config.date.enabled = false;
    }
    this.step = 4;
  }

  enableBookmarks(enable: boolean) {
    if (enable) {
      this.settings.config.bookmarks.bookmarksBar.enabled = true;
    } else {
      this.settings.config.bookmarks.bookmarksBar.enabled = false;
    }
    this.step = 5;
  }

  setColors(c: {id: number, bg: string, fg: string}) {
    this.settings.config.design.background = c.bg;
    this.settings.config.design.foreground = c.fg;
    this.settings.config.design.colorsId = c.id;
  }

  finishIntro() {
    this.settings.setAll(this.settings.config); // Save
    this.shared.status = null;
    this.shared.optionsToggle = true;
  }

}
