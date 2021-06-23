import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, NgZone } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Storage } from '../../_storage/storage.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { SharedService } from '../../_shared/shared.service';
import * as Bowser from 'bowser';
import { GoogleAnalyticsService } from '../../_shared/ga.service';

@Component({
  selector: 'tab-bookmarks',
  templateUrl: 'bookmarks.component.html',
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateY(-100%)'}))
      ])
    ])
  ],
  host: {'class': 'tabBookmarks'}
})
export class TabBookmarksComponent implements OnInit {
  isLoading: boolean;
  toggle: any = {};
  allMostVisited: any;
  toggleMostVisited = false;
  mostVisited = {title: 'Most Visited'};
  isChrome = false;
  iconTemp = {};

  // Get browser for favicons
  browser = Bowser.getParser(window.navigator.userAgent).getBrowserName();
  os = Bowser.getParser(window.navigator.userAgent).getOSName();

  @ViewChild('barList', { static: false }) barList: ElementRef;

  constructor(
    public shared: SharedService,
    public settings: Storage,
    private cdRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private zone: NgZone,
    public ga: GoogleAnalyticsService
  ) {
    this.settings.onChange().subscribe((data) => {
      if (this.settings.config) {
        if (this.settings.config.bookmark && this.settings.config.bookmark.enabled === true) {
          this.getBookmarks();
        }
        if (this.settings.config.bookmark && this.settings.config.bookmark.mostVisited === true) {
          this.getMostVisited();
        }
      }
    });
  }

  ngOnInit() {
    this.isLoading = true;
    this.isChrome = !!window.chrome;

    if (this.settings.config.bookmark.enabled) {
      this.getBookmarks();
    }
    if (this.settings.config.bookmark.mostVisited === true) {
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

  // Use DuckDuckGo favicon service if firefox or no window.chrome
  // otherwise use the chrome service.
  getQuickLinksIcon(url) {
    if (!this.iconTemp[url]) {
      const hostname = new URL(url).hostname;
      if (this.browser === 'Firefox' || !this.isChrome) {
        this.iconTemp[url] = this.sanitizer.bypassSecurityTrustResourceUrl('https://icons.duckduckgo.com/ip3/' + hostname + '.ico' );
      } else {
        this.iconTemp[url] = this.sanitizer.bypassSecurityTrustResourceUrl('chrome://favicon/size/16@2x/' + url);
      }
    }
    return this.iconTemp[url];
  }

  getBookmarks() {
    chrome.bookmarks.getTree(bookmarks => {
      this.zone.run(() => {
        this.isLoading = false;
        this.shared.allBookmarks = bookmarks[0].children[0].children;
        this.cdRef.detectChanges();
        this.toggle = this.shared.allBookmarks.map(i => false);
      });
    });
  }

  getBookmarkSize(size: number) {
    return (size / .8333333333333) + 'px';
  }

  moveLeft(el: any) {
    this.sideScroll(el, 'left', 30, 400, 30);
  }

  moveRight(el: any) {
    this.sideScroll(el, 'right', 30, 400, 30);
  }

  sideScroll(element, direction, speed, distance, step) {
    let scrollAmount = 0;
    let slideTimer = setInterval(function() {
      if (direction === 'left') {
        element.scrollLeft -= step;
      } else {
        element.scrollLeft += step;
      }
      scrollAmount += step;
      if (scrollAmount >= distance) {
        window.clearInterval(slideTimer);
      }
    }, speed);
  }

  isScrollAtStart(el: any): boolean {
    if (el.scrollLeft === 0) {
      return true;
    }
  }

  isScrollAtEnd(el: any): boolean {
    if (el.scrollLeft === (el.scrollWidth - el.offsetWidth)) {
      return true;
    }
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

}
