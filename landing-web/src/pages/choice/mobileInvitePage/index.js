/**
 * Owner: jesse.shao@kupotech.com
 */
import { useMemo, useCallback } from 'react';
import { useIsMobile } from 'components/Responsive';
import { useSelector } from 'dva';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';
import JsBridge from 'utils/jsBridge';
import { _t } from 'utils/lang';
import { LANDING_HOST } from 'utils/siteConfig';
import { InviteCard } from 'components/$/ShowCase/InviteModal';
import queryString from 'querystring';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import styles from './styles.less';

export default brandCheckHoc(() => {
  const isMobile = useIsMobile();
  const isInApp = useSelector(state => state.app.isInApp);
  const supportCookieLogin = useSelector(state => state.showcase.supportCookieLogin);

  const shareUrl = useMemo(() => {
    const searchs = queryString.parse(window.location.search);
    const rcode = queryPersistence.getPersistenceQuery('rcode');
    const id = searchs['?id'] || searchs.id;
    // const url = `http://192.168.3.56:8000/choice/${id}?rcode=${rcode}`;

    const url = `${LANDING_HOST}/choice/${id}?rcode=${rcode}`;
    return url;
  }, []);

  const onClickBtn = useCallback(() => {
    JsBridge.open({
      type: 'func',
      params: {
        name: 'share',
        category: 'link',
        linkUrl: shareUrl,
        content: _t('choice.invite.scan.activity.link')
      }
    });
  }, [shareUrl]);

  const inviteCardProps = useMemo(() => ({
    isMobile,
    onClickBtn,
    shareUrl,
    isInApp,
    supportCookieLogin
  }), [isInApp, isMobile, onClickBtn, shareUrl, supportCookieLogin]);

  return (
    <div className={styles.invitePage}>
      <InviteCard {...inviteCardProps} />
    </div>
  );
}, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute))
