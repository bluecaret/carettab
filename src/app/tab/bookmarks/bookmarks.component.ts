import { Component, OnInit, HostBinding, ChangeDetectorRef, Input, ViewChild, ElementRef, NgZone } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Storage } from '../../_storage/storage.service';

@Component({
  selector: 'tab-bookmarks',
  templateUrl: 'bookmarks.component.html'
})
export class TabBookmarksComponent implements OnInit {
  @HostBinding('class.tabBookmarks') pageClass = true;
  baseScale = 13;
  scale = this.baseScale + 'px';
  allBookmarks: any;
  isLoading: boolean;

  @ViewChild('bookmarkUl') ul: ElementRef;

  constructor(
    public settings: Storage, 
    private cdRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private zone: NgZone
  ) {
    this.calcSize(this.settings.config.bookmarks.scaling);
    this.settings.onChange().subscribe((data) => {
      this.calcSize(data.bookmarks.scaling);
    });
  }

  ngOnInit() {
    this.isLoading = true;
    if (!this.settings.config.bookmarks.quickLinks) {
      chrome.bookmarks.getTree(bookmarks => {
        this.zone.run(() => {
          this.isLoading = false;
          this.allBookmarks = bookmarks[0].children[0].children;
          this.cdRef.detectChanges();
        });
      });
    }
  }

  calcSize(size: number) {
    this.scale = ((this.baseScale / 50) * size) + 'px';
  }

  moveLeft() {
    this.sideScroll(this.ul.nativeElement, 'left', 10, 400, 50);
  }

  moveRight() {
    this.sideScroll(this.ul.nativeElement, 'right', 10, 400, 50);
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

  isScrollAtStart(): boolean {
    if (this.ul.nativeElement.scrollLeft === 0) {
      return true;
    }
  }

  isScrollAtEnd(): boolean {
    if (this.ul.nativeElement.scrollLeft === (this.ul.nativeElement.scrollWidth - this.ul.nativeElement.offsetWidth)) {
      return true;
    }
  }

}
