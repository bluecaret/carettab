import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { Storage } from '../../_storage/storage.service';
import { SharedService } from '../shared.service';
import { languages } from '../lists/lists';

export interface IntroModel {
}

@Component({
  selector: 'intro-modal',
  templateUrl: 'intro-modal.component.html',
  host: {'class': 'introModal'}
})
export class IntroModalComponent extends SimpleModalComponent<IntroModel, boolean> implements IntroModel, OnInit {
  languages = languages;

  constructor(
    public settings: Storage,
    public shared: SharedService,
    private translate: TranslateService
  ) {
    super();
  }

  ngOnInit() {
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }
}
