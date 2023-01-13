import { Component, OnInit } from '@angular/core';
import { transition, trigger, style, state, animate } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from './_shared/shared.service';
import { Storage } from './_storage/storage.service';
import { tab, options } from './_shared/animations';
import * as moment from 'moment';
import { compare } from 'compare-versions';
import * as Bowser from 'bowser';
import { ExtPay } from "../js/ExtPay";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [
    options,
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

  constructor(
    public shared: SharedService,
    public settings: Storage,
    private translate: TranslateService
  ) { }


  ngOnInit() {
    this.handleVersionNumbers();
    this.translate.setDefaultLang('en-US');
    this.shared.zoneGuess = moment.tz.guess();
    this.findBrowser();

    let that = this
    chrome.storage.local.get('user', function (result) {
      (result && result.user)
        ? that.shared.paid = result.user.paid
        : that.shared.paid = false;
    });
  }

  findBrowser() {
    let b = Bowser.getParser(window.navigator.userAgent).getBrowserName();
    if (b === 'Microsoft Edge') {
      this.shared.browser = "edge";
    } else if (b === 'Chrome') {
      this.shared.browser = "chrome";
    }
  }

  handleVersionNumbers() {
    let _self = this;
    chrome.storage.local.get(['caretTabStatus', 'caretTabNewVersion', 'caretTabPrevVersion', 'updateTimestamp', 'clearWhatsNewBox'], function (data) {
      let status: string = data.caretTabStatus ? data.caretTabStatus : 'existing';
      let prevVer: string = data.caretTabPrevVersion ? data.caretTabPrevVersion : '';
      let newVer: string = data.caretTabNewVersion ? data.caretTabNewVersion : '';
      let updateTimestamp = data.updateTimestamp ? data.updateTimestamp : null;
      let clearWhatsNewBox = data.clearWhatsNewBox !== undefined ? data.clearWhatsNewBox : true;

      _self.shared.status = status;
      _self.shared.clearWhatsNewBox = clearWhatsNewBox;

      // Clear update notification if more than a week old.
      if (updateTimestamp) {
        let now = new Date();
        let then = new Date(updateTimestamp);
        let thenPlusWeek = new Date(then.getFullYear(), then.getMonth(), then.getDate() + 5, 0, 0, 0, 0);

        if (now > thenPlusWeek) {
          chrome.storage.local.set({caretTabStatus: 'existing'});
          chrome.storage.local.set({updateTimestamp: null});
          chrome.storage.local.set({clearWhatsNewBox: true});
          _self.shared.status = 'existing';
          _self.shared.clearWhatsNewBox = true;
        }
      }

      // _self.shared.echo('Extension status:', _self.shared.status);

      _self.shared.updateType = "minor";
      // Display major update splash screen for version 3.0.0
      // if (prevVer) {
        // if (compare(prevVer, '3.5.0', '<')) {
        //   _self.shared.updateType = "major";
        // } else if (compare(prevVer, '3.5.0', '>')) {
        //   _self.shared.updateType = "quiet"
        // } else {
        //   _self.shared.updateType = "hidden"
        // }
      // }

      // _self.shared.echo(`Version check:`, `Status: ${status} | Prev: ${prevVer} | New: ${newVer} | Type: ${_self.shared.updateType} | clear: ${clearWhatsNewBox} |  Timestampe: ${updateTimestamp}`);
    });
  }
}
