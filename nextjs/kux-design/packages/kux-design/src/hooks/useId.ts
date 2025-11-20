import { useId as useReactId, useRef } from 'react'

let globalIdCounter = 0

/**
 * 兼容 useId 的自定义 hook
 * 如果react(>=18)支持 useId，则使用原生的 useId；否则使用全局计数器生成唯一 ID
 */
export const useId: () => string =
  typeof useReactId === 'function'
    ? useReactId
    : () => {
        const idRef = useRef<string>()
        if (!idRef.current) {
          idRef.current = `kux-${globalIdCounter++}`
        }
        return idRef.current
      }