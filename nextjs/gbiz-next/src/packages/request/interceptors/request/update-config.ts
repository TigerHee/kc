import { rewriteOrigin } from 'kc-next/utils';
import { RequestInterceptor, RuntimeEnvironment } from '../../types'

export const updateConfig: RequestInterceptor = (baseConfig) => {
  return {
    name: 'updateConfig',
    description: 'SSR设置baseUrl和agent',
    presetEnvironment: [
      RuntimeEnvironment.SSR,
    ],
    supportEnvironment: [
      RuntimeEnvironment.SSR,
    ],
    async onFulfilled(requestConfig) {
      if (baseConfig.environment !== RuntimeEnvironment.SSR) {
        return requestConfig
      }
      let baseURL = requestConfig.baseURL;
      if (!baseURL) {
        baseURL = process.env.NEXT_PUBLIC_API_URL || ''
      } else if (!baseURL.startsWith('http')) {
        baseURL = new URL(baseURL, process.env.NEXT_PUBLIC_API_URL || '').toString();
      }
      const agent = rewriteOrigin(baseURL)
      requestConfig.baseURL = baseURL
      requestConfig.httpsAgent ??= agent
      return requestConfig
    },
  }
}

export default updateConfig
