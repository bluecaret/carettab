export class Settings {
  storeKey = 'carettab';  // identifier to be used as a key for storage
  data = {
    lang: 10,
    design: {
      scalingMethod: true,
      scaling: 10,
      offlineFont: true,
      font: 41,
      background: '#ffffff',
      foreground: '#000000',
      optionsToggle: true,
      startupAnimation: true
    },
    bookmarks: {
      bookmarksBar: {
        enabled: false,
        icons: true,
        mostVisited: false,
        bookmarksManager: false,
        history: false,
        apps: false,
        chromeTab: false
      },
      quickLinks: {
        enabled: false,
        icons: true,
        scaling: 10,
        mostVisited: false,
        bookmarksManager: false,
        history: false,
        apps: false,
        chromeTab: false
      },
      links: [
        {
          label: 'Google',
          url: 'https://www.google.com/'
        },
        {
          label: 'Gmail',
          url: 'https://www.gmail.com/'
        },
        {
          label: 'YouTube',
          url: 'https://www.youtube.com/'
        }
      ]
    },
    time: {
      clocks: [
        {
          timezone: 'Automatic',
          scaling: 10,
          span: 40,
          padding: 10,
          offset: 1,
          order: 2.
          twentyFour: false,
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
            offset: 2
          },
          brackets: {
            enabled: true,
            dim: false,
            left: '[',
            right: ']',
            scaling: 10,
            offset: -1,
            padding: 1
          },
          analog: {
            enabled: false,
            style: 10
          }
        }
      ]
    },
    date: {
      enabled: true,
      scaling: 6,
      offset: 16,
      order: 3,
      timezone: 'Automatic',
      format: 20,
      short: {
        enabled: false,
        delimiter: '/'
      },
      year: {
        enabled: true,
        twoDigit: false
      },
      month: {
        enabled: true,
        abbr: false,
        twoDigit: false
      },
      day: {
        enabled: true,
        twoDigit: false
      },
      dayOfWeek: {
        enabled: true,
        abbr: false
      },
      week: {
        enabled: false,
        label: 'Week',
        scaling: 10,
        offset: 0,
      },
    },
    search: {
      enabled: false,
      scaling: 6,
      offset: 0,
      order: 1,
      width: 13,
      engine: 10,
      autocomplete: true
    },
    message: {
      enabled: false,
      scaling: 8,
      offset: 0,
      order: 0,
      text: 'Hello world!'
    },
    title: {
      type: 10,
      text: 'Hello world!',
      clockUsed: 1
    }
  };
}
