import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import translationEN from '../assets/i18n/en.json'
import translationES from '../assets/i18n/es.json'

const getLang = () => {
    const lang = localStorage.getItem('lang')
    if (lang !== 'undefined' && lang !== null) {
        return lang
    } else {
        return 'en'
    }
}


const resources = {
    en: {
        translation: translationEN
    },
    es: {
        translation: translationES
    },
}


i18n
.use(initReactI18next)
.init({
    resources,
    lng: getLang(),
    keySeparator: false,
    interpolation: {
        escapeValue: false
    }
})   


export default i18n
