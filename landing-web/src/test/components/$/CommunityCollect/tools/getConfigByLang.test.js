/**
 * Owner: lucas.l.lu@kupotech.com
 */
import { getConfigByLang } from 'components/$/CommunityCollect/tools/getConfigByLang';
import { groupConfig } from 'src/test/components/$/CommunityCollect/tools/data/groupConfig';

describe('getConfigByLang', () => {
  it('函数参数判断 ok', () => {
    expect(getConfigByLang()).toEqual([]);
    expect(getConfigByLang(null)).toEqual([]);
    expect(getConfigByLang([])).toEqual([]);
  });

  it('正常数据处理 ok', () => {
    const result_zh_HK = getConfigByLang(groupConfig, 'zh_HK');
    const result_it_IT = getConfigByLang(groupConfig, 'it_IT');

    expect(result_zh_HK).toEqual([
      {
        'id': '64f6fe684fd5ed00011282d4',
        'platform': 'Telegram',
        'accountId': '@KuCoin_Exchange_CHN',
        'url': 'https://t.me/KuCoin_Exchange_CHN',
        'type': 'OFFICIAL_URL',
        'iconUrl': 'https://assets.staticimg.com/cms/media/13MhLZMIS4VLXnPFamYXBMRlqZeAG7n1vjHiiAnfB.svg',
        'data': [
          {
            'id': '64f6fe684fd5ed00011282d4',
            'platform': 'Telegram',
            'accountId': '@KuCoin_Exchange_CHN',
            'url': 'https://t.me/KuCoin_Exchange_CHN',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/13MhLZMIS4VLXnPFamYXBMRlqZeAG7n1vjHiiAnfB.svg',
          },
          {
            'id': '64e8677c8383f60001fbe139',
            'platform': 'Telegram',
            'accountId': '@Kucoin_News1',
            'url': 'https://t.me/Kucoin_News',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/13MhLZMIS4VLXnPFamYXBMRlqZeAG7n1vjHiiAnfB.svg',
          },
          {
            'id': '64e8677c8383f60001fbe13a',
            'platform': 'Telegram',
            'accountId': '@KuCoinTradingBotGroup',
            'url': 'https://t.me/KuCoinTradingBotGroup',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/13MhLZMIS4VLXnPFamYXBMRlqZeAG7n1vjHiiAnfB.svg',
          },
          {
            'id': '60f16242261d950009e5de51',
            'platform': 'Telegram',
            'accountId': '@kucoinitalianofficial',
            'url': 'https://t.me/kucoinitalianofficial',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/13MhLZMIS4VLXnPFamYXBMRlqZeAG7n1vjHiiAnfB.svg',
          },
        ],
      },

      {
        'id': '64f6fe684fd5ed00011282d5',
        'platform': 'weibo',
        'accountId': 'KuCoin动态1',
        'url': 'https://weibo.com/u/7198121896',
        'type': 'OFFICIAL_URL',
        'iconUrl': 'https://assets.staticimg.com/cms/media/11foFRaV3oBjachuqlJCTQ90GbtUVPk1MR41uUbVJ.svg',
        'data': [
          {
            'id': '64f6fe684fd5ed00011282d5',
            'platform': 'weibo',
            'accountId': 'KuCoin动态1',
            'url': 'https://weibo.com/u/7198121896',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/11foFRaV3oBjachuqlJCTQ90GbtUVPk1MR41uUbVJ.svg',
          },
        ],
      },

      {
        'id': '64f6fe684fd5ed00011282d6',
        'platform': 'Twitter',
        'accountId': 'twitter zh',
        'url': 'https://www.twitter.com/',
        'type': 'OFFICIAL_URL',
        'iconUrl': 'https://assets.staticimg.com/cms/media/2yOBIYHZ0D7w6eNdIcfWrYWK7cOH3vtAwc8hHdwi4.svg',
        'data': [
          {
            'id': '64f6fe684fd5ed00011282d6',
            'platform': 'Twitter',
            'accountId': 'twitter zh',
            'url': 'https://www.twitter.com/',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/2yOBIYHZ0D7w6eNdIcfWrYWK7cOH3vtAwc8hHdwi4.svg',
          },
          {
            'id': '64e8677c8383f60001fbe13b',
            'platform': 'Twitter',
            'accountId': '@kucoincom',
            'url': 'https://twitter.com/KuCoinCom111',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/2yOBIYHZ0D7w6eNdIcfWrYWK7cOH3vtAwc8hHdwi4.svg',
          },
          {
            'id': '60f16242261d950009e5de52',
            'platform': 'Twitter',
            'accountId': '@KuCoinItalia',
            'url': 'https://twitter.com/KuCoinItalia',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/2yOBIYHZ0D7w6eNdIcfWrYWK7cOH3vtAwc8hHdwi4.svg',
          },
        ]
      },

      {
        'id': '64e8677c8383f60001fbe13c',
        'platform': 'Reddit',
        'accountId': 'r/kucoin',
        'url': 'https://www.reddit.com/r/kucoin',
        'type': 'OFFICIAL_URL',
        'iconUrl': 'https://assets.staticimg.com/cms/media/9lYaNzDDJpdZHOSwGnglGIeOhELMQHTm2JQSfZbSi.svg',
        data: [
          {
            'id': '64e8677c8383f60001fbe13c',
            'platform': 'Reddit',
            'accountId': 'r/kucoin',
            'url': 'https://www.reddit.com/r/kucoin',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/9lYaNzDDJpdZHOSwGnglGIeOhELMQHTm2JQSfZbSi.svg',
          },
          {
            'id': '60f16242261d950009e5de54',
            'platform': 'Reddit',
            'accountId': 'r/kucoin_italy',
            'url': 'https://www.reddit.com/r/kucoin_italy/',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/9lYaNzDDJpdZHOSwGnglGIeOhELMQHTm2JQSfZbSi.svg',
          },
        ],
      },

      {
        'id': '64e8677c8383f60001fbe13d',
        'platform': 'Medium',
        'accountId': '@kucoinexchange',
        'url': 'https://medium.com/kucoinexchange',
        'type': 'OFFICIAL_URL',
        'iconUrl': 'https://assets.staticimg.com/cms/media/5boSqUv55LyzeDGe83o83qEVvzTSbmOFqQx5CfWAa.svg',
        data: [
          {
            'id': '64e8677c8383f60001fbe13d',
            'platform': 'Medium',
            'accountId': '@kucoinexchange',
            'url': 'https://medium.com/kucoinexchange',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/5boSqUv55LyzeDGe83o83qEVvzTSbmOFqQx5CfWAa.svg',
          },
          {
            'id': '60f16242261d950009e5de56',
            'platform': 'Medium',
            'accountId': '@KuCoinExchangeItaly',
            'url': 'https://medium.com/@KuCoinExchangeItaly',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/5boSqUv55LyzeDGe83o83qEVvzTSbmOFqQx5CfWAa.svg',
          },
        ]
      },

      {
        'id': '64e8677c8383f60001fbe13e',
        'platform': 'YouTube',
        'accountId': '@KuCoin',
        'url': 'https://www.youtube.com/c/KuCoinExchange',
        'type': 'OFFICIAL_URL',
        'iconUrl': 'https://assets.staticimg.com/cms/media/5lvIM4nHi6K8MiRi2in2iOwBt8Ki7v8cZveWTWN1M.svg',
        data: [
          {
            'id': '64e8677c8383f60001fbe13e',
            'platform': 'YouTube',
            'accountId': '@KuCoin',
            'url': 'https://www.youtube.com/c/KuCoinExchange',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/5lvIM4nHi6K8MiRi2in2iOwBt8Ki7v8cZveWTWN1M.svg',
          },
          {
            'id': '60f16242261d950009e5de55',
            'platform': 'YouTube',
            'accountId': '@KuCoin Exchange Italy',
            'url': 'https://www.youtube.com/channel/UCMIfs24TQJeSsJA0crwYH0g',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/5lvIM4nHi6K8MiRi2in2iOwBt8Ki7v8cZveWTWN1M.svg',
          },
        ],
      },

      {
        'id': '64e8677c8383f60001fbe13f',
        'platform': 'LinkedIn',
        'accountId': '@KuCoin Exchange',
        'url': 'https://www.linkedin.com/company/kucoin',
        'type': 'OFFICIAL_URL',
        'iconUrl': 'https://assets.staticimg.com/cms/media/4fYK8198oblEkS5Nl89j71pxqQh66BvNKSjo743Mo.svg',
        data: [
          {
            'id': '64e8677c8383f60001fbe13f',
            'platform': 'LinkedIn',
            'accountId': '@KuCoin Exchange',
            'url': 'https://www.linkedin.com/company/kucoin',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/4fYK8198oblEkS5Nl89j71pxqQh66BvNKSjo743Mo.svg',
          },
        ],
      },

      {
        'id': '64e8677c8383f60001fbe140',
        'platform': 'Facebook',
        'accountId': '@KuCoinOfficial ',
        'url': 'https://www.facebook.com/KuCoinOfficial/',
        'type': 'OFFICIAL_URL',
        'iconUrl': 'https://assets.staticimg.com/cms/media/6v6kR5GCBD0VcJ1wn5iHkzG5ZakUKpSkDgoBlJN3i.svg',
        data: [
          {
            'id': '64e8677c8383f60001fbe140',
            'platform': 'Facebook',
            'accountId': '@KuCoinOfficial ',
            'url': 'https://www.facebook.com/KuCoinOfficial/',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/6v6kR5GCBD0VcJ1wn5iHkzG5ZakUKpSkDgoBlJN3i.svg',
          },
          {
            'id': '60f16242261d950009e5de53',
            'platform': 'Facebook',
            'accountId': '@KuCoinItalia',
            'url': 'https://www.facebook.com/KuCoinItalia/',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/6v6kR5GCBD0VcJ1wn5iHkzG5ZakUKpSkDgoBlJN3i.svg',
          },
        ]
      },

      {
        'id': '64e8677c8383f60001fbe141',
        'platform': 'Instagram',
        'accountId': '@kucoinexchange',
        'url': 'https://www.instagram.com/kucoinexchange',
        'type': 'OFFICIAL_URL',
        'iconUrl': 'https://assets.staticimg.com/cms/media/3SnmfRsfAFhtMrwQ2RbBJERrSOYvuCxZqvvObL2GV.svg',
        data: [
          {
            'id': '64e8677c8383f60001fbe141',
            'platform': 'Instagram',
            'accountId': '@kucoinexchange',
            'url': 'https://www.instagram.com/kucoinexchange',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/3SnmfRsfAFhtMrwQ2RbBJERrSOYvuCxZqvvObL2GV.svg',
          },
        ],
      },

      {
        'id': '64e8677c8383f60001fbe142',
        'platform': 'Bitcointalk',
        'accountId': '@KuCoin Exchange',
        'url': 'https://bitcointalk.org/index.php?action=profile;u=2592830',
        'type': 'OFFICIAL_URL',
        'iconUrl': 'https://assets.staticimg.com/cms/media/5DRMqRBgCTHlRcDbjPHk58cbWnW3Mv6zlP30gLyyb.svg',
        data: [
          {
            'id': '64e8677c8383f60001fbe142',
            'platform': 'Bitcointalk',
            'accountId': '@KuCoin Exchange',
            'url': 'https://bitcointalk.org/index.php?action=profile;u=2592830',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/5DRMqRBgCTHlRcDbjPHk58cbWnW3Mv6zlP30gLyyb.svg',
          },
        ],
      },

      {
        'id': '64e8677c8383f60001fbe143',
        'platform': 'Whatsapp',
        'accountId': 'sdasd@qq.com',
        'url': 'https://www.baidu.com',
        'type': 'OFFICIAL_URL',
        'iconUrl': 'https://assets.staticimg.com/cms/media/6wiSogy4Zv5ukumfWEPDAwNo2CvIiZwHdrQxXW6K0.svg',
        data: [
          {
            'id': '64e8677c8383f60001fbe143',
            'platform': 'Whatsapp',
            'accountId': 'sdasd@qq.com',
            'url': 'https://www.baidu.com',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/6wiSogy4Zv5ukumfWEPDAwNo2CvIiZwHdrQxXW6K0.svg',
          },
        ]
      },

      {
        'id': '64e8677c8383f60001fbe144',
        'platform': 'Line',
        'accountId': 'smlie的',
        'url': 'https://chrome.google.com/webstore/category/extensions?hl=zh-CN',
        'type': 'OFFICIAL_URL',
        'iconUrl': 'https://assets.staticimg.com/cms/media/8GUtEg4srjr5KLCxP0QgWWcdQCgAApDMh6aKAtAOg.svg',
        data: [
          {
            'id': '64e8677c8383f60001fbe144',
            'platform': 'Line',
            'accountId': 'smlie的',
            'url': 'https://chrome.google.com/webstore/category/extensions?hl=zh-CN',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/8GUtEg4srjr5KLCxP0QgWWcdQCgAApDMh6aKAtAOg.svg',
          },
        ],
      },
    ]);

    expect(result_it_IT).toEqual([
      {
        'id': '60f16242261d950009e5de51',
        'platform': 'Telegram',
        'accountId': '@kucoinitalianofficial',
        'url': 'https://t.me/kucoinitalianofficial',
        'type': 'OFFICIAL_URL',
        'iconUrl': 'https://assets.staticimg.com/cms/media/13MhLZMIS4VLXnPFamYXBMRlqZeAG7n1vjHiiAnfB.svg',
        'data': [
          {
            'id': '60f16242261d950009e5de51',
            'platform': 'Telegram',
            'accountId': '@kucoinitalianofficial',
            'url': 'https://t.me/kucoinitalianofficial',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/13MhLZMIS4VLXnPFamYXBMRlqZeAG7n1vjHiiAnfB.svg',
          },
          {
            'id': '64e8677c8383f60001fbe139',
            'platform': 'Telegram',
            'accountId': '@Kucoin_News1',
            'url': 'https://t.me/Kucoin_News',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/13MhLZMIS4VLXnPFamYXBMRlqZeAG7n1vjHiiAnfB.svg',
          },
          {
            'id': '64e8677c8383f60001fbe13a',
            'platform': 'Telegram',
            'accountId': '@KuCoinTradingBotGroup',
            'url': 'https://t.me/KuCoinTradingBotGroup',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/13MhLZMIS4VLXnPFamYXBMRlqZeAG7n1vjHiiAnfB.svg',
          },
          {
            'id': '64f6fe684fd5ed00011282d4',
            'platform': 'Telegram',
            'accountId': '@KuCoin_Exchange_CHN',
            'url': 'https://t.me/KuCoin_Exchange_CHN',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/13MhLZMIS4VLXnPFamYXBMRlqZeAG7n1vjHiiAnfB.svg',
          },
        ],
      },

      {
        'id': '60f16242261d950009e5de52',
        'platform': 'Twitter',
        'accountId': '@KuCoinItalia',
        'url': 'https://twitter.com/KuCoinItalia',
        'type': 'OFFICIAL_URL',
        'iconUrl': 'https://assets.staticimg.com/cms/media/2yOBIYHZ0D7w6eNdIcfWrYWK7cOH3vtAwc8hHdwi4.svg',
        'data': [
          {
            'id': '60f16242261d950009e5de52',
            'platform': 'Twitter',
            'accountId': '@KuCoinItalia',
            'url': 'https://twitter.com/KuCoinItalia',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/2yOBIYHZ0D7w6eNdIcfWrYWK7cOH3vtAwc8hHdwi4.svg',
          },
          {
            'id': '64e8677c8383f60001fbe13b',
            'platform': 'Twitter',
            'accountId': '@kucoincom',
            'url': 'https://twitter.com/KuCoinCom111',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/2yOBIYHZ0D7w6eNdIcfWrYWK7cOH3vtAwc8hHdwi4.svg',
          },
          {
            'id': '64f6fe684fd5ed00011282d6',
            'platform': 'Twitter',
            'accountId': 'twitter zh',
            'url': 'https://www.twitter.com/',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/2yOBIYHZ0D7w6eNdIcfWrYWK7cOH3vtAwc8hHdwi4.svg',
          },
        ]
      },

      {
        'id': '60f16242261d950009e5de53',
        'platform': 'Facebook',
        'accountId': '@KuCoinItalia',
        'url': 'https://www.facebook.com/KuCoinItalia/',
        'type': 'OFFICIAL_URL',
        'iconUrl': 'https://assets.staticimg.com/cms/media/6v6kR5GCBD0VcJ1wn5iHkzG5ZakUKpSkDgoBlJN3i.svg',
        data: [
          {
            'id': '60f16242261d950009e5de53',
            'platform': 'Facebook',
            'accountId': '@KuCoinItalia',
            'url': 'https://www.facebook.com/KuCoinItalia/',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/6v6kR5GCBD0VcJ1wn5iHkzG5ZakUKpSkDgoBlJN3i.svg',
          },
          {
            'id': '64e8677c8383f60001fbe140',
            'platform': 'Facebook',
            'accountId': '@KuCoinOfficial ',
            'url': 'https://www.facebook.com/KuCoinOfficial/',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/6v6kR5GCBD0VcJ1wn5iHkzG5ZakUKpSkDgoBlJN3i.svg',
          },
        ]
      },

      {
        'id': '60f16242261d950009e5de54',
        'platform': 'Reddit',
        'accountId': 'r/kucoin_italy',
        'url': 'https://www.reddit.com/r/kucoin_italy/',
        'type': 'OFFICIAL_URL',
        'iconUrl': 'https://assets.staticimg.com/cms/media/9lYaNzDDJpdZHOSwGnglGIeOhELMQHTm2JQSfZbSi.svg',
        data: [
          {
            'id': '60f16242261d950009e5de54',
            'platform': 'Reddit',
            'accountId': 'r/kucoin_italy',
            'url': 'https://www.reddit.com/r/kucoin_italy/',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/9lYaNzDDJpdZHOSwGnglGIeOhELMQHTm2JQSfZbSi.svg',
          },
          {
            'id': '64e8677c8383f60001fbe13c',
            'platform': 'Reddit',
            'accountId': 'r/kucoin',
            'url': 'https://www.reddit.com/r/kucoin',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/9lYaNzDDJpdZHOSwGnglGIeOhELMQHTm2JQSfZbSi.svg',
          },
        ],
      },

      {
        'id': '60f16242261d950009e5de55',
        'platform': 'YouTube',
        'accountId': '@KuCoin Exchange Italy',
        'url': 'https://www.youtube.com/channel/UCMIfs24TQJeSsJA0crwYH0g',
        'type': 'OFFICIAL_URL',
        'iconUrl': 'https://assets.staticimg.com/cms/media/5lvIM4nHi6K8MiRi2in2iOwBt8Ki7v8cZveWTWN1M.svg',
        data: [
          {
            'id': '60f16242261d950009e5de55',
            'platform': 'YouTube',
            'accountId': '@KuCoin Exchange Italy',
            'url': 'https://www.youtube.com/channel/UCMIfs24TQJeSsJA0crwYH0g',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/5lvIM4nHi6K8MiRi2in2iOwBt8Ki7v8cZveWTWN1M.svg',
          },
          {
            'id': '64e8677c8383f60001fbe13e',
            'platform': 'YouTube',
            'accountId': '@KuCoin',
            'url': 'https://www.youtube.com/c/KuCoinExchange',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/5lvIM4nHi6K8MiRi2in2iOwBt8Ki7v8cZveWTWN1M.svg',
          },
        ],
      },
      {
        'id': '60f16242261d950009e5de56',
        'platform': 'Medium',
        'accountId': '@KuCoinExchangeItaly',
        'url': 'https://medium.com/@KuCoinExchangeItaly',
        'type': 'OFFICIAL_URL',
        'iconUrl': 'https://assets.staticimg.com/cms/media/5boSqUv55LyzeDGe83o83qEVvzTSbmOFqQx5CfWAa.svg',
        data: [
          {
            'id': '60f16242261d950009e5de56',
            'platform': 'Medium',
            'accountId': '@KuCoinExchangeItaly',
            'url': 'https://medium.com/@KuCoinExchangeItaly',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/5boSqUv55LyzeDGe83o83qEVvzTSbmOFqQx5CfWAa.svg',
          },
          {
            'id': '64e8677c8383f60001fbe13d',
            'platform': 'Medium',
            'accountId': '@kucoinexchange',
            'url': 'https://medium.com/kucoinexchange',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/5boSqUv55LyzeDGe83o83qEVvzTSbmOFqQx5CfWAa.svg',
          },
        ]
      },

      {
        'id': '64e8677c8383f60001fbe13f',
        'platform': 'LinkedIn',
        'accountId': '@KuCoin Exchange',
        'url': 'https://www.linkedin.com/company/kucoin',
        'type': 'OFFICIAL_URL',
        'iconUrl': 'https://assets.staticimg.com/cms/media/4fYK8198oblEkS5Nl89j71pxqQh66BvNKSjo743Mo.svg',
        data: [
          {
            'id': '64e8677c8383f60001fbe13f',
            'platform': 'LinkedIn',
            'accountId': '@KuCoin Exchange',
            'url': 'https://www.linkedin.com/company/kucoin',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/4fYK8198oblEkS5Nl89j71pxqQh66BvNKSjo743Mo.svg',
          },
        ],
      },

      {
        'id': '64e8677c8383f60001fbe141',
        'platform': 'Instagram',
        'accountId': '@kucoinexchange',
        'url': 'https://www.instagram.com/kucoinexchange',
        'type': 'OFFICIAL_URL',
        'iconUrl': 'https://assets.staticimg.com/cms/media/3SnmfRsfAFhtMrwQ2RbBJERrSOYvuCxZqvvObL2GV.svg',
        data: [
          {
            'id': '64e8677c8383f60001fbe141',
            'platform': 'Instagram',
            'accountId': '@kucoinexchange',
            'url': 'https://www.instagram.com/kucoinexchange',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/3SnmfRsfAFhtMrwQ2RbBJERrSOYvuCxZqvvObL2GV.svg',
          },
        ],
      },

      {
        'id': '64e8677c8383f60001fbe142',
        'platform': 'Bitcointalk',
        'accountId': '@KuCoin Exchange',
        'url': 'https://bitcointalk.org/index.php?action=profile;u=2592830',
        'type': 'OFFICIAL_URL',
        'iconUrl': 'https://assets.staticimg.com/cms/media/5DRMqRBgCTHlRcDbjPHk58cbWnW3Mv6zlP30gLyyb.svg',
        data: [
          {
            'id': '64e8677c8383f60001fbe142',
            'platform': 'Bitcointalk',
            'accountId': '@KuCoin Exchange',
            'url': 'https://bitcointalk.org/index.php?action=profile;u=2592830',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/5DRMqRBgCTHlRcDbjPHk58cbWnW3Mv6zlP30gLyyb.svg',
          },
        ],
      },

      {
        'id': '64e8677c8383f60001fbe143',
        'platform': 'Whatsapp',
        'accountId': 'sdasd@qq.com',
        'url': 'https://www.baidu.com',
        'type': 'OFFICIAL_URL',
        'iconUrl': 'https://assets.staticimg.com/cms/media/6wiSogy4Zv5ukumfWEPDAwNo2CvIiZwHdrQxXW6K0.svg',
        data: [
          {
            'id': '64e8677c8383f60001fbe143',
            'platform': 'Whatsapp',
            'accountId': 'sdasd@qq.com',
            'url': 'https://www.baidu.com',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/6wiSogy4Zv5ukumfWEPDAwNo2CvIiZwHdrQxXW6K0.svg',
          },
        ]
      },

      {
        'id': '64e8677c8383f60001fbe144',
        'platform': 'Line',
        'accountId': 'smlie的',
        'url': 'https://chrome.google.com/webstore/category/extensions?hl=zh-CN',
        'type': 'OFFICIAL_URL',
        'iconUrl': 'https://assets.staticimg.com/cms/media/8GUtEg4srjr5KLCxP0QgWWcdQCgAApDMh6aKAtAOg.svg',
        data: [
          {
            'id': '64e8677c8383f60001fbe144',
            'platform': 'Line',
            'accountId': 'smlie的',
            'url': 'https://chrome.google.com/webstore/category/extensions?hl=zh-CN',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/8GUtEg4srjr5KLCxP0QgWWcdQCgAApDMh6aKAtAOg.svg',
          },
        ],
      },

      {
        'id': '64f6fe684fd5ed00011282d5',
        'platform': 'weibo',
        'accountId': 'KuCoin动态1',
        'url': 'https://weibo.com/u/7198121896',
        'type': 'OFFICIAL_URL',
        'iconUrl': 'https://assets.staticimg.com/cms/media/11foFRaV3oBjachuqlJCTQ90GbtUVPk1MR41uUbVJ.svg',
        'data': [
          {
            'id': '64f6fe684fd5ed00011282d5',
            'platform': 'weibo',
            'accountId': 'KuCoin动态1',
            'url': 'https://weibo.com/u/7198121896',
            'type': 'OFFICIAL_URL',
            'iconUrl': 'https://assets.staticimg.com/cms/media/11foFRaV3oBjachuqlJCTQ90GbtUVPk1MR41uUbVJ.svg',
          },
        ],
      },
    ]);
  });
});
