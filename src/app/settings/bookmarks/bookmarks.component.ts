import { Component, OnInit, HostBinding } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Links, Link } from './link';

@Component({
  selector: 'app-s-bookmarks',
  templateUrl: 'bookmarks.component.html'
})
export class BookmarksComponent implements OnInit {
  @HostBinding('class.page') pageClass = true;

  editMode: boolean[];
  links: Links[];
  numLinks: number;
  currentLink: number;
  dataContent: boolean;

  constructor() {
    this.links = [];
    this.numLinks = 0;
  }

  ngOnInit() {
    this.getStorage();
    setTimeout(() => {
      console.log(this.links);
    }, 500);
  }

  resetEdit(lng: number) {
    this.editMode = new Array(lng);
    this.editMode.fill(false);
  }

  getStorage() {
    chrome.storage.sync.get('links', (data) => {
      this.links = data.links ? data.links : [];
      this.numLinks = data.links ? data.links.length : 0;
      this.resetEdit(this.links.length);
    });
  }

  addLink(model: any, isValid: boolean) {
    model.value.url = this.checkLink(model.value.url);
    this.links.push(model.value);
    chrome.storage.sync.set({'links': this.links});
    this.resetEdit(this.links.length);
    model.reset();
  }

  saveLink(index: number) {
    
  }

  toggleEdit(index: number) {
    this.editMode[index] = !this.editMode[index];
  }

  ifEdit(index: number) {
    return this.editMode[index];
  }

  deleteLink(index: number) {
    this.links.splice(index, 1);
    chrome.storage.sync.set({'links': this.links});
    this.resetEdit(this.links.length);
  }

  onSubmit(form: NgForm) {
    this.links.push(form.value);
    this.updateData();
  }

  updateData() {
    this.dataContent = false;
    this.dataContent = (this.links.length > 0) ? true : false;
  }

  checkLink(value) {
    if (value !== undefined) {
      value = (value.indexOf('//') === -1) ? 'http://' + value : value;
    }
    return value;
  }
}
