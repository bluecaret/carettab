import { Component, OnInit, NgZone, HostBinding, Output, EventEmitter } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { fade } from '../../_shared/animations';
import { SharedService } from '../../_shared/shared.service';

@Component({
  selector: 'options-bookmarks',
  templateUrl: 'bookmarks.component.html',
  animations: [fade]
})
export class OptionsBookmarksComponent implements OnInit {
  @HostBinding('class') hostClass: string = 'panelPlate panelPage';
  @Output() goTo: EventEmitter<string> = new EventEmitter<string>();
  editMode: boolean[] = [];
  isInvalid = false;
  hasFaviconPermission: boolean;
  hasBookmarkPermission: boolean;
  hasTopSitesPermission: boolean;

  // Old link recovery
  foundOldQuickLinks = false;
  recoveredQuickLinks = [];
  printRecoveredQuickLinks: any;
  importStatus = '';

  constructor (
    public settings: Storage,
    public shared: SharedService,
    private zone: NgZone,
  ) {
  }

  ngOnInit() {
    this.checkFaviconPermission();
    this.checkBookmarkPermission();
    this.checkTopSitesPermission();

    chrome.storage.sync.get((a) => {
      this.printRecoveredQuickLinks = '';
      if (a.links && a.links.length > 0) {
        for (let i = 0; i < a.links.length; i++) {
          this.printRecoveredQuickLinks += a.links[i].label + ' <' + a.links[i].url + '>\n'  ;
          this.recoveredQuickLinks.push({id: this.shared.createID('LINK'), label: a.links[i].label, url: a.links[i].url});
        }
        this.foundOldQuickLinks = true;
      } else {
        this.printRecoveredQuickLinks = 'No Quick Links found.';
        this.foundOldQuickLinks = false;
      }
    });
  }

  // Add fake old quick links for testing:
  // chrome.storage.sync.set({links: [{label: "Test", url: "https://test.com"},{label: "Lorem", url: "https://lorem.com"}]})

  checkFaviconPermission() {
    const that = this;
    chrome.permissions.contains({permissions: ['favicon']}, function(result) {
      that.zone.run(() => {
        if (chrome.runtime.lastError) {
          that.shared.echo('Error checking Favicon permission', chrome.runtime.lastError, '', 'error');
        }
        that.shared.echo('Permission check: Favicon allowed?', result);
        that.allowFavicon(result);
      });
    });
  }

  setFaviconPermission() {
    const that = this;
    chrome.permissions.request({permissions: ['favicon']}, function(granted) {
      that.zone.run(() => {
        if (chrome.runtime.lastError) {
          that.shared.echo('Error setting Favicon permission', chrome.runtime.lastError, '', 'error');
        }
        that.shared.echo('Set Permission: Favicon', granted);
        that.allowFavicon(granted);
      });
    });
  }

  allowFavicon(granted: boolean) {
    if (granted) {
      this.hasFaviconPermission = true;
    } else {
      this.hasFaviconPermission = false;
    }
  }

  checkBookmarkPermission() {
    const that = this;
    chrome.permissions.contains({permissions: ['bookmarks']}, function(result) {
      that.zone.run(() => {
        if (chrome.runtime.lastError) {
          that.shared.echo('Error checking Bookmark permission', chrome.runtime.lastError, '', 'error');
        }
        that.shared.echo('Permission check: Bookmark allowed?', result);
        that.allowBookmarks(result);
      });
    });
  }

  setBookmarkPermission() {
    const that = this;
    chrome.permissions.request({permissions: ['bookmarks']}, function(granted) {
      that.zone.run(() => {
        if (chrome.runtime.lastError) {
          that.shared.echo('Error setting Bookmark permission', chrome.runtime.lastError, '', 'error');
        }
        that.shared.echo('Set Permission: Bookmark', granted);
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

  getBookmarks() {
    if (this.settings.config.bookmark.enabled) {
      chrome.bookmarks.getTree(bookmarks => {
        this.zone.run(() => {
          this.shared.allBookmarks = bookmarks[0].children[0].children;
        });
      });
    }
  }

  checkTopSitesPermission() {
    const that = this;
    chrome.permissions.contains({permissions: ['topSites']}, function(result) {
      that.zone.run(() => {
        if (chrome.runtime.lastError) {
          that.shared.echo('Error checking TopSites permission', chrome.runtime.lastError, '', 'error');
        }
        that.shared.echo('Permission check: TopSites allowed?', result);
        that.allowTopSites(result);
      });
    });
  }

  setTopSitesPermission() {
    const that = this;
    chrome.permissions.request({permissions: ['topSites']}, function(granted) {
      that.zone.run(() => {
        if (chrome.runtime.lastError) {
          that.shared.echo('Error setting TopSites permission', chrome.runtime.lastError, '', 'error');
        }
        that.shared.echo('Set Permission: TopSites', granted);
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
    let lng = this.settings.config.quickLink.links.length;
    this.editMode = new Array(lng);
    this.editMode.fill(false);
  }

  addLink(model: any, isValid: boolean) {
    if (isValid) {
      this.isInvalid = false;
      let id = this.shared.createID('LINK');
      let label = model.value.label;
      let url = this.checkLink(model.value.url);
      this.settings.config.quickLink.links.push({
        id: id,
        label: label,
        url: url,
      });
      this.shared.echo('New link added', '', {
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
      this.settings.config.quickLink.links[index].label = label;
      this.settings.config.quickLink.links[index].url = this.checkLink(url);
      this.shared.echo('Link edited', '', {
        label: label,
        url: url,
      });
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
    this.settings.config.quickLink.links.splice(index, 1);
    this.shared.echo('Link deleted', '', link);
    this.resetEdit();
  }

  checkLink(value) {
    if (value !== undefined) {
      value = (value.indexOf('//') === -1) ? 'https://' + value : value;
    }
    return value;
  }

  trackByFn(index: any, item: any) {
    return index;
  }
}
