import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import zh from '@/locales/zh.json'
import fr from '@/locales/fr.json'
import de from '@/locales/de.json'
import he from '@/locales/he.json'
import it from '@/locales/it.json'
import ja from '@/locales/ja.json'
import ko from '@/locales/ko.json'
import pt from '@/locales/pt.json'
import ru from '@/locales/ru.json'
import es from '@/locales/es.json'
import sv from '@/locales/sv.json'
import uk from '@/locales/uk.json'
import ur from '@/locales/ur.json'
import vi from '@/locales/vi.json'

// Create Vue I18n instance.
export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: en,
    zh: zh,
    fr: fr,
    de: de,
    he: he,
    it: it,
    ja: ja,
    ko: ko,
    pt: pt,
    ru: ru,
    es: es,
    sv: sv,
    uk: uk,
    ur: ur,
    vi: vi,
  },
})
