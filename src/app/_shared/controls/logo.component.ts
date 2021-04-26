import { Component } from '@angular/core';
import { SharedService } from '../shared.service';
import { Storage } from '../../_storage/storage.service';

@Component({
  selector: 'app-logo',
  template: `
    <a
      href="https://www.carettab.com"
      class="logoWatermark"
      [ngClass]="{'hide': settings.config.design.hideLogo}"
      title="CaretTab">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
        <rect x="24" y="80" width="16" height="16" />
        <rect x="40" y="64" width="16" height="16" />
        <rect x="72" y="64" width="16" height="16" />
        <rect x="56" y="48" width="16" height="16" />
        <rect x="88" y="80" width="16" height="16" />
        <path d="M123 20V0H88v20h-9V0H44v20h-9V10 0H25 10 0v10 10 10 20 78h128V20H123zM118 118H10V10h15v20h19 35 9 30V118z" />
      </svg>
    </a>
  `
})

export class LogoComponent {

  constructor(
    public shared: SharedService,
    public settings: Storage
  ) {
  }
}
