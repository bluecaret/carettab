import { Component, OnInit, HostBinding, ChangeDetectorRef, Input, ViewChild, ElementRef, NgZone } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Storage } from '../../_storage/storage.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'tab-bookmarks',
  templateUrl: 'bookmarks.component.html',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateX(100%)'}),
        animate('200ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateX(100%)'}))
      ])
    ]),
    trigger('slideDown', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateY(-100%)'}))
      ])
    ])
  ]
})
export class TabBookmarksComponent implements OnInit {
  baseScale = 12;
  bookmarkScale = this.baseScale + 'px';
  quickLinkScale = this.baseScale + 'px';
  allBookmarks: any;
  isLoading: boolean;
  toggle: any = {};

  @ViewChild('barList') barList: ElementRef;

  constructor(
    public settings: Storage,
    private cdRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private zone: NgZone
  ) {
    this.calcSize(this.settings.config.bookmarks.bookmarksBar.scaling, false);
    this.calcSize(this.settings.config.bookmarks.quickLinks.scaling, true);
    this.settings.onChange().subscribe((data) => {
      this.calcSize(data.bookmarks.bookmarksBar.scaling, false);
      this.calcSize(data.bookmarks.quickLinks.scaling, true);
      if (data.bookmarks.bookmarksBar.enabled === true) {
        this.getBookmarks();
      }
    });
  }

  ngOnInit() {
    this.isLoading = true;
    if (this.settings.config.bookmarks.bookmarksBar.enabled) {
      this.getBookmarks();
    }
  }

  getBookmarks() {
    chrome.bookmarks.getTree(bookmarks => {
      this.zone.run(() => {
        this.isLoading = false;
        this.allBookmarks = bookmarks[0].children[0].children;
        this.cdRef.detectChanges();
        this.toggle = this.allBookmarks.map(i => false);
      });
    });
  }

  calcSize(size: number, quickLink: boolean) {
    const c = ((this.baseScale / 50) * size) + 'px';
    quickLink === false ? this.bookmarkScale = c : this.quickLinkScale = c;
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

  mostVisited() {
    chrome.tabs.update({ url: 'chrome://mostvisited' });
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
