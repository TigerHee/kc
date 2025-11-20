import { RequestInterceptor, RuntimeEnvironment } from '../../types'
import { getNextSSRStore } from 'tools/asyncLocalStorage'

const addXVersion: RequestInterceptor = (baseConfig) => {
  return {
    name: 'addXVersion',
    description: '自动添加x-version',
    presetEnvironment: [
      RuntimeEnvironment.APP,
      RuntimeEnvironment.BROWSER,
      RuntimeEnvironment.SSR,
    ],
    supportEnvironment: [
      RuntimeEnvironment.APP,
      RuntimeEnvironment.BROWSER,
      RuntimeEnvironment.SSR,
    ],
    async onFulfilled(requestConfig) {
      let xVersion: string | undefined | null
      if (baseConfig.environment === RuntimeEnvironment.SSR) {
        const store = getNextSSRStore()
        xVersion = store.headers['_x_version']
      } else {
        xVersion =
          baseConfig.xVersion || localStorage?.getItem('_x_version')
      }
      if (!xVersion) {
        return requestConfig
      }
      requestConfig.params = requestConfig.params || {}
      requestConfig.params['x-version'] = xVersion
      requestConfig.headers.set('X-VERSION', xVersion)
      return requestConfig
    },
  }
}

export default addXVersion
