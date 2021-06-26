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
  nw = [];
  n = [];
  ne = [];
  w = [];
  e = [];
  sw = [];
  s = [];
  se = [];
}

export class DesignSettings {
  scalingMethod = false;
  scaling = 14;
  font = 181;
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
  hideLogo = true;
}

export class MessageSettings {
  id = 'MESSAGE_1CUETHV7L63';
  enabled = false;
  random = false;
  scaling = 8;
  offset = 0;
  marginHeight = 0;
  marginWidth = 2;
  width = 100;
  position = 'c';
  textAlign = 'center';
  messageList = [
    {
      id: "MESSAGETEXT_1PCCEZ3K991",
      text: "Hello world!"
    }
  ];
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
  id = 'QUICKLINK_C5HDR1KCPMG';
  enabled = false;
  icons = true;
  scaling = 10;
  width = 100;
  offset = 0;
  padding = 5;
  marginHeight = 3;
  marginWidth = 2;
  position = 'n';
  textAlign = 'center';
  vertical = false;
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
      marginHeight: 0,
      marginWidth: 2,
      position: 'c',
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
      },
      binary:{
        enabled:false,
        dim:false
      }
    }
  ];
}

export class DateSettings {
  id = 'DATE_183AQFVON78';
  enabled = true;
  scaling = 6;
  offset = 0;
  marginHeight = 0;
  marginWidth = 10;
  position = 'c';
  timezone = 'Automatic';
  dimDelimiter = false;
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
  marginHeight = 0;
  marginWidth = 10;
  position = 'c';
  width = 21;
  engine = 40;
  autocomplete = true;
  label = 'Search the web...';
}

export class WeatherSettings {
  id = 'WEATHER_KS096NVA56';
  enabled = false;
  scaling = 12;
  offset = 0;
  position = 's';
  padding = 5;
  marginHeight = 2;
  marginWidth = 4;
  location = {
    url: 'seattle-washington-united-states-of-america'
  };
  celsius = false;
  metric = false;
  preciseDigits = false;
  current = {
    enabled: true,
    icon: {
      enabled: true,
      size: 28
    },
    temp: {
      currently: true,
      feelsLike: true,
      degree: true
    },
    wind: {
      enabled: true
    },
    humidity: {
      enabled: true
    },
    pressure: {
      enabled: false
    },
    astro: {
      moonPhase: false,
      sunrise: false,
      sunset: false
    }
  };
  forecast = {
    enabled: false,
    days: 3,
    horizontal: true,
    icon: {
      enabled: true,
      size: 20
    },
    day: {
      enabled: true
    },
    temp: {
      high: true,
      low: true,
      degree: true
    }
  };
}

export class MiscSettings {
  schema = '1.0';
  enableAnalytics = true;
  disableSelect = true;
  title = {
    type: 10,
    text: 'Hello world!',
    clockUsed: 1
  };
}

export class Settings {
  order = new OrderSettings();
  design = new DesignSettings();
  messages = new MessageSettings();
  i18n = new I18nSettings();
  bookmark = new BookmarkSettings();
  quickLink = new QuickLinkSettings();
  time = new TimeSettings();
  date = new DateSettings();
  search = new SearchSettings();
  weather = new WeatherSettings();
  misc = new MiscSettings();
}
