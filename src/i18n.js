import { createI18n } from 'vue-i18n'
import enUS from '@/locales/en-US.json'
import zhCN from '@/locales/zh-CN.json'
import zhTW from '@/locales/zh-TW.json'
import frFR from '@/locales/fr-FR.json'
import deDE from '@/locales/de-DE.json'
import heIL from '@/locales/he-IL.json'
import itIT from '@/locales/it-IT.json'
import jaJP from '@/locales/ja-JP.json'
import koKR from '@/locales/ko-KR.json'
import ptBR from '@/locales/pt-BR.json'
import ptPT from '@/locales/pt-PT.json'
import ruRU from '@/locales/ru-RU.json'
import esMX from '@/locales/es-MX.json'
import svSE from '@/locales/sv-SE.json'
import ukUA from '@/locales/uk-UA.json'
import urPK from '@/locales/ur-PK.json'
import viVN from '@/locales/vi-VN.json'

// Create Vue I18n instance.
export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'en-US',
  fallbackLocale: 'en-US',
  messages: {
    'en-US': enUS,
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    'fr-FR': frFR,
    'de-DE': deDE,
    'he-IL': heIL,
    'it-IT': itIT,
    'ja-JP': jaJP,
    'ko-KR': koKR,
    'pt-BR': ptBR,
    'pt-PT': ptPT,
    'ru-RU': ruRU,
    'es-MX': esMX,
    'sv-SE': svSE,
    'uk-UA': ukUA,
    'ur-PK': urPK,
    'vi-VN': viVN,
  },
})
