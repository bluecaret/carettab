import { Component } from '@angular/core';
import { SharedService } from '../_shared/shared.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'nav',
  template:
  `
    <svg class="navBg" version="1.1" viewBox="0 0 100 30" preserveAspectRatio="none">
      <polyline points="0 0, 100 0, 100 22, 2 30"></polyline>
      <polyline points="0 0, 100 0, 100 24, 4 26"></polyline>
    </svg>
    <ul>
      <li>
        <button type="button" (click)="goToPage('Dashboard')" [ngClass]="{'active': shared.optionsPage === 'Dashboard'}">
          <div class="icon">info</div>
        </button>
      </li>
      <li>
        <button type="button" (click)="goToPage('Design')" [ngClass]="{'active': shared.optionsPage === 'Design'}">
          <div class="icon">format_paint</div>
        </button>
      </li>
      <li>
        <button type="button" (click)="goToPage('Time')" [ngClass]="{'active': shared.optionsPage === 'Time'}">
          <div class="icon">access_time</div>
        </button>
      </li>
      <li>
        <button type="button" (click)="goToPage('Date')" [ngClass]="{'active': shared.optionsPage === 'Date'}">
          <div class="icon">insert_invitation</div>
        </button>
      </li>
      <li>
        <button type="button" (click)="goToPage('Bookmarks')" [ngClass]="{'active': shared.optionsPage === 'Bookmarks'}">
          <div class="icon">star</div>
        </button>
      </li>
      <li>
        <button type="button" (click)="goToPage('Search')" [ngClass]="{'active': shared.optionsPage === 'Search'}">
          <div class="icon">search</div>
        </button>
      </li>
      <li>
        <button type="button" (click)="goToPage('Message')" [ngClass]="{'active': shared.optionsPage === 'Message'}">
          <div class="icon">textsms</div>
        </button>
      </li>
      <li>
        <button type="button" (click)="goToPage('Extra')" [ngClass]="{'active': shared.optionsPage === 'Extra'}">
          <div class="icon">settings</div>
        </button>
      </li>
      <li>
        <button type="button" (click)="shared.optionsToggle = false" class="close">
          <div class="icon">close</div>
        </button>
      </li>
    </ul>
  `,
})
export class NavComponent {

  constructor(public shared: SharedService) {
  }

  goToPage(page: string) {
    this.shared.optionsPage = page;
  }

}
