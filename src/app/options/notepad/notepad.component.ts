import { Component, HostBinding, Output, EventEmitter, OnInit } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { SharedService } from '../../_shared/shared.service';

@Component({
  selector: 'options-notepad',
  templateUrl: 'notepad.component.html'
})
export class OptionsNotepadComponent implements OnInit {
  @Output() goTo: EventEmitter<string> = new EventEmitter<string>();
  @HostBinding('class') hostClass: string = 'panelPlate panelPage';
  sync = false;

  constructor(
    public shared: SharedService,
    public settings: Storage,
  ) {
  }

  ngOnInit() {
    this.sync = this.settings.config.notepad.sync;
  }

  changeStorageLocation() {
    console.log('sync', this.settings.config.notepad.sync, this.sync);

    if (this.settings.config.notepad.sync) {
      if (confirm('Do you want to disable syncing of your notes? Notes will no longer update on other computers. Changing this setting could potentially result in a loss of notes, please backup your notes before proceeding. \n\nOnce syncing is disabled, you will be able to add up to 250,000 characters in your notes.')) {
        this.settings.config.notepad.sync = false;
        this.sync = false;

        chrome.storage.sync.get('ct-notes', (result) => {
          chrome.storage.local.set({'ct-notes': result['ct-notes']});
          chrome.storage.sync.set({'ct-notes': ''});
        })
        return;
      } else {
        setTimeout(() => {
          this.sync = true;
        }, 0);
        return;
      }
    }
    if (!this.settings.config.notepad.sync) {
      if (confirm('Are you sure you want to enable syncing of notes? Your current notes will start to sync across other computers with this browser that you have logged into. \n\n**NOTE** Synced notes are limited to only 2,000 characters. If you currently have more than that, you may lose some of your notes. Please backup your notes before proceeding.')) {
        this.settings.config.notepad.sync = true;
        this.sync = true;

        chrome.storage.local.get('ct-notes', (result) => {
          chrome.storage.sync.set({'ct-notes': result['ct-notes']});
          chrome.storage.local.set({'ct-notes': ''});
        })
        return;
      } else {
        setTimeout(() => {
          this.sync = false;
        }, 0);
        return;
      }
    }
  }

}
