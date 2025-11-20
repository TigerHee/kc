/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback } from 'react';
import { DetailBody, DetailFooter, Index } from './StyledComps';
import { ReactComponent as ArrowRight } from 'assets/lunc/arrow-right.svg';
import { useSelector } from 'dva';
import PropTypes from 'prop-types';

import { _t } from 'src/utils/lang';
import { useIsMobile } from 'src/components/Responsive';
import { debounce } from 'lodash';
import { TRADE_URL } from '../config';
import { openPage } from 'src/helper';
import { sensors } from 'src/utils/sensors';
import { ReactComponent as ShareSvg } from 'assets/lunc/share.svg';

const IndexPage = React.memo(({ goShare }) => {
  const isInApp = useSelector(state => state.app.isInApp);
  const isMobile = useIsMobile();
  // 跳转页面
  const goToPage = useCallback(
    debounce(
      () => {
        // 埋点
        sensors.trackClick(['LUNC/USDT Spot', '1']);
        const urlObj = TRADE_URL['SPOT'];
        let url;
        if (isInApp) {
          url = urlObj?.appUrl;
        } else if (isMobile) {
          url = urlObj?.h5Url;
        } else {
          url = urlObj?.pcUrl;
        }
        // 跳转
        if (url) {
          openPage(isInApp, url);
        }
      },
      500,
      {
        leading: true,
        trailing: false,
      },
    ),
    [isInApp, isMobile],
  );

  return (
    <Index>
      <DetailBody>
        <h3>{_t('2igVNGDDGwUpcYtF1Efb25')}</h3>
        <p>{_t('c6biNCCa2M3SPSi4Wt4Zuu')}</p>
        <p>{_t('kGth9pNpVREuDRotT2drLv')}</p>
      </DetailBody>
      <DetailFooter>
        <button onClick={goShare} className="shareBtn">
          <span>{_t('jnd6G3caau5bRxVD1wHdhb')}</span> <ShareSvg className="ml-8"/>
        </button>
        <button onClick={goToPage}>
          <span>{_t('tme1Wm3o1Gy3t18CtHhcj4')}</span> <ArrowRight className="ml-8"/>
        </button>
      </DetailFooter>
    </Index>
  );
});

IndexPage.propTypes = {
  goShare: PropTypes.func.isRequired, // 点击分享的回调
};

IndexPage.defaultProps = {
  goShare: () => {},
};

export default IndexPage;
