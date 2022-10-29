import { Component, ElementRef, ViewChild } from "@angular/core";
import { Storage } from "../../_storage/storage.service";
import { SharedService } from "../../_shared/shared.service";

@Component({
  selector: "options-message",
  templateUrl: "message.component.html",
})
export class OptionsMessageComponent {
  public newMessageTextModel: ElementRef;
  constructor(
    public shared: SharedService,
    public settings: Storage,
  ) {}

  addMessage(model, isValid) {
    if (isValid && model.value.newMessageText.trim().length > 0) {
      let id = this.shared.createID("MESSAGETEXT");
      let newText = model.value.newMessageText;
      this.settings.config.messages.messageList.push({
        id: id,
        text: newText,
      });
      this.shared.echo('New message text added', '', {
        id: id,
        text: newText
      });
      model.resetForm();
    }
  }

  removeMessage(index) {
    this.settings.config.messages.messageList.splice(index, 1);
  }
}
