/**
 * Owner: gavin.liu1@kupotech.com
 */
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSelector } from 'dva';
import dayjs from 'dayjs'
import Decimal from 'decimal.js';
import { MODE } from './options'
import { numberFixed } from 'helper'
import { isNil } from 'lodash';

export const useReferInfo = () => {
  const { serverTime } = useSelector((state) => state.app);
  const { isLogin } = useSelector((state) => state.user);
  const referInfo = useSelector((state) => state.referFriend.referInfo)

  // countdown
  const getInitTime = (type) => {
    if (!referInfo) {
      return 0
    }
    const currentTime = serverTime || Date.now()
    const endTime = referInfo?.campaignEndTime || currentTime
    const isEnd = currentTime >= endTime
    if (isEnd) {
      return 0
    }
    const startDayjsIns = dayjs(currentTime)
    const endDayjsIns = dayjs(endTime)
    if (type === 'second') {
      return endDayjsIns.diff(startDayjsIns, 'second') % 60
    }
    if (type === 'minute') {
      return endDayjsIns.diff(startDayjsIns, 'minute') % 60
    }
    if (type === 'hour') {
      return endDayjsIns.diff(startDayjsIns, 'hour')
    }
  }

  const [second, setSecond] = useState(getInitTime('second'))
  const [minute, setMinute] = useState(getInitTime('minute'))
  const [hour, setHour] = useState(getInitTime('hour'))

  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    if (!referInfo) {
      return
    }
    const currentTime = serverTime || Date.now()
    const endTime = referInfo?.campaignEndTime || currentTime
    const isEnd = currentTime >= endTime
    if (isEnd) {
      setIsExpired(true)
      return
    } else {
      setIsExpired(false)
    }
    let current = currentTime
    const timer = setInterval(() => {
      current += 1000
      const startDayjsIns = dayjs(current)
      const endDayjsIns = dayjs(endTime)
      const diffSecond = endDayjsIns.diff(startDayjsIns, 'second') % 60
      const diffMinute = endDayjsIns.diff(startDayjsIns, 'minute') % 60
      const diffHour = endDayjsIns.diff(startDayjsIns, 'hour')
      setSecond(diffSecond)
      setMinute(diffMinute)
      setHour(diffHour)
    }, 1000)
    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [referInfo, serverTime])

  // mode
  const mode = useMemo(() => {
    if (!isLogin) {
      return MODE.notLogin
    }
    const total = new Decimal(referInfo?.totalSupportAmount || 0)
    if (total.isZero()) {
      return MODE.init
    }
    // < 50, phase_1
    if (total.lt(50)) {
      return MODE.phase_1
    }
    // >= 50, < 10000, phase_2
    if (total.gte(50) && total.lt(10000)) {
      return MODE.phase_2
    }
    // >= 10000, phase_3
    if (total.gte(10000)) {
      return MODE.phase_3
    }
    // default
    return MODE.init
  }, [isLogin, referInfo])

  // progress, only for preview
  const { total: totalLabel, remain: remainLabel } = useMemo(() => {
    if (!referInfo) {
      return {
        total: '0',
        remain: '0',
      }
    }
    let total = new Decimal(referInfo?.totalSupportAmount || 0)
    let remain = new Decimal(0)
    if ([MODE.notLogin, MODE.init].includes(mode)) {
      total = new Decimal(0)
      remain = new Decimal(50)
    }
    if (mode === MODE.phase_1) {
      // 50 - total
      remain = new Decimal(50).minus(total)
    }
    if (mode === MODE.phase_2) {
      // 10000 - total
      remain = new Decimal(10000).minus(total)
    }
    if (mode === MODE.phase_3) {
      // 10000: 由于文案特殊，所以这里固定 10000
      remain = new Decimal(10000)
    }
    // ensure >= 0
    remain = remain.lt(0) ? 0 : remain
    total = total.lt(0) ? 0 : total
    // transform to string, fixed 4
    remain = numberFixed(remain, 4)
    total = numberFixed(total, 4)
    return {
      total,
      remain,
    }
  }, [mode, referInfo])

  // phase_2, use dynamic width
  const getSecondProgressWidth = useCallback((originWidth) => {
    if (mode === MODE.phase_2) {
      // (total -  50) / (10000 - 50) * 100
      const top = new Decimal(totalLabel).minus(50)
      const bottom = new Decimal(10000).minus(50)
      const percent = top.div(bottom).times(100)
      // ensure min 10
      if (percent.lt(10)) {
        return 10
      }
      return percent.toFixed(0)
    }
    return originWidth
  }, [mode, totalLabel])

  // need show signup tips
  const needShowSignupTips = useMemo(() => {
    const endTime = referInfo?.hidenIEOTipsTime
    if (isNil(endTime)) {
      return false
    }
    const currentTime = serverTime || Date.now()
    return currentTime <= endTime
  }, [serverTime, referInfo])

  const isLastPhase = mode === MODE.phase_3

  return {
    referInfo,
    second: second < 10 ? `0${second}` : second,
    minute: minute < 10 ? `0${minute}` : minute,
    hour: hour < 10 ? `0${hour}` : hour,
    isExpired,
    mode,
    totalLabel,
    remainLabel: isLastPhase ? '10,000' : remainLabel,
    getSecondProgressWidth,
    needShowSignupTips
  }
}
