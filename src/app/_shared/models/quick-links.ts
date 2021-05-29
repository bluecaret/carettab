import { SharedService } from '../shared.service';

export class Link {
  constructor(
    id: string = SharedService.prototype.createID('LINK'),
    label: string = '',
    url: string = '',
  ) {}
}
