/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-02-28 21:26:58
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-02-28 21:41:38
 * @FilePath: /landing-web/src/components/Header/KCHeader/RestrictNotice.js
 * @Description: 
 */
import { useState, useRef } from 'react'

export let RestrictNotice = null

export const useRestrictNotice = () => {
  const [isReady, setIsReady] = useState(false);
  const loadRef = useRef(false)

  if (!loadRef.current) {
    loadRef.current = true
    System.import('@remote/header').then(mod => {
      RestrictNotice = mod.RestrictNotice
    }).finally(() => {
      setIsReady(true)
    })
  }

  return {
    isReady,
  }
}
