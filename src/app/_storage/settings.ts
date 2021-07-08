export class OrderSettings {
  constructor(
    public items = [
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
    ],
    public nw = [],
    public n = [],
    public ne = [],
    public w = [],
    public e = [],
    public sw = [],
    public s = [],
    public se = [],
  ) {}
}

export class DesignSettings {
  constructor(
    public scalingMethod = false,
    public scaling = 14,
    public font = 181,
    public customFont = 'Comic Sans MS',
    public customFontWeight = 40,
    public background = '#ffffff',
    public foreground = '#000000',
    public colorsId = 0,
    public patternId = 0,
    public imageSize = 10,
    public imageBlend = 10,
    public brightness = 10,
    public hideMenu = false,
    public hideLogo = true,
  ) {}
}

export class MessageSettings {
  constructor(
    public id = 'MESSAGE_1CUETHV7L63',
    public enabled = false,
    public random = false,
    public scaling = 8,
    public offset = 0,
    public marginHeight = 0,
    public marginWidth = 2,
    public width = 100,
    public position = 'c',
    public textAlign = 'center',
    public messageList = [
      {
        id: "MESSAGETEXT_1PCCEZ3K991",
        text: "Hello world!"
      }
    ],
  ) {}
}

export class I18nSettings {
  constructor(
    public lang = 'en-US',
  ) {}
}

export class BookmarkSettings {
  constructor(
    public enabled = false,
    public icons = true,
    public mostVisited = false,
    public bookmarksManager = false,
    public history = false,
    public apps = false,
    public chromeTab = false,
  ) {}
}

export class QuickLinkSettings {
  constructor(
    public id = 'QUICKLINK_C5HDR1KCPMG',
    public enabled = false,
    public icons = true,
    public scaling = 10,
    public width = 100,
    public offset = 0,
    public padding = 5,
    public marginHeight = 3,
    public marginWidth = 2,
    public position = 'n',
    public textAlign = 'center',
    public vertical = false,
    public mostVisited = false,
    public bookmarksManager = false,
    public history = false,
    public apps = false,
    public chromeTab = false,
    public links = [
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
    ],
  ) {}
}

export class CovidSettings {
  enabled = false;
  countries = [
  ]
}

export class TimeSettings {
  constructor(
    public clocks = [
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
        binary: {
          enabled: false,
          dim: false
        }
      }
    ],
  ) {}
}

export class DateSettings {
  constructor(
    public id = 'DATE_183AQFVON78',
    public enabled = true,
    public scaling = 6,
    public offset = 0,
    public marginHeight = 0,
    public marginWidth = 10,
    public position = 'c',
    public timezone = 'Automatic',
    public dimDelimiter = false,
    public format = 20,
    public short = {
      enabled: false,
      delimiter: '/'
    },
    public year = {
      enabled: true,
      twoDigit: false
    },
    public month = {
      enabled: true,
      abbr: false,
      twoDigit: false
    },
    public day = {
      enabled: true,
      twoDigit: false
    },
    public dayOfWeek = {
      enabled: true,
      abbr: false
    },
    public week = {
      enabled: false,
      label: 'Week',
      scaling: 10,
      offset: 0,
      iso: false
    },
  ) {}
}

export class SearchSettings {
  constructor(
    public id = 'SEARCH_1QUHAEPMFGX',
    public enabled = true,
    public scaling = 4,
    public offset = 0,
    public marginHeight = 0,
    public marginWidth = 10,
    public position = 'c',
    public width = 21,
    public engine = 40,
    public autocomplete = true,
    public label = 'Search the web...',
  ) {}
}

export class WeatherSettings {
  constructor(
    public id = 'WEATHER_KS096NVA56',
    public enabled = false,
    public scaling = 12,
    public offset = 0,
    public position = 's',
    public padding = 5,
    public marginHeight = 2,
    public marginWidth = 4,
    public location = {
      url: 'seattle-washington-united-states-of-america'
    },
    public celsius = false,
    public metric = false,
    public preciseDigits = false,
    public current = {
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
    },
    public forecast = {
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
    },
  ) {}
}

export class MiscSettings {
  constructor(
    public schema = '1.1',
    public enableAnalytics = true,
    public disableSelect = true,
    public title = {
      type: 10,
      text: 'Hello world!',
      clockUsed: 1
    },
  ) {}
}

export class Settings {
  constructor(
    public order = new OrderSettings(),
    public design = new DesignSettings(),
    public messages = new MessageSettings(),
    public i18n = new I18nSettings(),
    public bookmark = new BookmarkSettings(),
    public quickLink = new QuickLinkSettings(),
    public time = new TimeSettings(),
    public covidData = new CovidSettings(),
    public date = new DateSettings(),
    public search = new SearchSettings(),
    public weather = new WeatherSettings(),
    public misc = new MiscSettings(),
  ) {}
}
