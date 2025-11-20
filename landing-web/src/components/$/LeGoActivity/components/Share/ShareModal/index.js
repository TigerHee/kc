/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useState, useMemo, forwardRef, useImperativeHandle, useRef } from 'react';
import { useSelector } from 'dva';
import qs from 'qs';
import { SHARE_APP_HOST } from 'config';
import {
  getLinkByScene,
} from 'components/$/MarketCommon/config';
import { _t } from 'utils/lang';
import { addLangToPath } from 'utils/lang';
import PosterShare from '../PosterShare';
import { fixLabel } from './config';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';

// 固定使用.com域名
const _KUCOIN_HOST = SHARE_APP_HOST;

/**
 * 分享弹窗
 * @param {*} props 
 */
const Share = (props, ref) => {
  const { inviteCode, config } = useSelector(state => state.legoActivityPage);
  const { channelCode, subject } = config || {};
  const [posterUrl, updateUrl] = useState('');
  const [options, updateOptions] = useState({});

  const postShareRef = useRef();
  useImperativeHandle(ref, () => ({
    goShare: (_posterUrl, isShow, options) => {
      if (!_posterUrl) return;
      updateUrl(_posterUrl);
      updateOptions(options);
      if (isShow) {
        postShareRef.current.goShare(options);
      }
    },
  }), []);

  // rcode utm_source 存储在storage中
  const rcode = queryPersistence.getPersistenceQuery('rcode');
  const utm_source = queryPersistence.getPersistenceQuery('utm_source');
  const queryValue = {
    rcode: rcode,
    utm_source: utm_source,
  };
  const queryParams = qs.stringify(queryValue);
  const query = queryParams ? `?${queryParams}` : '';

  // 分享链接
  const shareLink = useMemo(() => {
    if (!options || !options.shareLink) return getLinkByScene({
      rcode: inviteCode,
      utm_source: channelCode,
      scene: 'share',
      needConvertedUrl: addLangToPath(`${_KUCOIN_HOST}/land/activity/${subject}${query}`),
    });
    // 自定义shareLink
    return options.shareLink;
  }, [inviteCode, channelCode, subject, query, options]);

  
  /**
   * 分享弹窗，相关配置参数
   */
   const shareParams = useMemo(() => {
    const config = {
      link: shareLink,
      titleKey: '2nSfUwshASZ99x3EVTfKbY',
      subTitleKey: 'tTdJ285sQmv1dNrMq9FiFG',
    };
    const link = config.link;
    const labelHandler = fixLabel;
    return {
      link,
      title: _t(config.titleKey),
      subTitle: _t(config.subTitleKey),
      socialTitle: config.socialTitleKey && _t(config.socialTitleKey),
      posterConfig: {
        fixLabel: labelHandler,
      },
    };
  }, [shareLink]);

  return (
    <PosterShare
      ref={postShareRef}
      posterUrl={posterUrl}
      {...shareParams}
      {...props}
    />
  )
};

export default forwardRef(Share);