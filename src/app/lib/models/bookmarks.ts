export interface Bookmarks {
  quickLinks: boolean;
  links: Array<Link>;
}

export interface Link {
  label: string;
  url: string;
}
