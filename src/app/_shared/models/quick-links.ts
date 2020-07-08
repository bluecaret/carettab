import { SharedService } from '../shared.service';

export class Bookmarks {
  constructor(
    bookmarksBar: boolean = false,
    quickLinks: boolean = false,
    bookmarkScaling: number = 50,
    quickLinkScaling: number = 50,
    links: Link = new Link(),
  ) {}
}

export class Link {
  constructor(
    id: string = SharedService.prototype.createID('LINK'),
    label: string = '',
    url: string = '',
  ) {}
}
