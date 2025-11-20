import { formatDateTime, formatNumber } from '../src/format'

describe('format', () => {
  describe('formatDate', () => {
    it.each([
      ['2021-01-01T00:00:00Z', {},  '01/01/2021 00:00:00'],
      ['2021-01-01T00:00:00Z', { lang: 'ar-AE' },  '01\u200f/01\u200f/2021\u060c 00:00:00'],
      ['2021-01-01T00:00:00Z', { lang: 'ar_AE' },  '01\u200f/01\u200f/2021\u060c 00:00:00'],
      ['2021-01-01T00:00:00Z', { lang: 'zh-CN' },  '2021/01/01 00:00:00'],
      ['2021-01-01T00:00:00Z', { lang: 'zh-CN', timeZone: '' },  formatDateTime('2021-01-01T00:00:00Z', {
        lang: 'zh-CN', timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone})],
      ['2021-01-01T00:00:00Z', { lang: 'zh-CN', timeZone: 'UTC+8' },  '2021/01/01 08:00:00'],
      ['2021-01-01T00:00:00Z', { lang: 'zh-CN', timeZone: 'UTC-8' },  '2020/12/31 16:00:00'],
    ])('formatDateTime(%j, %j) => %j', (date, options, expected) => {
      expect(formatDateTime(date, options)).toBe(expected)
    })
  })

  describe('formatDate invalid arguments', () => {
    it.each([
      ['2021-01-01T00:00:00Z', {timeZone: 'UTC+ac'}],
    ])('formatDateTime(%j, %j) should throw', (date, options) => {
      expect(formatDateTime(date, options)).toBe(date)
    })
  })

  describe('formatNumber', () => {
    it.each([
      ['1234567890', {}, '1,234,567,890'],
      ['1234567890', { lang: 'ar_AE'}, '1,234,567,890'],
      ['1234567890', { lang: 'ar-AE', style: 'percent'}, "‮‭123,456,789,000‎‎‬%‬"],
      ['1234567890', { style: 'percent'}, '123,456,789,000%'],
      ['0.23', { style: 'percent', showSign: true}, '+23%'],
      ['-0.23', { style: 'percent', showSign: true}, '-23%'],
      ['-0.23', { style: 'percent' }, '-23%'],
    ])('formatNumber(%j, %j) => %j', (number, options, expected) => {
      // @ts-expect-error ignore for test
      expect(formatNumber(number, options)).toBe(expected)
    })
  })

  describe('formatNumber error', () => {
    it.each([
      ['122Z34567890', {}],
      ['1234567890', { lang: 'bb-ccd'}],
    ])('formatNumber(%j, %j) should return input', (number, options) => {
      expect(formatNumber(number, options)).toBe(number)
    })
  })
})