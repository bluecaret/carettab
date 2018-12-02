import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { transition, trigger, style, state, animate } from '@angular/animations';
import { Title } from '@angular/platform-browser';
import { SharedService } from '../_shared/shared.service';
import { Storage } from '../_storage/storage.service';
import { span } from '../_shared/lists/lists';

@Component({
  selector: 'app-tab',
  templateUrl: 'tab.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('nav', [
      state('*', style({
        opacity: 1,
        transform: 'scaleX(1)'
      })),
      state('void',   style({
        opacity: 0,
        transform: 'scaleX(0.7)'
      })),
      transition('* => void', animate('200ms ease-out')),
      transition('void => *', animate('200ms ease-in'))
    ])
  ]
})
export class TabComponent implements OnInit {
  span = span;

  constructor(
    public shared: SharedService,
    public settings: Storage,
    private titleService: Title
  ) {
    this.shared.optionsToggle = false;
    this.shared.optionsPage = 'Dashboard';
  }

  ngOnInit() {
    this.setTitle();
    if (
      this.settings.config.time.clocks.length > 0 &&
      this.settings.config.title.type === 20 ||
      this.settings.config.title.type === 40 ||
      this.settings.config.title.type === 50
    ) {
      setInterval(() => {
        this.setTitle();
      }, 500);
    } else if (
      this.settings.config.title.type === 30 ||
      this.settings.config.title.type === 40 ||
      this.settings.config.title.type === 50
    ) {
      setInterval(() => {
        this.setTitle();
      }, 60000);
    }
  }

  /** Updates storage */
  saveAll() {
    this.settings.setAll(this.settings.config);
  }

  toggleOptions() {
    if (this.shared.optionsToggle === true) {
      this.saveAll();
      this.shared.optionsToggle = false;
    } else {
      this.shared.optionsToggle = true;
    }
  }

  public setTitle() {
    if (this.settings.config.title.type === 20) {
      this.titleService.setTitle( this.shared.time );
    } else if (this.settings.config.title.type === 30) {
      this.titleService.setTitle( this.shared.date );
    } else if (this.settings.config.title.type === 40) {
      this.titleService.setTitle( this.shared.time + ' ' + this.shared.date );
    } else if (this.settings.config.title.type === 50) {
      this.titleService.setTitle( this.shared.date + ' - ' + this.shared.time );
    } else if (this.settings.config.title.type === 60) {
      this.titleService.setTitle( this.settings.config.title.text );
    } else {
      this.titleService.setTitle( 'New Tab' );
    }
  }

  getClockSpan(clockSpan) {
    return this.span.find(s => s.id === clockSpan).css;
  }

}
