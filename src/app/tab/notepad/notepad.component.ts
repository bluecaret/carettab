import { Component, ElementRef, AfterViewInit, ViewChild } from "@angular/core";
import { SharedService } from "../../_shared/shared.service";
import { Storage } from "../../_storage/storage.service";

@Component({
  selector: "tab-notepad",
  templateUrl: "notepad.component.html",
  host: { class: "notepad" },
})
export class TabNotepadComponent implements AfterViewInit {
  notes: any;
  timer: any;
  totalCount: number;
  @ViewChild('notepadEditor', {static: false}) notepadEditor!: ElementRef;

  constructor(
    public shared: SharedService,
    public settings: Storage
  ) {
  }

  ngAfterViewInit() {
    // settimeout to ensure settings are fully loaded
    setTimeout(() => {
      this.totalCount = this.settings.config.notepad.sync ? 2000 : 250000;
      let that = this;
      chrome.storage[this.settings.config.notepad.sync ? 'sync' : 'local'].get('ct-notes', (result) => {
        that.notes = result['ct-notes'];
      })
    }, 0);
  }

  saveNotes() {
    // Only save notes after a 1 second delay from user's last input.
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      console.log('save notes', this.notes);
      chrome.storage[this.settings.config.notepad.sync ? 'sync' : 'local'].set({'ct-notes': this.notes});
    }, 1000);
  }

}
