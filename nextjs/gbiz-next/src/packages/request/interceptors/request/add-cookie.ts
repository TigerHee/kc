import { RequestInterceptor, RuntimeEnvironment } from '../../types'
import { getNextSSRStore } from 'tools/asyncLocalStorage'

const addCookie: RequestInterceptor = (baseConfig) => {
  return {
    name: 'addCookie',
    description: 'ssr环境转发cookie',
    presetEnvironment: [RuntimeEnvironment.SSR],
    supportEnvironment: [RuntimeEnvironment.SSR],
    async onFulfilled(requestConfig) {
      if (baseConfig.environment !== RuntimeEnvironment.SSR) {
        return requestConfig
      }
      const store = getNextSSRStore()
      if (store?.cookies) {
        const cookieHeader = Object.entries(store.cookies)
          .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
          .join('; ')
        requestConfig.headers.set('Cookie', cookieHeader)
      }
      return requestConfig
    },
  }
}

export default addCookie
