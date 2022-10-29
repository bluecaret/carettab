import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, NgZone } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Storage } from '../../_storage/storage.service';
import { SharedService } from '../../_shared/shared.service';
import * as Bowser from 'bowser';

@Component({
  selector: 'tab-quickLinks',
  templateUrl: 'quickLinks.component.html',
  host: {'class': 'tabQuickLinks'}
})
export class TabQuickLinksComponent implements OnInit {
  isLoading: boolean;
  allMostVisited: any;
  toggleMostVisited = false;
  mostVisited = {title: 'Most Visited'};
  toggleMvMenu = false;
  isChrome = false;
  iconTemp = {};

  // Get browser for favicons
  browser = Bowser.getParser(window.navigator.userAgent).getBrowserName();
  os = Bowser.getParser(window.navigator.userAgent).getOSName();

  constructor(
    public shared: SharedService,
    public settings: Storage,
    private cdRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private zone: NgZone,
  ) {
    this.settings.onChange().subscribe((data) => {
      if (this.settings.config) {
        if (this.settings.config.quickLink && this.settings.config.quickLink.mostVisited === true) {
          this.getMostVisited();
        }
      }
    });
  }

  ngOnInit() {
    this.isLoading = true;
    this.isChrome = !!window.chrome;

    if (this.settings.config.quickLink.mostVisited === true) {
      this.getMostVisited();
    }
  }

  getMostVisited() {
    chrome.topSites.get(site => {
      this.zone.run(() => {
        this.isLoading = false;
        this.allMostVisited = site;
      });
    });
  }

  getQuickLinksIcon(url) {
    if (!this.iconTemp[url]) {
      let faviconUrl = new URL(`chrome-extension://${chrome.runtime.id}/_favicon/`);
      faviconUrl.searchParams.append('pageUrl', url);
      faviconUrl.searchParams.append('size', '32');
      this.iconTemp[url] = this.sanitizer.bypassSecurityTrustResourceUrl(faviconUrl.href);
    }
    return this.iconTemp[url];
  }

  bookmarksManager() {
    chrome.tabs.update({ url: 'chrome://bookmarks' });
  }

  history() {
    chrome.tabs.update({ url: 'chrome://history' });
  }

  apps() {
    chrome.tabs.update({ url: 'chrome://apps' });
  }

  chromeTab() {
    chrome.tabs.update({ url: 'chrome-search://local-ntp/local-ntp.html' });
  }

  getShortcut(index: number): string {
    let i: number;

    if (index > 9) return null;
    if (index === 9) i = 0;
    if (index < 9) i = index + 1;

    if (this.os === 'macOS') {
      return `Shortcut: [control]+[alt]+${i}`;
    }
    return `Shortcut: [alt]+${i}`;
  }

}
