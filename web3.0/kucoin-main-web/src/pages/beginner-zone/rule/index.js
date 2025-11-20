/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect } from 'react';
import { styled } from '@kufox/mui';
import { getIsInApp } from 'helper';
import JsBridge from '@knb/native-bridge';
import { _t } from 'tools/i18n';
import { useLocale } from '@kucoin-base/i18n';
import { addLangToPath } from 'src/tools/i18n';
import siteConfig from 'utils/siteConfig';
const isInApp = getIsInApp() || false;

const Page = styled.div`
  padding: 24px 16px;
`;

// 该页面提供给 app 使用

const RulePage = () => {
  useLocale();

  useEffect(() => {
    if (isInApp)
      JsBridge.open({
        type: 'event',
        params: {
          name: 'updateHeader',
          title: _t('beginnerZone.activityrule'),
          visible: true,
          leftVisible: true,
          rightVisible: false,
        },
      });
  }, []);
  const { LANDING_HOST } = siteConfig;
  //  新手专区页面下线，重定向到福利中心页面
  useEffect(() => {
    window.location.href = addLangToPath(`${LANDING_HOST}/KuRewards`);
  }, [LANDING_HOST]);
  return <div data-inspector="zone_rule_page" />;
};

export default RulePage;
