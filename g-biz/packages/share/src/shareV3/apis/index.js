/**
 * Owner: gavin.liu1@kupotech.com
 */
import { get } from '@tools/request';
import storage from '@utils/storage';

// NOTE: 因为一页可能有多个组件，但数据是唯一的，我们缓存起来
const getCache = (key) => {
  const cacheGlobal = window.__gbiz_share_cache__ || {};
  if (cacheGlobal[key]) {
    return cacheGlobal[key];
  }
  return null;
};
const setCache = (key, value) => {
  const cacheGlobal = window.__gbiz_share_cache__ || {};
  cacheGlobal[key] = value;
  window.__gbiz_share_cache__ = cacheGlobal;
};

const getXVersion = () => {
  if (process.env.NODE_ENV === 'development') {
    try {
      const valueOrigin = storage.getItem('kucoinv2__x_version');
      const value = JSON.parse(valueOrigin);
      return value?.length ? `?x-version=${value}` : '';
    } catch {
      return '';
    }
  }
  return '';
};

export const getShareData = async (params) => {
  const cache = getCache('shareData');
  if (cache) {
    return Promise.resolve(cache);
  }
  const xVersion = getXVersion();
  const res = await get(`/promotion/v1/invitation/share-to-friends${xVersion}`, params);
  setCache('shareData', res);
  return res;
  // return {
  //   'success': true,
  //   'code': '200',
  //   'msg': 'success',
  //   'retry': false,
  //   'data': {
  //     'ads': {
  //       data: {
  //         'affliliate-old-banner-web-mobile': [
  //           // 广告位名称，这个非固定值，前端确认了需要数据后删除不用的数据
  //           {
  //             'id': 5139,
  //             'title': '合伙人4+mobile(1)',
  //             'ad_position': 106,
  //             'sort': 0,
  //             'default_language': 'en_US',
  //             'released_at': null,
  //             'canceled_at': null,
  //             'user_group': null,
  //             'media_id': 19190,
  //             'language_id': 20,
  //             'alt': '1',
  //             'url': 'https://www.kucoin.net/news/kucoin-affiliate-program-guide-test-run',
  //             'imageUrl':
  //               'https://asset-v2.kucoin.net/cms/media/2SNN33dWjYGRnEiOftzlNGXrg7oGhm5hQbWslwztv.jpg',
  //             'daytime_image_url':
  //               'https://asset-v2.kucoin.net/cms/media/2SNN33dWjYGRnEiOftzlNGXrg7oGhm5hQbWslwztv.jpg',
  //             'size': '720*220',
  //             'countdown': null,
  //             'language': 'en_US',
  //           },
  //           {
  //             'id': 5144,
  //             'title': '合伙人2.0mobile3',
  //             'ad_position': 106,
  //             'sort': 2,
  //             'default_language': 'en_US',
  //             'released_at': null,
  //             'canceled_at': null,
  //             'user_group': null,
  //             'media_id': 19194,
  //             'language_id': 20,
  //             'alt': '3',
  //             'url': 'https://www.kucoin.net/ko/news/kucoin-affiliate-program-guide-test-run',
  //             'imageUrl':
  //               'https://asset-v2.kucoin.net/cms/media/2SNN33dWjYGRnEiOftzlNGXrg7oGhm5hQbWslwztv.jpg',
  //             'daytime_image_url':
  //               'https://asset-v2.kucoin.net/cms/media/2SNN33dWjYGRnEiOftzlNGXrg7oGhm5hQbWslwztv.jpg',
  //             'size': '720*220',
  //             'countdown': null,
  //             'language': 'en_US',
  //           },
  //         ],
  //       },
  //     },
  //     'referralCode': '111111',
  //   },
  // };
};

export const CONFIG_ITEMS = {
  SharePosterTxt: 'SharePosterTxt',
};

export const getPageConfigItems = async (params) => {
  const cache = getCache('pageConfigItems');
  if (cache) {
    return Promise.resolve(cache);
  }
  const res = await get(`/growth-config/get/client/config/codes`, params);
  setCache('pageConfigItems', res);
  return res;
  // return {
  //   'success': true,
  //   'code': '200',
  //   'msg': 'success',
  //   'retry': false,
  //   'data': {
  //     'businessLine': 'toc',
  //     'appId': null,
  //     'properties': [
  //       {
  //         'id': '64880da0bb140b0001e81843',
  //         'status': 0,
  //         'property': 'SharePosterTxt',
  //         'appId': null,
  //         'value':
  //           'He snatched his knife out of the sheath and slammed it into a tree trunk. Next time there would be no mercy. He looked round fiercely, daring them to contradict. Then they broke out into the sunlight and for a while they were busy finding and devouring food as they moved down the scar toward the platform and the meeting.    ',
  //         'name': null,
  //         'lang': 'en_US',
  //         'jumpType': 'none',
  //         'jumpUrl': '',
  //         'version': 1,
  //         'backupValues': null,
  //         'updatedDate': 1686638122000,
  //       },
  //     ],
  //   },
  // };
};
