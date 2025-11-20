import { debounce } from 'lodash-es'
import { ResponseInterceptor, RuntimeEnvironment } from '../../types'

const checkXGray: ResponseInterceptor = (baseConfig) => {
  const { sentry, projectName, environment, JsBridge } = baseConfig
  const xGrayReloadKey = 'kucoinv2_xgray_reload'
  const debounceReload = debounce(
    (reason = '') => {
      try {
        const x_gray_reload =
          Number(sessionStorage.getItem(xGrayReloadKey)) || 0
        if (x_gray_reload <= 0) {
          return
        }
        sentry?.captureEvent({
          message: `xgray need reload: ${reason}`,
          level: 'info',
          tags: { xgrayReload: 'success' },
        })
        console.info('xgrayReload: success')
        sessionStorage.setItem(xGrayReloadKey, `${x_gray_reload - 1}`)
        window.location.reload()
      } catch (e) {
        console.error(`[http-client] sentry上报xgray异常,  ${e}`)
      }
    },
    500,
    { trailing: false, leading: true }
  )
  return {
    name: 'checkXGray',
    description: '根据灰度变化确定是否要进行页面刷新',
    priority: 1000,
    presetEnvironment: [RuntimeEnvironment.APP, RuntimeEnvironment.BROWSER],
    supportEnvironment: [RuntimeEnvironment.APP, RuntimeEnvironment.BROWSER],
    async onFulfilled(response) {
      const isCanceled =
        response.headers['x-gray-canceled'] ||
        response.headers['X-GRAY-CANCELED']
      const canceledList =
        response.headers['x-gray-canceled-list'] ||
        response.headers['X-GRAY-CANCELED-LIST'] ||
        ''
      const isInCanceledList =
        canceledList.toLowerCase().indexOf(projectName) > -1
      if (isCanceled !== 'true' || !isInCanceledList) {
        return response
      }
      if (environment === RuntimeEnvironment.BROWSER) {
        debounceReload(`xgray canceled: ${canceledList}`)
        return response
      }
      if (environment === RuntimeEnvironment.APP && !!JsBridge) {
        try {
          JsBridge.open(
            {
              type: 'func',
              params: {
                name: 'updatePackageVersion',
                enable: false,
              },
            },
            () => {
              debounceReload(`xgray canceled(in app): ${canceledList}`)
            }
          )
        } catch (e) {
          console.error(
            `[http-client] JsBridge updatePackageVersion异常,  ${e}`
          )
        }
      }

      return response
    },
  }
}

export default checkXGray
