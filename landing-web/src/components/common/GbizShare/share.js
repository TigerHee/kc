/**
 * Owner: gavin.liu1@kupotech.com
 */
import { useState, useRef } from 'react'

export let GbizShareModule = null

export const useLoadSharePackage = () => {
  const [isReady, setIsReady] = useState(false);
  const loadRef = useRef(false)

  if (!loadRef.current) {
    loadRef.current = true
    System.import('@remote/share').then(mod => {
      GbizShareModule = mod
    }).finally(() => {
      setIsReady(true)
    })
  }

  return {
    isReady,
  }
}
