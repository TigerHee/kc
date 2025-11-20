import { useState, useEffect, useCallback } from 'react'
import type { IBasicSize, ISizeAuto } from '@/shared-type'

/**
 * 折叠面板的唯一标识
 */
export type ICollapseKey = string | number

export interface ICollapseItem {
  /**
   * 面板的唯一标识
   */
  key: ICollapseKey
  /**
   * 面板的标题
   */
  title: React.ReactNode
  /**
   * 面板的内容
   */
  content: React.ReactNode
}

export interface ICollapseProps {
  /**
   * 手风琴模式: 同一时间只能展开一个面板
   */
  accordion?: boolean
  /**
   * 展开的面板, 受控模式使用
   */
  activeKey?: ICollapseKey | ICollapseKey[]
  /**
   * 面板的大小, 默认 auto
   * * small 小尺寸
   * * medium 中等尺寸
   * * auto 自适应, 小屏幕使用小尺寸, 其他情况使用 medium 尺寸
   * @default 'auto'
   */
  size?: IBasicSize | ISizeAuto
  /**
   * 默认展开的面板, 非受控模式使用
   */
  defaultActiveKey?: ICollapseKey | ICollapseKey[]
  /**
   * 面板切换时的回调
   * @param activeKeys string[] | number[]
   * @returns 
   */
  onChange?: (activeKeys: ICollapseKey[]) => void
  /**
   * 面板的数据源, 与 children 二选一
   */
  items?: ICollapseItem[]
  /**
   * 自定义面板内容
   */
  children?: React.ReactNode
  /**
   * 自定义面板头部图标
   */
  expandIcon?: ({isActive}: {isActive: boolean}) => React.ReactNode
}

export function useViewModel(props: Pick<ICollapseProps, 'activeKey' | 'defaultActiveKey' | 'accordion' | 'onChange'>) {
  const [activeKey, setActiveKey] = useState<ICollapseKey[]>(() => {
    const keys = props.activeKey || props.defaultActiveKey
    if (!keys) return []
    if (Array.isArray(keys)) return keys
    return [keys]
  });
  useEffect(() => {
    if (!props.activeKey) return
    setActiveKey(Array.isArray(props.activeKey) ? props.activeKey : [props.activeKey])
  }, [props.activeKey])

  const toggleActiveKey = useCallback((key: ICollapseKey, open?: boolean) => {
    setActiveKey((prev) => {
      const nextActiveKey = getNextActiveKey(prev, props.accordion || false, key, open)
      setTimeout(() => {
        props.onChange?.(nextActiveKey)
      }, 0);
      return nextActiveKey
    });
  }, [props.accordion]);
  

  return {
    activeKey,
    toggleActiveKey,
  }
}


function getNextActiveKey(prev: ICollapseKey[], accordion: boolean, key: ICollapseKey, open?: boolean) {
  if (accordion) {
    if (typeof open === 'boolean') {
      return open ? [key] : prev.includes(key) ? [] : prev;
    }
    return prev.includes(key) ? [] : [key]
  }
  if (typeof open === 'boolean') {
    return open ? [...prev, key] : prev.filter((k) => k !== key)
  }
  return prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
}