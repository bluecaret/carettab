import { Component, OnInit, Input, HostBinding, NgZone } from '@angular/core';
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
export class MostVisitedMenuComponent implements OnInit {
  @Input() target: PointerEvent;
  @HostBinding("class") mostVisitedMenu = "mostVisitedMenu";
  @HostBinding("style.top") y = "0px"
  @HostBinding("style.left") x = "0px"
  allMostVisited: any;
  iconTemp = {};

  constructor(public settings: Storage, public shared: SharedService, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.y = `${this.target.pageY + 16}px`
    this.x = `${this.target.pageX + 10}px`
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
