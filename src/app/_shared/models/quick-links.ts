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
    label: string = '',
    url: string = '',
  ) {}
}
