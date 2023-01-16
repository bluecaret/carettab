import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { SharedService } from '../shared.service';
import { ExtPay } from "../../../js/ExtPay";

export interface PremiumModel {
}

@Component({
  selector: 'premium-modal',
  templateUrl: 'premium-modal.component.html',
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
