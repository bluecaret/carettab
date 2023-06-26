export const widgetTypes = [
  {
    id: 'dc',
    type: 'digitalClock',
    store: 'digitalClocks',
    name: 'Digital Clock',
    icon: 'fa-hashtag',
    limit: 9999,
    desc: 'A sleek, modern way to keep track of the time, ensuring you always stay on schedule.',
  },
  {
    id: 'ac',
    type: 'analogClock',
    store: 'analogClocks',
    name: 'Analog Clock',
    icon: 'fa-clock',
    limit: 9999,
    desc: 'Embrace the charm of timeless elegance with an analog clock, offering a tasteful reminder of the passing hours and minutes.',
  },
  {
    id: 'bc',
    type: 'binaryClock',
    store: 'binaryClocks',
    name: 'Binary Clock',
    icon: 'fa-1',
    limit: 5,
    desc: 'The perfect blend of tech and timekeeping, for those who appreciate a unique, coded perspective.',
  },
  {
    id: 'dt',
    type: 'date',
    store: 'dates',
    name: 'Date',
    icon: 'fa-calendar-day',
    limit: 1,
    desc: 'Stay aligned with the rhythm of the year, displaying not only the date but also the day of the year, week of the year, and more.',
  },
  {
    id: 'wr',
    type: 'weather',
    store: 'weathers',
    name: 'Weather',
    icon: 'fa-cloud-sun',
    limit: 1,
    desc: 'Your personal meteorologist in your browser, offering key weather updates and forecasts at a glance.',
  },
  {
    id: 'td',
    type: 'todo',
    store: 'todos',
    name: 'Todo',
    icon: 'fa-clipboard-list',
    limit: 1,
    desc: 'Your personalized task list at your fingertips, ensuring you stay focused and organized by managing your tasks directly from your new tab.',
  },
  {
    id: 'np',
    type: 'notepad',
    store: 'notepads',
    name: 'Notepad',
    icon: 'fa-note-sticky',
    limit: 1,
    desc: 'Your digital canvas for thoughts, ideas, and reminders, ensuring you never miss a beat.',
  },
  {
    id: 'qt',
    type: 'quote',
    store: 'quotes',
    name: 'Quotes',
    icon: 'fa-quote-left',
    limit: 1,
    desc: 'Your personal trove of wisdom and wit, this widget showcases your favorite quotes, handpicked and added by you.',
  },
  {
    id: 'ql',
    type: 'quickLinks',
    store: 'quickLinks',
    name: 'Quick Links',
    icon: 'fa-link',
    limit: 2,
    desc: 'Your personal internet directory, curated by you, providing quick access to your favorite sites and saved bookmarks.',
  },
  {
    id: 'sb',
    type: 'searchBar',
    store: 'searchBars',
    name: 'Search Bar',
    icon: 'fa-magnifying-glass',
    limit: 1,
    desc: 'Your portal to the web, with the freedom to choose your preferred search engine for more tailored results.',
  },
  {
    id: 'ls',
    type: 'loadshedding',
    store: 'loadsheddings',
    name: 'Loadshedding',
    icon: 'fa-bolt',
    limit: 999,
    desc: 'Stay ahead of power outages with this informative widget, helping South African residents manage their schedules better.',
  },
  {
    id: 'sh',
    type: 'shape',
    store: 'shapes',
    name: 'Shape',
    icon: 'fa-shapes',
    limit: 0,
    desc: 'Add a touch of geometry to your browser, letting you personalize your new tab with a variety of shapes.',
  },
  {
    id: 'tx',
    type: 'text',
    store: 'texts',
    name: 'Text',
    icon: 'fa-align-left',
    limit: 0,
    desc: 'A customizable text area where you can write your own messages or simply use it to personalize your new tab with your favorite saying.',
  },
]

export const toolTypes = [
  { tool: 'calculator', name: 'Calculator', icon: 'fa-calculator', premium: false },
  { tool: 'passwordGenerator', name: 'Password Generator', icon: 'fa-asterisk', premium: false },
  { tool: 'aiChat', name: 'AI Chat', icon: 'fa-robot', premium: true },
]

export const languages = [
  { id: 'enUS', label: 'English', name: 'English (United States)' },
  { id: 'zhCN', label: '简体中文（中国大陆）', name: 'Simplified Chinese (China Mainland)' },
  { id: 'zhTW', label: '繁体中文（台湾）', name: 'Traditional Chinese (Taiwan)' },
  { id: 'frFR', label: 'Français', name: 'French (France)' },
  { id: 'deDE', label: 'Deutsch', name: 'German (Germany)' },
  { id: 'heIL', label: 'עברית', name: 'Hebrew (Israel)' },
  { id: 'itIT', label: 'Italiano (Italia)', name: 'Italian (Italy)' },
  { id: 'jaJP', label: '日本語', name: 'Japanese (Japan)' },
  { id: 'koKR', label: '한국어', name: 'Korean (Korea)' },
  { id: 'ptBR', label: 'Portugues (brasil)', name: 'Portuguese (Brazil)' },
  { id: 'ptPT', label: 'Portugues (portugal)', name: 'Portuguese (Portugal)' },
  { id: 'ruRU', label: 'Pусский', name: 'Russian (Russia)' },
  { id: 'esMX', label: 'Español', name: 'Spanish (Mexico)' },
  { id: 'svSE', label: 'Svenska (Sverige)', name: 'Swedish (Sweden)' },
  { id: 'ukUA', label: 'Українська', name: 'Ukrainian (Ukraine)' },
  { id: 'urPK', label: 'اردو (پاکستان)', name: 'Urdu (Pakistan)' },
  { id: 'viVN', label: 'Tiếng Việt', name: 'Vietnamese (Vietnam)' },
]

export const span = [
  { id: 10, label: '25%', css: '25%' },
  { id: 20, label: '50%', css: '50%' },
  { id: 30, label: '75%', css: '75%' },
  { id: 40, label: '100%', css: '100%' },
]

export const title = [
  { id: 10, label: '"New Tab"', i18n: 'list.title.newTab' },
  { id: 20, label: 'Time', i18n: 'list.title.time' },
  { id: 30, label: 'Date', i18n: 'list.title.date' },
  { id: 40, label: 'Time, then date', i18n: 'list.title.timeDate' },
  { id: 50, label: 'Date, then time', i18n: 'list.title.dateTime' },
  { id: 60, label: 'Custom text', i18n: 'list.title.custom' },
]

export const fontList = [
  { id: '', label: '' },
  { id: 'Anton', label: 'Anton' },
  { id: 'Cabin+Sketch', label: 'Cabin Sketch' },
  { id: 'Chelsea+Market', label: 'Chelsea Market' },
  { id: 'Comfortaa', label: 'Comfortaa' },
  { id: 'Dancing+Script', label: 'Dancing Script' },
  { id: 'EB+Garamond', label: 'EB Garamond' },
  { id: 'Exo+2', label: 'Exo 2' },
  { id: 'Inconsolata', label: 'Inconsolata' },
  { id: 'Lobster', label: 'Lobster' },
  { id: 'Lobster+Two', label: 'Lobster Two' },
  { id: 'Monoton', label: 'Monoton' },
  { id: 'Nanum+Pen+Script', label: 'Nanum Pen Script' },
  { id: 'Nixie+One', label: 'Nixie One' },
  { id: 'Open+Sans', label: 'Open Sans' },
  { id: 'Overlock+SC', label: 'Overlock SC' },
  { id: 'Quicksand', label: 'Quicksand' },
  { id: 'Special+Elite', label: 'Special Elite' },
  { id: 'Abyssinica+SIL', label: 'Abyssinica SIL' },
  { id: 'Alkalami', label: 'Alkalami' },
  { id: 'Bebas+Neue', label: 'Bebas Neue' },
  { id: 'Caveat', label: 'Caveat' },
  { id: 'Gemunu+Libre', label: 'Gemunu Libre' },
  { id: 'Josefin+Sans', label: 'Josefin Sans' },
  { id: 'Merriweather', label: 'Merriweather' },
  { id: 'Montserrat', label: 'Montserrat' },
  { id: 'Mukta', label: 'Mukta' },
  { id: 'Oswald', label: 'Oswald' },
  { id: 'Playfair+Display', label: 'Playfair Display' },
  { id: 'Raleway', label: 'Raleway' },
  { id: 'Roboto', label: 'Roboto' },
  { id: 'Roboto+Condensed', label: 'Roboto Condensed' },
  { id: 'Roboto+Mono', label: 'Roboto Mono' },
  { id: 'Roboto+Slab', label: 'Roboto Slab' },
  { id: 'Silkscreen', label: 'Silkscreen' },
  { id: 'Source+Sans+Pro', label: 'Source Sans Pro' },
  { id: 'Ubuntu', label: 'Ubuntu' },
]

export const fontWeight = [
  { id: 100, label: 'Thin' },
  { id: 200, label: 'Extra Light' },
  { id: 300, label: 'Light' },
  { id: 400, label: 'Regular' },
  { id: 500, label: 'Medium' },
  { id: 600, label: 'Semi Bold' },
  { id: 700, label: 'Bold' },
  { id: 900, label: 'Black' },
]

export const textTransform = [
  { id: 'none', label: 'Normal' },
  { id: 'capitalize', label: 'Capitalize' },
  { id: 'uppercase', label: 'Uppercase' },
  { id: 'lowercase', label: 'Lowercase' },
]

export const analogFaceStyles = [
  { id: 'none', label: 'No face' },
  { id: 'dash', label: 'Dash' },
  { id: 'dot', label: 'Dot' },
  { id: 'romanDashHour', label: 'Roman Dash Hour' },
  { id: 'romanDashQuarter', label: 'Roman Dash Quarter' },
  { id: 'arabicDashHour', label: 'Arabic Dash Hour' },
  { id: 'arabicDashQuarter', label: 'Arabic Dash Quarter' },
  { id: 'swiss', label: 'Swiss' },
]

export const analogHandStyles = [
  { id: 'minimalThin', label: 'Minimal Thin' },
  { id: 'minimalMedium', label: 'Minimal Medium' },
  { id: 'minimalThick', label: 'Minimal Thick' },
  { id: 'pointed', label: 'Pointed' },
  { id: 'modern', label: 'Modern' },
  { id: 'modern2', label: 'Modern 2' },
  { id: 'swiss', label: 'Swiss' },
]

export const dateFormat = [
  { id: 10, label: 'Little-Endian (31 Jan. 2000)' },
  { id: 20, label: 'Middle-Endian (Jan. 31, 2000)' },
  { id: 30, label: 'Big-Endian (2000 Jan. 31)' },
]

export const searchEngines = [
  { id: 'google', label: 'Google', url: 'https://www.google.com/search?q=%s' },
  { id: 'bing', label: 'Bing', url: 'https://www.bing.com/search?q=%s' },
  { id: 'baidu', label: 'Baidu', url: 'https://www.baidu.com/s?wd=%s' },
  { id: 'yahoo', label: 'Yahoo', url: 'https://search.yahoo.com/search?p=%s' },
  { id: 'ask', label: 'Ask.com', url: 'https://www.ask.com/web?q=%s' },
  { id: 'duckduckgo', label: 'DuckDuckGo', url: 'https://www.duckduckgo.com/?q=%s' },
  { id: 'wolframalpha', label: 'Wolframalpha', url: 'https://www.wolframalpha.com/input/?i=%s' },
  { id: 'github', label: 'GitHub', url: 'https://www.github.com/search?q=%s' },
  { id: 'yandex', label: 'Yandex', url: 'https://yandex.com/search/?text=%s' },
]

export const bgBlend = [
  { id: 10, label: 'Normal', mode: 'normal' },
  { id: 20, label: 'Color', mode: 'color' },
  { id: 30, label: 'Color burn', mode: 'color-burn' },
  { id: 40, label: 'Color dodge', mode: 'color-dodge' },
  { id: 50, label: 'Darken', mode: 'darken' },
  { id: 60, label: 'Lighten', mode: 'lighten' },
  { id: 70, label: 'Difference', mode: 'difference' },
  { id: 80, label: 'Exclusion', mode: 'exclusion' },
  { id: 90, label: 'Hard light', mode: 'hard-light' },
  { id: 100, label: 'Soft light', mode: 'soft-light' },
  { id: 110, label: 'Hue', mode: 'hue' },
  { id: 120, label: 'Saturation', mode: 'saturation' },
  { id: 130, label: 'Luminosity', mode: 'luminosity' },
  { id: 140, label: 'Multiply', mode: 'multiply' },
  { id: 150, label: 'Screen', mode: 'screen' },
  { id: 160, label: 'Overlay', mode: 'overlay' },
]

export const bgSize = [
  { id: 10, label: 'Repeat', size: 'auto' },
  { id: 20, label: 'Cover', size: 'cover' },
  { id: 30, label: 'Contain', size: 'contain' },
  { id: 40, label: 'Scale', size: 'scale' },
  { id: 50, label: 'Scale and repeat', size: 'scaleRepeat' },
]

export const colors = [
  { id: 100, bg: '#FFFFFF', fg: '#000000' },
  { id: 200, bg: '#FFFFFF', fg: '#7AC943' },
  { id: 300, bg: '#FFFFFF', fg: '#00A99D' },
  { id: 400, bg: '#FFFFFF', fg: '#3FA9F5' },
  { id: 500, bg: '#FFFFFF', fg: '#93278F' },
  { id: 600, bg: '#FFFFFF', fg: '#FF7BAC' },
  { id: 700, bg: '#FFFFFF', fg: '#FF1D25' },
  { id: 800, bg: '#FFFFFF', fg: '#FF931E' },
  { id: 900, bg: '#000000', fg: '#FFFFFF' },
  { id: 1000, bg: '#000000', fg: '#7AC943' },
  { id: 1100, bg: '#000000', fg: '#00A99D' },
  { id: 1200, bg: '#000000', fg: '#3FA9F5' },
  { id: 1300, bg: '#000000', fg: '#93278F' },
  { id: 1400, bg: '#000000', fg: '#FF7BAC' },
  { id: 1500, bg: '#000000', fg: '#FF1D25' },
  { id: 1600, bg: '#000000', fg: '#FF931E' },
  { id: 1700, bg: '#E6E6E6', fg: '#333333' },
  { id: 1800, bg: '#7AC943', fg: '#000000' },
  { id: 1900, bg: '#00A99D', fg: '#000000' },
  { id: 2000, bg: '#3FA9F5', fg: '#000000' },
  { id: 2100, bg: '#93278F', fg: '#000000' },
  { id: 2200, bg: '#FF7BAC', fg: '#000000' },
  { id: 2300, bg: '#FF1D25', fg: '#000000' },
  { id: 2400, bg: '#FF931E', fg: '#000000' },
  { id: 2500, bg: '#333333', fg: '#E6E6E6' },
  { id: 2600, bg: '#7AC943', fg: '#FFFFFF' },
  { id: 2700, bg: '#00A99D', fg: '#FFFFFF' },
  { id: 2800, bg: '#3FA9F5', fg: '#FFFFFF' },
  { id: 2900, bg: '#93278F', fg: '#FFFFFF' },
  { id: 3000, bg: '#FF7BAC', fg: '#FFFFFF' },
  { id: 3100, bg: '#FF1D25', fg: '#FFFFFF' },
  { id: 3200, bg: '#FF931E', fg: '#FFFFFF' },
  { id: 3300, bg: '#BDCCD4', fg: '#534741' },
  { id: 3400, bg: '#E2EDC1', fg: '#00A055' },
  { id: 3500, bg: '#C9F2EE', fg: '#0000FF' },
  { id: 3600, bg: '#C8EAF5', fg: '#00AEEF' },
  { id: 3700, bg: '#D8D6EC', fg: '#702C8D' },
  { id: 3800, bg: '#FCE3EE', fg: '#F190AC' },
  { id: 3900, bg: '#EEDFAC', fg: '#534741' },
  { id: 4000, bg: '#FFFAC0', fg: '#F4783B' },
  { id: 4100, bg: '#E1E9F2', fg: '#004080' },
  { id: 4200, bg: '#EAF3E0', fg: '#008080' },
  { id: 4300, bg: '#004040', fg: '#FFFFFF' },
  { id: 4400, bg: '#0000FF', fg: '#FFFFFF' },
  { id: 4500, bg: '#93278F', fg: '#FF931E' },
  { id: 4600, bg: '#FAC8D3', fg: '#895881' },
  { id: 4700, bg: '#C1172C', fg: '#FFF200' },
  { id: 4800, bg: '#FF8040', fg: '#000000' },
]

// Patterns from Transparent Textures - Built and maintained by @mikehearn.
// https://www.transparenttextures.com/
export const patterns = [
  { id: 200, pattern: 'checkered-pattern.png' },
  { id: 300, pattern: 'escheresque-dark.png' },
  { id: 400, pattern: '45-degree-fabric-dark.png' },
  { id: 600, pattern: 'flowers.png' },
  { id: 700, pattern: '60-lines.png' },
  { id: 800, pattern: 'clean-gray-paper.png' },
  { id: 1000, pattern: 'always-grey.png' },
  { id: 1100, pattern: 'climpek.png' },
  { id: 1200, pattern: 'gplay.png' },
  { id: 1300, pattern: 'arabesque.png' },
  { id: 1400, pattern: 'concrete-wall.png' },
  { id: 1600, pattern: 'arches.png' },
  { id: 1700, pattern: 'connected.png' },
  { id: 1900, pattern: 'argyle.png' },
  { id: 2000, pattern: 'crisp-paper-ruffles.png' },
  { id: 2100, pattern: 'inspiration-geometry.png' },
  { id: 2300, pattern: 'crissxcross.png' },
  { id: 2400, pattern: 'lined-paper-2.png' },
  { id: 2500, pattern: 'back-pattern.png' },
  { id: 2600, pattern: 'cubes.png' },
  { id: 2700, pattern: 'mirrored-squares.png' },
  { id: 2800, pattern: 'batthern.png' },
  { id: 2900, pattern: 'dark-brick-wall.png' },
  { id: 3000, pattern: 'ps-neutral.png' },
  { id: 3100, pattern: 'binding-dark.png' },
  { id: 3300, pattern: 'purty-wood.png' },
  { id: 3500, pattern: 'dark-geometric.png' },
  { id: 3600, pattern: 'retina-wood.png' },
  { id: 3700, pattern: 'black-thread-light.png' },
  { id: 3800, pattern: 'dark-leather.png' },
  { id: 3900, pattern: 'shattered.png' },
  { id: 4000, pattern: 'brick-wall.png' },
  { id: 4100, pattern: 'dark-mosaic.png' },
  { id: 4200, pattern: 'skulls.png' },
  { id: 4300, pattern: 'brick-wall-dark.png' },
  { id: 4400, pattern: 'diagmonds.png' },
  { id: 4500, pattern: 'tileable-wood.png' },
  { id: 4600, pattern: 'bright-squares.png' },
  { id: 4700, pattern: 'diagmonds-light.png' },
  { id: 4800, pattern: 'tree-bark.png' },
  { id: 4900, pattern: 'candyhole.png' },
  { id: 5100, pattern: 'use-your-illusion.png' },
  { id: 5300, pattern: 'diamond-upholstery.png' },
  { id: 5400, pattern: 'white-diamond.png' },
  { id: 5500, pattern: 'cartographer.png' },
  { id: 5600, pattern: 'escheresque.png' },
  { id: 5700, pattern: 'xv.png' },
]
