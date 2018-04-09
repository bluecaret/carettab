import { Component } from '@angular/core';
import { Storage } from '../../_storage/storage.service';

@Component({
  selector: 'app-i-bookmarks',
  templateUrl: 'bookmarks.component.html'
})
export class TabBookmarksComponent {

  constructor(public settings: Storage) {
  }

}
