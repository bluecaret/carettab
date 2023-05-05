import { createI18n } from 'vue-i18n'
import enUS from '@/locales/enUS.json'
import zhCN from '@/locales/zhCN.json'
import zhTW from '@/locales/zhTW.json'
import frFR from '@/locales/frFR.json'
import deDE from '@/locales/deDE.json'
import heIL from '@/locales/heIL.json'
import itIT from '@/locales/itIT.json'
import jaJP from '@/locales/jaJP.json'
import koKR from '@/locales/koKR.json'
import ptBR from '@/locales/ptBR.json'
import ptPT from '@/locales/ptPT.json'
import ruRU from '@/locales/ruRU.json'
import esMX from '@/locales/esMX.json'
import svSE from '@/locales/svSE.json'
import ukUA from '@/locales/ukUA.json'
import urPK from '@/locales/urPK.json'
import viVN from '@/locales/viVN.json'

// Create Vue I18n instance.
export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'enUS',
  fallbackLocale: 'enUS',
  messages: { enUS, zhCN, zhTW, frFR, deDE, heIL, itIT, jaJP, koKR, ptBR, ptPT, ruRU, esMX, svSE, ukUA, urPK, viVN },
})
