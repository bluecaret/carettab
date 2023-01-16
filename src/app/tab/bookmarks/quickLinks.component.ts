import { Component, OnInit, ViewChild, HostListener, ElementRef, NgZone, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Storage } from '../../_storage/storage.service';
import { SharedService } from '../../_shared/shared.service';
import { MostVisitedMenuComponent } from './most-visited-menu.component';
import { PopupService } from '../../_shared/controls/popup.service';
import * as Bowser from 'bowser';

@Component({
  selector: 'tab-quickLinks',
  templateUrl: 'quickLinks.component.html',
  host: {'class': 'tabQuickLinks'}
})
export class TabQuickLinksComponent implements OnInit {
  popupRef: any;
  showMostVisited = false;
  mostVisited = {title: 'Most Visited'};
  toggleMvMenu = false;
  isChrome = false;
  iconTemp = {};

  // Get browser for favicons
  browser = Bowser.getParser(window.navigator.userAgent).getBrowserName();
  os = Bowser.getParser(window.navigator.userAgent).getOSName();

  @ViewChild('quickLinkMostVisitedBtn', {static: false}) quickLinkMostVisitedBtn: ElementRef;

  constructor(
    public shared: SharedService,
    public settings: Storage,
    private sanitizer: DomSanitizer,
    private zone: NgZone,
    private popupService: PopupService,
    private renderer: Renderer2
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
    this.isChrome = !!window.chrome;

    if (this.settings.config.quickLink.icons === true && this.settings.config.quickLink.enabled === true) {
      this.checkFaviconPermission();
    }
    if (this.settings.config.quickLink.mostVisited === true) {
      this.getMostVisited();
    }

    this.renderer.listen('window', 'click', (e: Event) => {
      if (
        this.quickLinkMostVisitedBtn &&
        (e.target !== this.quickLinkMostVisitedBtn.nativeElement && this.showMostVisited)
      ) {
        this.popupRef.destroy();
        this.showMostVisited = false;
      }
    });
  }

  checkFaviconPermission() {
    const that = this;
    chrome.permissions.contains({permissions: ['favicon']}, function(result) {
      that.zone.run(() => {
        if (chrome.runtime.lastError) {
          that.shared.echo('Error checking Favicon permission', chrome.runtime.lastError, '', 'error');
        }
        if (!result) {
          that.setFaviconPermission();
        }
      });
    });
  }

  setFaviconPermission() {
    const that = this;
    chrome.permissions.request({permissions: ['favicon']}, function(granted) {
      that.zone.run(() => {
        if (chrome.runtime.lastError) {
          that.shared.echo('Error setting Favicon permission', chrome.runtime.lastError, '', 'error');
        }
      });
    });
  }

  toggleMostVisited(e: PointerEvent) {
    if (!this.showMostVisited) {
      this.popupRef = this.popupService.createComponent(MostVisitedMenuComponent, {target: e});
      this.popupService.attachComponent(this.popupRef, document.body);
      this.showMostVisited = true;
    }
  }

  getMostVisited() {
    chrome.topSites.get(site => {
      this.zone.run(() => {
        this.shared.mostVisitedLinks = site;
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
