import { Component, HostBinding } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/observable';
import { ChromeStorage } from '../../lib/storage/storage.service';
import { Link } from '../../lib/models/bookmarks';

@Component({
  selector: 'app-s-bookmarks',
  templateUrl: 'bookmarks.component.html'
})
export class BookmarksComponent {
  @HostBinding('class.page') pageClass = true;

  links: any[];
  quickLinks: boolean;
  editMode: boolean[] = [];
  isInvalid = false;

  constructor(public settings: ChromeStorage) {
  }

  resetEdit() {
    let lng = this.settings.config.bookmarks.length;
    this.editMode = new Array(lng);
    this.editMode.fill(false);
  }

  addLink(model: any, isValid: boolean) {
    if (isValid) {
      this.isInvalid = false;
      let label = model.value.label;
      let url = this.checkLink(model.value.url);
      this.settings.config.bookmarks.links.push({
        label: label,
        url: url,
      });
      this.saveAll();
      this.resetEdit();
      model.resetForm();
    } else {
      this.isInvalid = true;
    }
  }

  updateLink(label: string, url: string, index: number, isValid: boolean) {
    console.log('start updateLink');
    console.log(label, url, index, isValid);
    if (isValid) {
      console.log('updateLink isValid?');
      this.settings.config.bookmarks.links[index].label = label;
      this.settings.config.bookmarks.links[index].url = this.checkLink(url);
      this.saveAll();
      this.resetEdit();
    }
  }

  enterEditMode(index: number) {
    this.resetEdit();
    this.editMode[index] = true;
  }

  ifEdit(index: number) {
    return this.editMode[index];
  }

  deleteLink(link: Link, index: number) {
    this.settings.config.bookmarks.links.splice(index, 1);
    this.saveAll();
    this.resetEdit();
  }

  checkLink(value) {
    if (value !== undefined) {
      value = (value.indexOf('//') === -1) ? 'http://' + value : value;
    }
    return value;
  }

  saveAll() {
    this.settings.setAll(this.settings.config);
  }
}
