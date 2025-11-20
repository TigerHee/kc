declare global {

  interface ISystemJs {
    import: (moduleName: string) => Promise<any>
    resolve: (moduleName: string) => string
    set: (id: string, module: any) => string
    addImportMap: (map: { imports: Record<string, string> }) => void
  }
  const System: ISystemJs;

  interface Window {
    /**
     * 是否在 tg app 中
     */
    IS_TMA: boolean

    /**
     * TMA 对象
     * * typeof import('@kc/telegram-biz-sdk')
     */
    Tma: any
  }
  /**
   * 应用名称, 用于数据上报, 与在 kufox 中的项目名称一致, 应当在 runtime 时赋值
   */
  const _APP_NAME_: string;
  /**
   * 应用标识: ${_APP_NAME_}_${version}, 应当在 runtime 时赋值
   */
  const _APP_: string
  /**
   * runtime版本 ${version}
   */
  const _VERSION_: string
  /**
   * 是否为开发环境
   */
  const _DEV_: boolean
  /**
   * 是否为 embed 模式
   */
  const _IS_EMBED_: boolean

  /**
   * 是否为 SSG 环境
   */
  const _IS_SSG_ENV_: boolean

  /**
   * 是否为 SSG mobile 环境
   */
  const _IS_MOBILE_SSG_ENV_: boolean

  /**
   * 站点配置
   */
  const _WEB_RELATION_: Record<string, any>
}

export {}
