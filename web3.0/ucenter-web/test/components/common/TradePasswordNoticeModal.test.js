/*
 * Owner: melon@kupotech.com
 */

/**
 * 单测文件
 */
import TradePasswordNoticeModal from 'src/components/common/TradePasswordNoticeModal';
import { customRender } from 'test/setup';

describe('test TradePasswordNoticeModal', () => {
  test('test TradePasswordNoticeModal', () => {
    customRender(<TradePasswordNoticeModal>CenterContainer</TradePasswordNoticeModal>, {});
  });
});
