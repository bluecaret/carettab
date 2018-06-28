import { Component, OnInit, NgZone, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import * as moment from 'moment';

@Component({
  selector: 'tab-time',
  templateUrl: 'time.component.html'
})
export class TabTimeComponent implements OnInit {
  currentTime: string;

  @ViewChild('time')
  public displayTime: ElementRef;

  constructor(
    public settings: Storage, 
    private zone: NgZone, 
    private renderer: Renderer2
  ) {
    this.zone.runOutsideAngular(() => {
      setInterval(() => {
        this.renderer.setProperty(
          this.displayTime.nativeElement, 
          'textContent', 
          this.currentTime = moment(new Date()).format('HH:mm:ss')
        );
      }, 1);
    });
  }

  ngOnInit() {
  }

}
