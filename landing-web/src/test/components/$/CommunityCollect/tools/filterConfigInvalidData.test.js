/**
 * Owner: lucas.l.lu@kupotech.com
 */
import { filterConfigInvalidData } from 'components/$/CommunityCollect/tools/getConfigByLang';

describe('getConfigByLang.filterConfigInvalidData', () => {
  it('正常数据处理 ok', () => {
    const result = filterConfigInvalidData([
      {
        'id': '64f6fe684fd5ed00011282d4',
        'platform': 'Telegram',
        'data': [
          {
            'accountId': '@KuCoinTelegram1',
            'id': '64f6fe684fd5ed00011282d4',
            'platform': 'Telegram',
          },
          {
            'accountId': '@KuCoinTelegram2',
            'id': '64f6fe684fd5ed00011282d4',
            'platform': 'Telegram',
          },
          {
            'accountId': '@KuCoinTelegram3',
            'id': '64f6fe684fd5ed00011282d4',
            'platform': 'Telegram',
          },
        ],
      },
      {
        'id': '64e8677c8383f60001fbe139',
        'platform': 'Twitter',
        'data': [
          {
            'accountId': '@KuCoinTwitter1',
            'id': '64e8677c8383f60001fbe139',
            'platform': 'Twitter',
          },
          {
            'accountId': '@KuCoinTwitter2',
            'id': '64e8677c8383f60001fbe139',
            'platform': 'Twitter',
          },
          {
            'accountId': '@KuCoinTwitter3',
            'id': '64e8677c8383f60001fbe139',
            'platform': 'Twitter',
          },
          {
            // 忘记填写
            'accountId': '',
            'id': '64e8677c8383f60001fbe139',
            'platform': 'Twitter',
          },
        ],
      },
      {
        'id': '60f16242261d950009e5de52',
        'platform': 'Facebook',
        'data': [ ],
      },
      {
        'id': '60f16242261d950009e5de52',
        'platform': 'Line',
        'data': [
          {
            'accountId': '@KuCoinLine1',
            'id': '64e8677c8383f60001fbe139',
            'platform': 'Line',
          },
          {
            'accountId': '@KuCoinLine1',
            'id': '64e8677c8383f60001fbe139',
            'platform': 'Line',
          },
          {
            'accountId': '@KuCoinLine3',
            'id': '64e8677c8383f60001fbe139',
            'platform': 'Line',
          },
        ],
      }
    ]);

    expect(result).toEqual([
      {
        'id': '64f6fe684fd5ed00011282d4',
        'platform': 'Telegram',
        'data': [
          {
            'accountId': '@KuCoinTelegram1',
            'id': '64f6fe684fd5ed00011282d4',
            'platform': 'Telegram',
          },
          {
            'accountId': '@KuCoinTelegram2',
            'id': '64f6fe684fd5ed00011282d4',
            'platform': 'Telegram',
          },
          {
            'accountId': '@KuCoinTelegram3',
            'id': '64f6fe684fd5ed00011282d4',
            'platform': 'Telegram',
          },
        ],
      },
      {
        'id': '64e8677c8383f60001fbe139',
        'platform': 'Twitter',
        'data': [
          {
            'accountId': '@KuCoinTwitter1',
            'id': '64e8677c8383f60001fbe139',
            'platform': 'Twitter',
          },
          {
            'accountId': '@KuCoinTwitter2',
            'id': '64e8677c8383f60001fbe139',
            'platform': 'Twitter',
          },
          {
            'accountId': '@KuCoinTwitter3',
            'id': '64e8677c8383f60001fbe139',
            'platform': 'Twitter',
          },
        ],
      },
      {
        'id': '60f16242261d950009e5de52',
        'platform': 'Line',
        'data': [
          {
            'accountId': '@KuCoinLine1',
            'id': '64e8677c8383f60001fbe139',
            'platform': 'Line',
          },
          {
            'accountId': '@KuCoinLine3',
            'id': '64e8677c8383f60001fbe139',
            'platform': 'Line',
          },
        ],
      }
    ]);
  });
});
