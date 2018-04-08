import { Injectable } from '@angular/core';

export interface Bookmarks {
  quickLinks: boolean;
  links: Array<Link>;
}

export interface Link {
  label: string;
  url: string;
}

@Injectable()
export class BookmarksStore {
  // bookmarks: Bookmarks[];

  constructor() {
    
    // chrome.storage.sync.get('bookmarks', (data) => {
    //   console.log('chrome.storage: ', data.bookmarks);
    //   this.bookmarks = data.bookmarks ? data.bookmarks : new Bookmarks();
    //   chrome.storage.sync.set({'bookmarks': this.bookmarks});
    //   console.log('chrome.storage: ', this.bookmarks);
    // });

  }

  // getBookmarks(callback) {
  //   chrome.storage.sync.get('bookmarks', (data) => {
  //     let getData: Bookmarks[] = data.bookmarks ? data.bookmarks : [{
  //       'quickLinks': true, 
  //       'links': []
  //     }];
  //     chrome.storage.sync.set({'bookmarks': getData});
  //     callback(getData);
  //   });
  // }
  

  // private updateStore() {
  //   chrome.storage.sync.set({'bookmarks': this.bookmarks});
  // }

  // toggleType() {
  //   this.bookmarks.quickLinks = !this.bookmarks.quickLinks;
  //   this.updateStore();
  // }

  // add(link: Link) {
  //   this.bookmarks[0].links.push(link);
  //   this.updateStore();
  // }

  // remove(link: Link) {
  //   this.bookmarks.links.splice(this.bookmarks.links.indexOf(link), 1);
  //   this.updateStore();
  // }

  // edit(link: Link) {
  //   this.bookmarks.links.splice(this.bookmarks.links.indexOf(link), 1);
  //   this.updateStore();
  // }
}
