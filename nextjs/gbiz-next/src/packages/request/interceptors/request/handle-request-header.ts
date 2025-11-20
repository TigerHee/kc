// import { bootConfig } from 'kc-next/boot'
import { RequestInterceptor, RuntimeEnvironment } from '../../types'
import { getNextSSRStore } from 'tools/asyncLocalStorage';

const handleRequestHeader: RequestInterceptor = (baseConfig) => {
  return {
    name: 'handleRequestHeader',
    description: '自动添加请求头',
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
      // 将bool类型的请求头设置为bool字符串
      Object.entries(requestConfig.headers)
        .filter((v) => typeof v[1] === 'boolean')
        .forEach((v) => requestConfig.headers.set(v[0], v[1], true))

      if (baseConfig.environment === RuntimeEnvironment.SSR) {
        if (process.env.KC_CDN_SITE_TYPE) {
          requestConfig.headers.set(
            'x-kc-cdn-site-type',
            process.env.KC_CDN_SITE_TYPE
          )
          requestConfig.headers.set('x-site', process.env.KC_CDN_SITE_TYPE)
        }

        // 网关取的顺序
        // kc-client-real-ip
        // true-client-ip
        // cf-connecting-ip
        // X-Real-IP
        // x-forwarded-for
        // if (process.env.KC_CLIENT_REAL_IP && process.env.KC_CLIENT_REAL_IP !== 'undefined') {
        //   requestConfig.headers.set(
        //     'kc-client-real-ip',
        //     process.env.KC_CLIENT_REAL_IP
        //   )
        // }
        // if (process.env.TRUE_CLIENT_IP && process.env.TRUE_CLIENT_IP !== 'undefined') {
        //   requestConfig.headers.set(
        //     'true-client-ip',
        //     process.env.TRUE_CLIENT_IP
        //   )
        // }
        // if (process.env.CF_CONNECTING_IP && process.env.CF_CONNECTING_IP !== 'undefined') {
        //   requestConfig.headers.set(
        //     'cf-connecting-ip',
        //     process.env.CF_CONNECTING_IP
        //   )
        // }
        // if (process.env.X_REAL_IP && process.env.X_REAL_IP !== 'undefined') {
        //   requestConfig.headers.set('x-real-ip', process.env.X_REAL_IP)
        // }
        // if (process.env.X_FORWARDED_FOR && process.env.X_FORWARDED_FOR !== 'undefined') {
        //   requestConfig.headers.set(
        //     'x-forwarded-for',
        //     process.env.X_FORWARDED_FOR
        //   )
        // }

        // 网关取的顺序
        // kc-client-real-ip
        // true-client-ip
        // cf-connecting-ip
        // X-Real-IP
        // x-forwarded-for
        const store = getNextSSRStore();

        if (store.headers?.['kc-client-real-ip'] && store.headers?.['kc-client-real-ip'] !== 'undefined') {
          requestConfig.headers.set(
            'kc-client-real-ip',
            store.headers['kc-client-real-ip']
          )
        }
        if (store.headers?.['true-client-ip'] && store.headers?.['true-client-ip'] !== 'undefined') {
          requestConfig.headers.set(
            'true-client-ip',
            store.headers['true-client-ip']
          )
        }
        if (store.headers?.['cf-connecting-ip'] && store.headers?.['cf-connecting-ip'] !== 'undefined') {
          requestConfig.headers.set(
            'cf-connecting-ip',
            store.headers['cf-connecting-ip']
          )
        }
        if (store.headers?.['x-real-ip'] && store.headers?.['x-real-ip'] !== 'undefined') {
          requestConfig.headers.set('x-real-ip', store.headers['x-real-ip'])
        }
        if (store.headers?.['x-forwarded-for'] && store.headers?.['x-forwarded-for'] !== 'undefined') {
          requestConfig.headers.set(
            'x-forwarded-for',
            store.headers['x-forwarded-for']
          )
        }
        return requestConfig
      }
      // 暂时不要
      // const xSite = bootConfig._BRAND_SITE_FULL_NAME_
      // if (xSite) {
      //   requestConfig.headers.set('X-Site', xSite)
      // }
      return requestConfig
    },
  }
}

export default handleRequestHeader
