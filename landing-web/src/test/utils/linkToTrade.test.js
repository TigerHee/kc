/*
 * Owner: terry@kupotech.com
 */
import { linkToTrade, linkToTradeOld } from 'utils/linkToTrade';

jest.mock('umi/router', () => {
  return {
    __esModule: true,
    default: {
      push: jest.fn(),
    }
  }
})

describe('utils/linkToTrade', () => {

  it('linkToTrade', () => {
    expect(linkToTrade()).toBeUndefined();
    expect(linkToTrade('ETH-USDT')).toBeUndefined();
  })

  it('linkToTradeOld', () => {
    expect(linkToTradeOld('ETH-USDT')).toBeUndefined();
  })
})