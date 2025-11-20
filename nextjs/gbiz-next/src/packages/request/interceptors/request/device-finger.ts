import pathToRegexp from 'path-to-regexp'
import {
  RequestInterceptor,
  FingerPrintUrl,
  RuntimeEnvironment,
} from '../../types'

// 低于该版本H5无法使用app的设备指纹token
const SUPPORT_APP_TOKEN = '3.66.0'

const matchUrl = (
  fingerPrintUrlList: FingerPrintUrl[],
  requestUrl?: string,
  method?: string
) => {
  if (!requestUrl) {
    return undefined
  }
  const pathName = requestUrl.startsWith('http')
    ? new URL(requestUrl).pathname
    : requestUrl.split('?')[0]
  return fingerPrintUrlList.find((o) => {
    if (!o?.url) {
      return false
    }
    if (
      o.method &&
      o.method.toLowerCase() !== (method || 'get').toLowerCase()
    ) {
      return false
    }
    const pathRegExp = pathToRegexp(o.url)
    const isMatch = pathRegExp.test(pathName)
    return isMatch
  })
}

/**
 * 判断两个版本字符串的大小
 * @param  {string} v1 原始版本
 * @param  {string} v2 目标版本
 * @return {number} 如果原始版本大于目标版本，则返回大于0的数值, 如果原始小于目标版本则返回小于0的数值。
 */

const compareVersion = (v1: string, v2: string): number => {
  const _v1 = v1.split('.')
  const _v2 = v2.split('.')
  const _r = Number(_v1[0]) - Number(_v2[0])

  return _r === 0 && v1 !== v2
    ? compareVersion(_v1.splice(1).join('.'), _v2.splice(1).join('.'))
    : _r
}

const deviceFinger: RequestInterceptor = (baseConfig) => {
  const { fingerPrintUrlList, environment, JsBridge } = baseConfig
  let _reporter: any = null
  let reporterInitd = false
  const initReporter = async () => {
    if (reporterInitd) {
      return
    }
    reporterInitd = true
    const { reporter, getReporter } = baseConfig
    if (reporter) {
      _reporter = reporter
      return
    }
    if (typeof getReporter === 'function') {
      _reporter = await getReporter()
    }
  }
  const getTokenByJsBridge = async (matchedUrl: FingerPrintUrl) => {
    if (!JsBridge) {
      return null
    }
    try {
      const appVersion: string = await new Promise((resolve) => {
        JsBridge.open(
          {
            type: 'func',
            params: { name: 'getAppVersion' },
          },
          ({ data }: { data: string }) => resolve(data)
        )
      })
      const canGetToken = compareVersion(appVersion, SUPPORT_APP_TOKEN) >= 0
      const token = canGetToken
        ? await new Promise((resolve) => {
            JsBridge.open(
              {
                type: 'func',
                params: {
                  name: 'getFingerToken',
                  event: matchedUrl.event,
                },
              },
              ({ data }: { data: any }) => resolve(data)
            )
          })
        : await _reporter.logFingerprint(matchedUrl.event)
      return token
    } catch (e) {
      console.error(`[http-client] JsBridge获取设备指纹失败,  ${e}`)
    }
  }
  return {
    name: 'deviceFinger',
    description: '设备指纹埋点上报拦截器',
    presetEnvironment: [RuntimeEnvironment.APP, RuntimeEnvironment.BROWSER],
    supportEnvironment: [RuntimeEnvironment.APP, RuntimeEnvironment.BROWSER],
    async onFulfilled(requestConfig) {
      if (
        !fingerPrintUrlList ||
        fingerPrintUrlList.length === 0 ||
        (!_reporter && reporterInitd)
      ) {
        return requestConfig
      }
      const matchedUrl = matchUrl(
        fingerPrintUrlList,
        requestConfig.url,
        requestConfig.method
      )
      if (!matchedUrl) {
        return requestConfig
      }
      if (!reporterInitd) {
        await initReporter()
      }
      if (!_reporter) {
        return requestConfig
      }
      let token: string | { token: string; token_sm: string } = ''
      if (environment === RuntimeEnvironment.APP) {
        token = await getTokenByJsBridge(matchedUrl)
      }
      if (environment === RuntimeEnvironment.BROWSER) {
        token = await _reporter.logFingerprint(matchedUrl.event)
      }
      if (!token) {
        return requestConfig
      }
      if (typeof token === 'object') {
        // requestConfig.headers.set('TOKEN', token.token || '');
        requestConfig.headers.set('TOKEN_SM', token.token_sm || '')
      } else {
        // requestConfig.headers.set('TOKEN', token);
        requestConfig.headers.set('TOKEN_SM', token || '')
      }
      return requestConfig
    },
  }
}

export default deviceFinger
