/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useMemo, useCallback } from 'react';
import { DetailBody, DetailFooter, DetailHeader, Index } from './StyledComps';
import { ReactComponent as ArrowRight } from 'assets/eth-merge/arrow-right.svg';
import { useSelector } from 'dva';
import moment from 'moment';
import PropTypes from 'prop-types';

import { _t, _tHTML } from 'src/utils/lang';
import { useIsMobile } from 'src/components/Responsive';
import Calendar from 'components/$/EthMerge/Calendar';
import { debounce } from 'lodash';
import { TRADE_URL } from '../config';
import { openPage } from 'src/helper';
import { sensors } from 'src/utils/sensors';
import { ReactComponent as ShareSvg } from 'assets/eth-merge/share.svg';
import VideoPlay  from './VideoPlay';

const IndexPage = React.memo(({ goShare }) => {
  const { mergeTime } = useSelector(state => state.ethMerge.activityConfig);
  const isInApp = useSelector(state => state.app.isInApp);
  const isMobile = useIsMobile();
  const mergeTimeUnix = useMemo(
    () => {
      return moment.utc(mergeTime);
    },
    [mergeTime],
  ); // 今天的开始时间戳

  // 跳转页面
  const goToPage = useCallback(
    debounce(
      () => {
        // 埋点
        sensors.trackClick(['ETH/USDT Spot', '1']);
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
      <Calendar />
      <DetailHeader>
        <span>
          {_t('47BJSQmPm89gw2mq61WrPv', {
            year: mergeTimeUnix.format('YYYY'),
            month: mergeTimeUnix.format('MMMM'),
            day: mergeTimeUnix.format('Do'),
          })}
        </span>
      </DetailHeader>
      <DetailBody>
        <h3>{_t('iACtoFX7Nkij5R8VkcuTPZ')}</h3>
        <p>{_t('joxTnfxLTmTjCeJq5iuZAN')}</p>
        <VideoPlay />
      </DetailBody>
      <DetailFooter>
        <button onClick={goShare} className="shareBtn">
          <span>{_t('jnd6G3caau5bRxVD1wHdhb')}</span> <ShareSvg className='ml-8' />
        </button>
        <button onClick={goToPage}>
          <span>{_t('tme1Wm3o1Gy3t18CtHhcj4')}</span> <ArrowRight className='ml-8' />
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
