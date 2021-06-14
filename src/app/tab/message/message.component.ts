import { Component } from "@angular/core";
import { SharedService } from "../../_shared/shared.service";
import { Storage } from "../../_storage/storage.service";

@Component({
  selector: "tab-message",
  templateUrl: "message.component.html",
  host: { class: "message" },
})
export class TabMessageComponent {
  public message = '';
  constructor(public shared: SharedService, public settings: Storage) {
    if (this.settings.config.messages.messageList.length > 0) {
      this.message =
        this.settings.config.messages.messageList[
          this.shared.getRandomNumber(
            0,
            this.settings.config.messages.messageList.length
          )
        ].text;
    }
  }
}
