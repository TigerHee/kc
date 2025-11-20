/*
 * Owner: tom@kupotech.com
 */
import React from 'react';
import { useSelector } from 'src/hooks/useSelector';
import { useLocale } from '@kucoin-base/i18n';
import { pushTool } from '@kucoin-biz/header';
import HOST from 'utils/siteConfig';
import { push } from 'utils/router';
import useLocaleChange from 'hooks/useLocaleChange';
import config from 'config';
import LearnHeader from './RemoteHeader';

const { v2ApiHosts } = config;

pushTool.setPush(push);

export default () => {
  const { currentLang } = useLocale();
  const changeLocale = useLocaleChange();
  const { user } = useSelector((state) => state.user);

  const hostConfig = {
    KUCOIN_HOST: HOST.KUCOIN_HOST, // kucoin主站地址
    KUCOIN_HOST_CHINA: HOST.KUCOIN_HOST_CHINA, // kucoin主站地址
    TRADE_HOST: HOST.TRADE_HOST, // 交易地址
    KUMEX_HOST: HOST.KUMEX_HOST, // kumex地址
    SANDBOX_HOST: HOST.SANDBOX_HOST, // 沙盒地址
    MAINSITE_API_HOST: v2ApiHosts.CMS, // kucoin主站API地址
    KUMEX_BASIC_HOST: HOST.KUMEX_BASIC_HOST, // KuMEX简约版地址
    FASTCOIN_HOST: HOST.FASTCOIN_HOST, // 一键买币地址
    POOLX_HOST: HOST.POOLX_HOST, // POOLX地址
    LANDING_HOST: HOST.LANDING_HOST, // 流量落地页
  };

  const onLangChange = (l) => {
    changeLocale(l);
  };

  return (
    <LearnHeader
      currentLang={currentLang}
      userInfo={user}
      onLangChange={onLangChange}
      {...hostConfig}
    />
  );
};
