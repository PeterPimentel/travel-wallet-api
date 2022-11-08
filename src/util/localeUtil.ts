export const getLocaleCode = (locale: string) => {
    if (locale.includes('pt')) {
        return 'pt-BR'
    } else {
        return 'en-US'
    }

}