import { Component, ElementRef, ViewChild } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { SharedService } from '../../_shared/shared.service';
import { GoogleAnalyticsService } from '../../_shared/ga.service';

@Component({
  selector: 'options-message',
  templateUrl: 'message.component.html'
})
export class OptionsMessageComponent {
  @ViewChild("textMessage", { static: false })
  public message: ElementRef;
  constructor(
    public shared: SharedService,
    public settings: Storage,
    public ga: GoogleAnalyticsService
  ) {
  }

  addMessage() {
    this.settings.config.message.texts.push(this.settings.config.message.text);
    this.settings.config.message.text = '';
    this.message.nativeElement.focus();
  }

  removeMessage(index) {
    if (this.settings.config.message.texts.length === 1) {
      this.settings.config.message.text = this.settings.config.message.texts[0];
    }
    this.settings.config.message.texts.splice(index, 1);
  }

}
