export class Settings {
  storeKey = 'carettab';  // identifier to be used as a key for storage
  data = {
    lang: 10,
    design: {
      scalingMethod: true,
      scaling: 10,
      offlineFont: true,
      font: 100,
      background: '#ffffff',
      foreground: '#000000',
      optionsToggle: true,
      startupAnimation: true
    },
    bookmarks: {
      bookmarksBar: {
        enabled: false,
        scaling: 10,
        mostVisited: false,
        bookmarksManager: false,
        history: false,
        apps: false,
        chromeTab: false
      },
      quickLinks: {
        enabled: false,
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
          label: '',
          timezone: 'Automatic',
          scaling: 14,
          span: 40,
          relativeTime: false,
          twentyFour: false,
          seconds: {
            enabled: true,
            dim: false,
            blink: false,
            scaling: 10,
            offset: 0
          },
          meridiem: {
            enabled: true,
            dim: true,
            scaling: 10,
            offset: 0
          },
          delimiter: {
            enabled: true,
            dim: false,
            blink: true,
            symbol: ':',
            scaling: 10,
            offset: 0
          },
          brackets: {
            enabled: true,
            dim: true,
            left: '{',
            right: '}',
            scaling: 10,
            offset: 0
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
      scaling: 10,
      offset: 0,
      placement: 1,
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
        label: 'Week'
      },
    },
    search: {
      enabled: true,
      scaling: 10,
      engine: 10,
      autocomplete: true
    },
    message: {
      enabled: false,
      scaling: 10,
      text: 'Hello world!'
    },
    title: {
      type: 10,
      text: 'New Tab',
      clockUsed: 1
    }
  };
}
