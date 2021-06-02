import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '../../_storage/storage.service';
import { title, languages } from '../../_shared/lists/lists';
import { SharedService } from '../../_shared/shared.service';
import { GoogleAnalyticsService } from '../../_shared/ga.service';

@Component({
  selector: 'options-extra',
  templateUrl: 'extra.component.html'
})
export class OptionsExtraComponent {
  titleOptions = title;
  languages = languages;

  constructor(
    public settings: Storage,
    private translate: TranslateService,
    public shared: SharedService,
    public ga: GoogleAnalyticsService
  ) {
  }

  // Reset settings
  reset() {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      this.settings.clear();
      localStorage.removeItem('bgImg');
      localStorage.removeItem('ct-background');
      this.shared.echo('Background removed from localStorage', null, null, 'save');
      localStorage.setItem('ct-enableAnalytics', 'true')
      location.reload();
    } else {
      return;
    }
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }

  enableAnalytics(enable: boolean) {
    console.log('enable', enable);
    enable === true ?
      localStorage.setItem('ct-enableAnalytics', 'true') : localStorage.setItem('ct-enableAnalytics', 'false');
  }
}
