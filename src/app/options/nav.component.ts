import { Component } from '@angular/core';
import { SharedService } from '../_shared/shared.service';
import { Storage } from '../_storage/storage.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'nav',
  template:
  `
    <h1 class="optHeader">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
        <rect x="24" y="80" width="16" height="16" />
        <rect x="40" y="64" width="16" height="16" />
        <rect x="72" y="64" width="16" height="16" />
        <rect x="56" y="48" width="16" height="16" />
        <rect x="88" y="80" width="16" height="16" />
        <path d="M123 20V0H88v20h-9V0H44v20h-9V10 0H25 10 0v10 10 10 20 78h128V20H123zM118 118H10V10h15v20h19 35 9 30V118z" />
      </svg>
      CaretTab
    </h1>
    <ul>
      <li>
        <button title="Dashboard" type="button" (click)="goToPage('Dashboard')" [ngClass]="{'active': shared.optionsPage === 'Dashboard'}">
          <div class="icon">info</div>Dashboard
        </button>
      </li>
      <li>
        <button
          title="{{'options.design.design' | translate}}"
          type="button" (click)="goToPage('Design')" [ngClass]="{'active': shared.optionsPage === 'Design'}">
          <div class="icon">format_paint</div>{{'options.design.design' | translate}}
        </button>
      </li>
      <li>
        <button
          title="{{'options.time.time' | translate}}"
          type="button" (click)="goToPage('Time')" [ngClass]="{'active': shared.optionsPage === 'Time'}">
          <div class="icon">access_time</div>{{'options.time.time' | translate}}
        </button>
      </li>
      <li>
        <button
          title="{{'options.date.date' | translate}}"
          type="button" (click)="goToPage('Date')" [ngClass]="{'active': shared.optionsPage === 'Date'}">
          <div class="icon">insert_invitation</div>{{'options.date.date' | translate}}
        </button>
      </li>
      <li>
        <button
          title="{{'options.bookmarks.headingBar' | translate}}"
          type="button" (click)="goToPage('Bookmarks')" [ngClass]="{'active': shared.optionsPage === 'Bookmarks'}">
          <div class="icon">star</div>{{'options.bookmarks.headingBar' | translate}}
        </button>
      </li>
      <li>
        <button
          title="{{'options.search.search' | translate}}"
          type="button" (click)="goToPage('Search')" [ngClass]="{'active': shared.optionsPage === 'Search'}">
          <div class="icon">search</div>{{'options.search.search' | translate}}
        </button>
      </li>
      <li>
        <button
          title="{{'options.message.customMsg' | translate}}"
          type="button" (click)="goToPage('Message')" [ngClass]="{'active': shared.optionsPage === 'Message'}">
          <div class="icon">textsms</div>{{'options.message.customMsg' | translate}}
        </button>
      </li>
      <li>
        <button
          title="Extra"
          type="button" (click)="goToPage('Extra')" [ngClass]="{'active': shared.optionsPage === 'Extra'}">
          <div class="icon">settings</div>Extra
        </button>
      </li>
    </ul>
  `,
})
export class NavComponent {

  constructor(
    public shared: SharedService,
    public settings: Storage
  ) {
  }

  goToPage(page: string) {
    this.shared.optionsPage = page;
  }

  saveAndClose() {
    this.settings.setAll(this.settings.config);
    this.shared.optionsToggle = false;
  }

}
