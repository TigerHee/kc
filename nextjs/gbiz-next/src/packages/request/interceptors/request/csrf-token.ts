import { RequestInterceptor, RuntimeEnvironment } from '../../types'

const addCsrfToken: RequestInterceptor = (baseConfig) => {
  return {
    name: 'addCsrfToken',
    description: '自动添加csrfToken',
    presetEnvironment: [RuntimeEnvironment.APP, RuntimeEnvironment.BROWSER],
    supportEnvironment: [RuntimeEnvironment.APP, RuntimeEnvironment.BROWSER],

    async onFulfilled(requestConfig) {
      if (requestConfig.disableCsrfToken || !baseConfig.csrfToken) {
        return requestConfig
      }
      requestConfig.params = requestConfig.params || {}
      requestConfig.params.c = baseConfig.csrfToken
      return requestConfig
    },
  }
}
export default addCsrfToken
