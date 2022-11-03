import { Component, AfterViewInit, Input, HostBinding, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedService } from '../../_shared/shared.service';
import { Storage } from '../../_storage/storage.service';

@Component({
  selector: 'app-popup-menu',
  template: `
    <ng-container>
      <a
        href="{{mv.url}}"
        title="{{mv.title}}
{{mv.url}}"
        *ngFor="let mv of shared.mostVisitedLinks">
        <img *ngIf="settings.config.quickLink.icons" [src]="getQuickLinksIcon(mv.url)">
        <div>{{mv.title}}</div>
      </a>
    </ng-container>
  `
})
export class MostVisitedMenuComponent implements AfterViewInit {
  @Input() target: PointerEvent;
  @HostBinding("class") mostVisitedMenu = "mostVisitedMenu";
  @HostBinding("style.top") y = "0px"
  @HostBinding("style.left") x = "0px"
  @HostBinding("style.visibility") visibility = "hidden"
  allMostVisited: any;
  iconTemp = {};

  constructor(
    public settings: Storage,
    public shared: SharedService,
    private sanitizer: DomSanitizer,
    private elRef: ElementRef
  ) {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const height = this.elRef.nativeElement.offsetHeight;
      const width = this.elRef.nativeElement.offsetWidth;
      const mouseY = this.target.pageY;
      const mouseX = this.target.pageX;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const heightDifference = windowHeight - (height + mouseY);
      const widthDifference = windowWidth - (width + mouseX);

      if (heightDifference < 0) {
        let pos = mouseY + heightDifference;
        this.y = `${pos < 0 ? 0 : pos}px`;
      } else {
        this.y = `${mouseY}px`
      }
      if (widthDifference < 0) {
        let pos = mouseX + widthDifference;
        this.x = `${pos < 0 ? 0 : pos}px`;
      } else {
        this.x = `${mouseX}px`
      }
      this.visibility = "visible";
    }, 20);
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
}
