export class Defaults {
  global = {
    schema: '2.0',
    lang: 'en',
    hideSettings: false,
    mode: 'auto',
    disableSelection: false,
    wallpaper: {
      background: [220, 25, 10, 1],
      type: 'default',
      id: '',
      timestamp: '',
      size: 'cover',
      filter: 'normal',
      brightness: 10,
      saturation: 10,
      contrast: 10,
      blur: 0,
      scale: 100,
      lock: false,
    },
    wallpaperApi: {
      photoTitle: '',
      photoLink: '',
      photoAlt: '',
      authorName: '',
      authorLink: '',
      listName: '',
      listLink: '',
    },
    tabTitle: {
      type: 'newtab',
      custom: 'CaretTab: New tab page',
      datetime: 'ff',
      timezone: 'local',
    },
    font: {
      color: [220, 15, 85, 1],
      shadow: [true, 1, 1, 2, 0, 0, 0, 1],
      family: 'Source Sans 3',
      size: 20,
      bold: 400,
      italic: false,
      underline: false,
      transform: 'none',
      letterSpacing: 0,
    },
    container: {
      background: [0, 0, 0, 0],
      shadow: [false, 0, 0, 20, 0, 0, 0, 0.35],
      borderColor: [0, 0, 0, 0.15],
      borderSize: 0,
      radius: 8,
      padding: 0,
    },
    element: {
      primaryColor: [220, 15, 85, 1],
      secondaryColor: [220, 15, 60, 1],
      tertiaryColor: [220, 15, 40, 1],
      shadow: [true, 1, 1, 2, 0, 0, 0, 1],
    },
  }
  toolbar = {
    on: false,
    background: [0, 0, 0, 0.4],
    foreground: [0, 0, 90, 1],
    shadow: [true, 0, 0, 20, 0, 0, 0, 0.35],
    borderColor: [0, 0, 0, 0.15],
    borderSize: 1,
    size: 64,
    align: 'flex-start',
    tools: [
      {
        id: 'calculator',
        on: true,
      },
      {
        id: 'converter',
        on: true,
      },
      {
        id: 'timer',
        on: true,
        sound: true,
      },
      {
        id: 'stopwatch',
        on: true,
      },
      {
        id: 'passwordGenerator',
        on: true,
      },
      {
        id: 'aiChat',
        on: true,
        apiKey: '',
        model: 'gpt-3.5-turbo',
      },
    ],
  }
  layers = []
}
