import { Component } from "@angular/core";
import { SharedService } from "../../_shared/shared.service";
import { Storage } from "../../_storage/storage.service";

@Component({
  selector: "tab-message",
  templateUrl: "message.component.html",
  host: { class: "message" },
})
export class TabMessageComponent {
  constructor(public shared: SharedService, public settings: Storage) {
    if (this.settings.config.message.texts.length > 0) {
      this.settings.config.message.text =
        this.settings.config.message.texts[
          this.shared.getRandomNumber(
            0,
            this.settings.config.message.texts.length
          )
        ];
    }
  }
}
