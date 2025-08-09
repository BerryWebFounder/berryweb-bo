export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.config.errorHandler = (error, context) => {
        console.error('Vue 에러:', error, context)

        // 에러 리포팅 서비스로 전송 (예: Sentry)
        // Sentry.captureException(error)
    }

    nuxtApp.hook('vue:error', (error, context) => {
        console.error('Nuxt Vue 에러:', error, context)
    })
})