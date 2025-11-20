/**
 * Owner: charles.yang@kupotech.com
 */

export const xbtUnitObj = {
  XBT: {
    unitText: 'BTC',
    desc: '(Bitcoin)',
    multiplier: 1,
    displayFixed: 4,
    explain: 'Bitcoin',
  },
  mXBT: {
    unitText: 'mBTC',
    desc: '(micro-Bitcoin,1000 mBTC = 1 BTC)',
    multiplier: Math.pow(10, 3),
    displayFixed: 1,
    explain: 'micro-Bitcoin, 1000 mBTC = 1 BTC',
  },
  uXBT: {
    unitText: 'μBTC',
    desc: '(milli-Bitcoin ,1000000 μBTC = 1 BTC)',
    multiplier: Math.pow(10, 6),
    displayFixed: 3,
    explain: 'milli-Bitcoin, 1000000 μBTC = 1 BTC',
  },
  XBt: {
    unitText: 'XBt',
    desc: '(Satoshi,100000000 XBt = 1 BTC)',
    multiplier: Math.pow(10, 8),
    displayFixed: 0,
    explain: 'Satoshi, 100000000 XBt = 1 BTC',
  },
};
