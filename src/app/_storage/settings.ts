export class OrderSettings {
  items = [
    {
      id: 'SEARCH_1QUHAEPMFGX',
      order: 1
    },
    {
      id: 'CLOCK_QEXA4RAH17',
      order: 2
    },
    {
      id: 'DATE_183AQFVON78',
      order: 3
    }
  ];
}

export class DesignSettings {
  scalingMethod = false;
  scaling = 14;
  font = 91;
  customFont = 'Comic Sans MS';
  customFontWeight = 40;
  background = '#ffffff';
  foreground = '#000000';
  colorsId = 0;
  patternId = 0;
  imageSize = 10;
  imageBlend = 10;
  brightness = 10;
  hideMenu = false;
  hideLogo = false;
}

export class MessageSettings {
  id = 'MESSAGE_1CUETHV7L63';
  enabled = false;
  scaling = 8;
  offset = 0;
  text = 'Hello world!';
}

export class I18nSettings {
  lang = 'en-US';
}

export class BookmarkSettings {
  enabled = false;
  icons = true;
  mostVisited = false;
  bookmarksManager = false;
  history = false;
  apps = false;
  chromeTab = false;
}

export class QuickLinkSettings {
  enabled = false;
  icons = true;
  scaling = 10;
  mostVisited = false;
  bookmarksManager = false;
  history = false;
  apps = false;
  chromeTab = false;
  links = [
    {
      id: 'LINK_2OKQ6AXD3ZW',
      label: 'Google',
      url: 'https://www.google.com/'
    },
    {
      id: 'LINK_1EXP1722D1K',
      label: 'Gmail',
      url: 'https://gmail.com/'
    },
    {
      id: 'LINK_2EEUNROCLLG',
      label: 'YouTube',
      url: 'https://www.youtube.com/'
    }
  ];
}

export class TimeSettings {
  clocks = [
    {
      id: 'CLOCK_QEXA4RAH17',
      timezone: 'Automatic',
      scaling: 10,
      span: 40,
      padding: 10,
      offset: 0,
      twentyFour: false,
      twoDigit: false,
      label: {
        text: 'Main clock',
        enabled: false,
        dim: false,
        scaling: 10,
        offset: 0
      },
      relativeTime: {
        enabled: false,
        dim: false,
        scaling: 10,
        offset: 0
      },
      seconds: {
        enabled: true,
        dim: false,
        scaling: 20,
        offset: 0
      },
      meridiem: {
        enabled: true,
        dim: false,
        scaling: 10,
        offset: 0,
        am: 'am',
        pm: 'pm'
      },
      delimiter: {
        enabled: true,
        dim: true,
        blink: false,
        symbol: ':',
        scaling: 10,
        offset: 0
      },
      brackets: {
        enabled: false,
        dim: false,
        left: '[',
        right: ']',
        scaling: 10,
        offset: 0,
        padding: 1
      },
      analog: {
        enabled: false,
        style: 10
      }
    }
  ];
}

export class DateSettings {
  id = 'DATE_183AQFVON78';
  enabled = true;
  scaling = 6;
  offset = 0;
  timezone = 'Automatic';
  format = 20;
  short = {
    enabled: false,
    delimiter: '/'
  };
  year = {
    enabled: true,
    twoDigit: false
  };
  month = {
    enabled: true,
    abbr: false,
    twoDigit: false
  };
  day = {
    enabled: true,
    twoDigit: false
  };
  dayOfWeek = {
    enabled: true,
    abbr: false
  };
  week = {
    enabled: false,
    label: 'Week',
    scaling: 10,
    offset: 0,
    iso: false
  };
}

export class SearchSettings {
  id = 'SEARCH_1QUHAEPMFGX';
  enabled = true;
  scaling = 4;
  offset = 0;
  width = 21;
  engine = 40;
  autocomplete = true;
  label = 'Search the web...';
}

export class MiscSettings {
  schema = '1.0';
  enableAnalytics = true;
  title = {
    type: 10,
    text: 'Hello world!',
    clockUsed: 1
  }
}

export class Settings {
  order = new OrderSettings();
  design = new DesignSettings();
  message = new MessageSettings();
  i18n = new I18nSettings();
  bookmark = new BookmarkSettings();
  quickLink = new QuickLinkSettings();
  time = new TimeSettings();
  date = new DateSettings();
  search = new SearchSettings();
  misc = new MiscSettings();
}
