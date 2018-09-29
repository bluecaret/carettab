/*
 * ng2-chrome-storage
 * @author Hasan Hameed <hasan.hameed07@gmail.com>
 * Url: https://github.com/hasanhameed07/ng2-chrome-storage.git
 *
 * Modified by BlueCaret (John Hancock) <john@jwh.design>
 */
export class Settings {
  storeKey = 'carettab';  // identifier to be used as a key for storage
  data = {
    lang: 10,
    design: {
      scalingMethod: true,
      scaling: 50,
      font: 100,
      background: '#ffffff',
      foreground: '#000000',
      optionsToggle: true,
      startupAnimation: true
    },
    bookmarks: {
      bookmarksBar: true,
      quickLinks: true,
      bookmarkScaling: 50,
      quickLinkScaling: 50,
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
          scaling: 50,
          font: 'Roboto',
          span: 40,
          seconds: {
            enabled: true,
            dim: false,
            blink: false,
            scaling: 50,
            offset: 50
          },
          twentyFour: false,
          meridiem: {
            enabled: true,
            dim: true,
            scaling: 50,
            offset: 50
          },
          delimiter: {
            enabled: true,
            dim: true,
            blink: true,
            symbol: ':',
            scaling: 50,
            offset: 50
          },
          brackets: {
            enabled: true,
            dim: true,
            left: '{',
            right: '}',
            scaling: 50,
            offset: 50
          },
          analog: {
            enabled: false,
            style: 10
          }
        }
      ]
    },
    search: {
      enabled: true,
      scaling: 50,
      engine: 10,
      autoComplete: true
    },
    message: {
      enabled: false,
      scaling: 50,
      text: 'Hello world!'
    },
    title: {
      type: 10,
      text: 'New Tab',
      clockUsed: 0
    }
  };
}
