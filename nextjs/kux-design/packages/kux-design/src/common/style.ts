/**
 * style related function
 */

export type IClxItem = string | undefined | null | boolean
  | { [key: string]: null | undefined | boolean | (() => boolean) }
  | (() => string)
  | IClxItem[]

/**
 * merge class names
 */
export function clx(...args: IClxItem[]) {
  const classNames: string[] = []
  args.forEach(item => {
    if (!item) return
    const type = typeof item
    if (type === 'string' || type === 'number') {
      classNames.push(item as string)
      return
    }
    if (type === 'object') {
      if (Array.isArray(item)) {
        const result = clx(...item)
        if (!result) return
        classNames.push(result)
        return
      }
      Object.keys(item).forEach(key => {
        // @ts-expect-error item is object
        const value = item[key]
        if (typeof value === 'function') {
          if (value()) {
            classNames.push(key)
          }
        } else if (value) {
            classNames.push(key)
        }
      })
      return
    }
    if (typeof item === 'function') {
      const result = item()
      if (result) {
        classNames.push(result)
      }
      return
    }
    return;
  })
  return classNames.join(' ')
}

/**
 * 给 clx 函数添加别名 clsx
 */
export const clsx = clx

/**
 * 数值类型
 * * length: 长度, 如px, rem, em等, 默认为px
 * * time: 时间, 如ms, s等, 默认为ms
 */
export type IUnitType = 'length' | 'time' | 'percent'

const defaultUnitType: Record<IUnitType, string> = {
  length: 'px',
  time: 'ms',
  percent: '%'
}

/**
 * 格式化样式单位
 * @param value 格式化的值
 * @param unitType 数值类型, 默认为长度, 也可以为自定义的单位
 * @returns 格式化后的值
 */
export function formatStyleUnit(value: number | string, unitType: IUnitType | string = 'length') {
  // @ts-expect-error unitType is string
  const unit = defaultUnitType[unitType] || unitType
  return app.is(value, 'number') ? `${value}${unit}` : value
}
