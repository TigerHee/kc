/**
 * Owner: jesse.shao@kupotech.com
 */
import { isNil, isEmpty } from 'lodash';
import { kcsensorsManualExpose } from 'utils/ga';
import { sensors } from 'utils/sensors';

// posts
import postEN from 'src/assets/referFriend/posts/EN3.png'
import postES from 'src/assets/referFriend/posts/ES3.png'
import postJP from 'src/assets/referFriend/posts/JP3.png'
import postHK from 'src/assets/referFriend/posts/HK3.png'
import postKR from 'src/assets/referFriend/posts/KR3.png'
import postPT from 'src/assets/referFriend/posts/PT3.png'
import postRU from 'src/assets/referFriend/posts/RU3.png'
import postTR from 'src/assets/referFriend/posts/TR3.png'
import postVI from 'src/assets/referFriend/posts/VI3.png'

// 经与UI沟通，当>= 768时，中间只展示375宽度内容
export const SPLITER_WIDTH = 768;

export const CONTENT_WIDTH = 375;

// 曝光元素 blockid locationid
// referFriendExpose(['showDes', '1']);
export const referFriendExpose = (arr, data) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('referFriendExpose', arr);
  }
  if (isNil(arr) || isEmpty(arr)) {
    return;
  }
  try {
    kcsensorsManualExpose({ kc_pageid: 'B3ReferralBonus' }, arr, data);
  } catch (e) {
    console.log('referFriendExpose err:', e.message);
  }
};

// click:  blockid locationid
// referFriendTrackClick(['showDes', '1']);
export const referFriendTrackClick = (arr, data) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('referFriendTrackClick', arr);
  }
  if (isNil(arr) || isEmpty(arr)) {
    return;
  }

  try {
    sensors.trackClick(arr, data);
  } catch (e) {
    console.log('referFriendTrackClick err:', e.message);
  }
};

export const UTM_SOURCE = 'ReferralNewBonus';

export const SHARE = {
  // ar_AE: 'https://assets.staticimg.com/cms/media/8DZMzaNxYUKKlfW18udwJyTN7CX87bb8S6ww98GyX.jpg',
  // bn_BD: 'https://assets.staticimg.com/cms/media/4HObOfQOuPAnxw1buYOrDUJKDZ902AzngKEaTW4VF.jpg',
  // de_DE: 'https://assets.staticimg.com/cms/media/5duehPieoENTg2dxdW7Ws5IwcfYdW4bqW3PM7R5rG.jpg',
  en_US: postEN,
  es_ES: postES,
  // fil_PH: 'https://assets.staticimg.com/cms/media/6CpsIZ7LpONlKsaW3LoHpaZ4Af0j4GsjZgyEvBffW.jpg',
  // fr_FR: 'https://assets.staticimg.com/cms/media/4cijrz6ypN4bSHOIfkMgk2UN8g0M5DUGZiedrHeCz.jpg',
  // hi_IN: 'https://assets.staticimg.com/cms/media/6rJVnqXAHk111WvEFuEyNBmpTIURvFHa6Il0gN9KW.jpg',
  // id_ID: 'https://assets.staticimg.com/cms/media/5IH73X9vK4kiZSRaJLTBncLNNr78IUu9wAQeqogtS.jpg',
  // it_IT: 'https://assets.staticimg.com/cms/media/9OVracxc2WbdGddBgE1Z8BYyC8yx3MJLMZ7XeY7Ua.jpg',
  ja_JP: postJP,
  ko_KR: postKR,
  // ms_MY: 'https://assets.staticimg.com/cms/media/1d89Xa6qqXI9OK7PcRSYCBovMjy66j6hsn7A3PU7o.jpg',
  // nl_NL: 'https://assets.staticimg.com/cms/media/4YzAYwCAqOXTfOLVfU2IZXde2OFcKU4tOoVBW9Q2h.jpg',
  // pl_PL: 'https://assets.staticimg.com/cms/media/9VmHZMZSNViJicp5cPiENIgBTxsH09ESC33c6dueE.jpg',
  pt_PT: postPT,
  ru_RU: postRU,
  // th_TH: 'https://assets.staticimg.com/cms/media/7ApKjb56817Zf5e9jrT8M9bDDIPJztf7YcnZ5ER8m.jpg',
  tr_TR: postTR,
  vi_VN: postVI,
  // zh_CN: 'https://assets.staticimg.com/cms/media/1drAPQdVtlZr12jK557AP1RkSJcfPc8wh3LTDwHJL.jpg',
  zh_HK: postHK,
};
