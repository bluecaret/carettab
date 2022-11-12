import { Component, HostBinding } from '@angular/core';
import { Storage } from '../../_storage/storage.service';
import { searchEngines } from '../../_shared/lists/lists';
import { SharedService } from '../../_shared/shared.service';

@Component({
  selector: 'options-search',
  templateUrl: 'search.component.html'
})
export class OptionsSearchComponent {
  @HostBinding('class') hostClass: string = 'panelPlate panelPage';
  engines = searchEngines;

  constructor(
    public shared: SharedService,
    public settings: Storage,
  ) {
  }

  findEngine(engine) {
    return this.engines.find(x => x.id === engine)
  }

}
