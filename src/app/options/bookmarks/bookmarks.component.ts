import { Component, OnInit, NgZone } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { fade } from '../../_shared/animations';
import { SharedService } from '../../_shared/shared.service';

@Component({
  selector: 'options-bookmarks',
  templateUrl: 'bookmarks.component.html',
  animations: [fade]
})
export class OptionsBookmarksComponent implements OnInit {
  editMode: boolean[] = [];
  isInvalid = false;
  hasBookmarkPermission: boolean;
  hasTopSitesPermission: boolean;

  constructor (
    public settings: Storage,
    public shared: SharedService,
    private zone: NgZone
  ) {
  }

  ngOnInit() {
    this.checkBookmarkPermission();
    this.checkTopSitesPermission();
  }

  checkBookmarkPermission() {
    const that = this;
    chrome.permissions.contains({permissions: ['bookmarks']}, function(result) {
      that.zone.run(() => {
        that.allowBookmarks(result);
      });
    });
  }

  setBookmarkPermission() {
    const that = this;
    chrome.permissions.request({permissions: ['bookmarks']}, function(granted) {
      that.zone.run(() => {
        that.allowBookmarks(granted);
      });
    });
  }

  allowBookmarks(granted: boolean) {
    if (granted) {
      this.hasBookmarkPermission = true;
    } else {
      this.hasBookmarkPermission = false;
    }
  }

  checkTopSitesPermission() {
    const that = this;
    chrome.permissions.contains({permissions: ['topSites']}, function(result) {
      that.zone.run(() => {
        that.allowTopSites(result);
      });
    });
  }

  setTopSitesPermission() {
    const that = this;
    chrome.permissions.request({permissions: ['topSites']}, function(granted) {
      that.zone.run(() => {
        that.allowTopSites(granted);
      });
    });
  }

  allowTopSites(granted: boolean) {
    if (granted) {
      this.hasTopSitesPermission = true;
    } else {
      this.hasTopSitesPermission = false;
    }
  }

  resetEdit() {
    let lng = this.settings.config.bookmarks.length;
    this.editMode = new Array(lng);
    this.editMode.fill(false);
  }

  addLink(model: any, isValid: boolean) {
    if (isValid) {
      this.isInvalid = false;
      let id = this.shared.createID('LINK');
      let label = model.value.label;
      let url = this.checkLink(model.value.url);
      this.settings.config.bookmarks.links.push({
        id: id,
        label: label,
        url: url,
      });
      this.resetEdit();
      model.resetForm();
    } else {
      this.isInvalid = true;
    }
  }

  updateLink(label: string, url: string, index: number, isValid: boolean) {
    if (isValid) {
      this.settings.config.bookmarks.links[index].label = label;
      this.settings.config.bookmarks.links[index].url = this.checkLink(url);
      this.resetEdit();
    }
  }

  swap(arr: any[], from: number, to: number) {
    arr.splice(from, 1, arr.splice(to, 1, arr[from])[0]);
  }

  enterEditMode(index: number) {
    this.resetEdit();
    this.editMode[index] = true;
  }

  ifEdit(index: number) {
    return this.editMode[index];
  }

  deleteLink(link: any[], index: number) {
    this.settings.config.bookmarks.links.splice(index, 1);
    this.resetEdit();
  }

  checkLink(value) {
    if (value !== undefined) {
      value = (value.indexOf('//') === -1) ? 'http://' + value : value;
    }
    return value;
  }

  trackByFn(index: any, item: any) {
    return index;
  }
}
