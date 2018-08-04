import { Component } from '@angular/core';
import { Storage } from '../../_storage/storage.service';

@Component({
  selector: 'options-bookmarks',
  templateUrl: 'bookmarks.component.html'
})
export class OptionsBookmarksComponent {
  editMode: boolean[] = [];
  isInvalid = false;

  constructor(public settings: Storage) {
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
    if (isValid) {
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

  deleteLink(link: any[], index: number) {
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
