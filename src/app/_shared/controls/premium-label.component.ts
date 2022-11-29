import { Component } from '@angular/core';
import { Storage } from '../../_storage/storage.service';

@Component({
  selector: 'premium-label',
  template: `
    <button
      type="button"
      class="premiumLabel"
      [title]="true ? 'Thank you for subscribing to Premium. Enjoy the benefits!' : 'Sign up for Premium to access this feature'"
      >
      <span class='matIcon'>diamond</span>
    </button>
  `,
  host: {'class': 'premiumLabelWrap'}
})

export class PremiumLabelComponent {

  constructor(
    public settings: Storage,
  ) {
  }
}
