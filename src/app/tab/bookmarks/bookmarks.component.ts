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
    this.calcSize(this.settings.config.bookmarks.bookmarkScaling, this.bookmarkScale);
    this.calcSize(this.settings.config.bookmarks.quickLinkScaling, this.quickLinkScale);
    this.settings.onChange().subscribe((data) => {
      this.calcSize(data.bookmarks.bookmarkScaling, this.bookmarkScale);
      this.calcSize(data.bookmarks.quickLinkScaling, this.quickLinkScale);
    });
  }

  ngOnInit() {
    this.isLoading = true;
    if (this.settings.config.bookmarks.bookmarksBar) {
      chrome.bookmarks.getTree(bookmarks => {
        this.zone.run(() => {
          this.isLoading = false;
          this.allBookmarks = bookmarks[0].children[0].children;
          this.cdRef.detectChanges();
          this.toggle = this.allBookmarks.map(i => false);
        });
      });
    }
  }

  calcSize(size: number, scale: string) {
    scale = ((this.baseScale / 50) * size) + 'px';
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

}
