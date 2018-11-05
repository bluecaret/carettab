import { Component, OnInit } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { offlineFontList, colors } from '../../_shared/lists/lists';

@Component({
  selector: 'options-design',
  templateUrl: 'design.component.html'
})
export class OptionsDesignComponent implements OnInit {
  fonts = offlineFontList;
  colors = colors;
  currentFont: string;

  constructor(public settings: Storage) {
  }

  ngOnInit() {
    this.getFont();
  }

  saveAll() {
    this.settings.setAll(this.settings.config);
  }

  getFont() {
    let f = this.fonts.find(x => x.id === this.settings.config.design.font).label;
    this.currentFont = '"' + f + '"';
  }

  setFont(font: string) {
    return '"' + font + '"';
  }

  setColors(bg: string, fg: string) {
    this.settings.config.design.background = bg;
    this.settings.config.design.foreground = fg;
  }

}
