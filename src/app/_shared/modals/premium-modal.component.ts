import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { SharedService } from '../shared.service';
import { ExtPay } from "../../../js/ExtPay";

export interface PremiumModel {
}

@Component({
  selector: 'premium-modal',
  template: `
    <div class="premiumModalContent">
      <button class="premiumModalClose" type='button' (click)="close()">
        <span class='matIcon'>close</span>
      </button>
      <div class="matIcon premiumModalIcon">diamond</div>


      <div *ngIf="!shared.paid && !isJustSubscribed">
        <h2 class="premiumModalHeading">Premium Access</h2>
        <p class="premiumModalSubheading">Support the development of CaretTab with a Premium subscription. Here&apos;s what you get:</p>
        <ul class="premiumModalFeatures">
          <li><span class='matIcon'>imagesmode</span><div>Background images<div>Display a random background on each tab. Backgrounds provided by Unsplash.</div></div></li>
          <li><span class='matIcon'>blur_on</span><div>Background effects<div>Change the brightness, saturation, opacity and blur of the background image.</div></div></li>
          <li><span class='matIcon'>format_italic</span><div>Fonts<div>Change the text font from the supplied list or use your own installed fonts.</div></div></li>
          <li><span class='matIcon'>diamond</span><div>And more!<div>Even more premium features available now and planned for the future!</div></div></li>
        </ul>
        <div class="premiumModalFooter">
          <div class="premiumModalPrice">Only <span>$2</span> per month!</div>
          <button class="premiumModalBtn premiumModalSubscribeBtn" type='button' (click)="handleSubscribe()">
            Subscribe now
          </button>
        </div>
      </div>


      <div *ngIf="shared.paid && !isJustSubscribed">
        <h2 class="premiumModalHeading"><span class="premiumModalSubscribedHeading">Thank you for your support by subscribing to</span><span>Premium Access</span></h2>
        <p class="premiumModalSubheading">By paying for Premium Access you receive many benefits within CaretTab including random background images, background effects, and more. Paying for Premium Access helps support the development of CaretTab. If you would like to cancel or manage your subscription you can click the button below.</p>
        <div class="premiumModalFooter">
          <button class="premiumModalBtn premiumModalSubscribeBtn" type='button' (click)="handleSubscribe()">
            Manage or cancel subscription
          </button>
        </div>
      </div>


      <div *ngIf="isJustSubscribed">
        <h2 class="premiumModalHeading"><span class="premiumModalSubscribedHeading">Thank you! You are now subscribed to</span><span>Premium Access</span></h2>
        <p class="premiumModalSubheading">In order for premium features to be fully enabled, it is recommended to reload your tab.</p>
        <div class="premiumModalFooter">
          <button class="premiumModalBtn premiumModalSubscribeBtn" type='button' (click)="handleReload()">
            Reload tab and enjoy!
          </button>
        </div>
      </div>


      <div class="premiumModalDisclaimer">
        Subscription billed on a monthly recurring basis. Cancel at any time for any reason.
        <br />Payments processed via Stripe through ExtensionPay. View the
        <a [href]="privacyLink" rel="noreferrer" target="_blank">privacy policy</a>.
      </div>
    </div>
  `,
  host: {'class': 'premiumModal'}
})
export class PremiumModalComponent extends SimpleModalComponent<PremiumModel, boolean> implements PremiumModel, OnInit {
  privacyLink = "https://www.bluecaret.com/privacy/";
  extpay;
  isJustSubscribed = false;

  constructor(public shared: SharedService) {
    super();
    this.extpay = ExtPay("carettab");
  }

  ngOnInit() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.command === 'update-paid-status') {
        // console.log('Show just paid screen', request.user);
        this.isJustSubscribed = true;
        sendResponse(true);
        return true;
      }
      return false;
    });
  }

  handleReload() {
    window.location.reload();
  }

  handleSubscribe() {
    this.extpay.openPaymentPage();
    // we set modal result as true on click on confirm button,
    // then we can get modal result from caller code
    // this.result = true;
    // this.close();
  }
}
