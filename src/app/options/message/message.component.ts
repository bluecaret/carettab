import { Component, ElementRef, ViewChild } from "@angular/core";
import { Storage } from "../../_storage/storage.service";
import { SharedService } from "../../_shared/shared.service";
import { GoogleAnalyticsService } from "../../_shared/ga.service";

@Component({
  selector: "options-message",
  templateUrl: "message.component.html",
})
export class OptionsMessageComponent {
  isInvalid = false;
  public message: ElementRef;
  constructor(
    public shared: SharedService,
    public settings: Storage,
    public ga: GoogleAnalyticsService
  ) {}

  addMessage(model, isValid) {
    debugger;
    if (isValid && model.value.message.trim().length > 0) {
      this.isInvalid = false;
      let id = this.shared.createID("message");
      this.settings.config.messages.messageList.push({
        id,
        text: model.value.message,
      });
      model.resetForm();
    } else {
      this.isInvalid = true;
    }
  }

  removeMessage(index) {
    this.settings.config.messages.messageList.splice(index, 1);
  }

  swap(arr: any[], from: number, to: number) {
    arr.splice(from, 1, arr.splice(to, 1, arr[from])[0]);
  }
}
