import { Component, HostBinding } from '@angular/core';
import { Storage } from '../../_storage/storage.service';

@Component({
  selector: 'tab-bookmarks',
  templateUrl: 'bookmarks.component.html'
})
export class TabBookmarksComponent {
  @HostBinding('class.tabBookmarks') pageClass = true;
  scale = '1.25em';

  constructor(public settings: Storage) {
    this.calcSize(this.settings.config.bookmarks.scaling);
    this.settings.onChange().subscribe((data) => {
      this.calcSize(data.bookmarks.scaling);
    });
  }

  calcSize(size: number) {
    let base = .025;
    this.scale = (base * size) + 'em';
  }

}
