/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, Fragment, Suspense } from 'react';
import { useTheme } from '@kux/mui';
import { ICChangemodeOutlined, ICNoviceGuideOutlined } from '@kux/icons';
import Dropdown from '@mui/Dropdown';
import Overlay from '../Overlay';
import { useDispatch } from 'dva';
import { TRADEMODE_META } from '@/meta/tradeTypes';
import GuideTooltip from '@/components/GuideTooltip';
import useCustomerUrl from '@/hooks/useCustomerUrl';
import { useTradeMode } from '@/hooks/common/useTradeMode';
import useIsMargin from '@/hooks/useIsMargin';
import { _t } from 'utils/lang';
import styled from '@emotion/styled';
import { isDisplayVideoTutorial } from '@/meta/multiTenantSetting';

const VideoTutorial = React.lazy(() => {
  return import(
    /* webpackChunkName: 'tradev4-videoTutorial' */
    '@/pages/Portal/VideoTutorial'
  );
});

export const TriggerWrapper = styled.div`
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TYPES_ENUM = {
  LAYOUT: 'LAYOUT',
  VIDEO_TUTORIAL: 'VIDEO_TUTORIAL',
  CUSTOMER: 'CUSTOMER',
};

const LIST = [
  ...(isDisplayVideoTutorial() ? [{
    text: _t('14Bb6tqqBJT8DXHBgHNUUT'),
    iconComp: <ICChangemodeOutlined />,
    type: TYPES_ENUM.VIDEO_TUTORIAL,
  }] : []),
  {
    fileName: 'toolbar',
    icon: 'customer-service',
    text: _t('iD7MXDzctJNPx8meu4hufy'),
    type: TYPES_ENUM.CUSTOMER,
  },
];

/**
 * Tutorial
 */
const Tutorial = (props) => {
  const { ...restProps } = props;

  const dispatch = useDispatch();
  const { colors } = useTheme();
  const isMargin = useIsMargin();
  const tradeMode = useTradeMode();
  const { openUrl } = useCustomerUrl();

  // 是否手动模式下的杠杆交易页(全仓/逐仓)
  const isMarginTrade = isMargin && tradeMode === TRADEMODE_META.keys.MANUAL;

  const handleItemClick = (type) => {
    switch (type) {
      case TYPES_ENUM.CUSTOMER:
        openUrl();
        break;
      case TYPES_ENUM.VIDEO_TUTORIAL:
        dispatch({
          type: 'setting/update',
          payload: {
            layoutIntroductionVisible: true,
          },
        });
        break;
      default:
        break;
    }
  };
  return (
    <Fragment>
      {isDisplayVideoTutorial() ? (
        <Suspense fallback={<div />}>
          <VideoTutorial />
        </Suspense>
      ) : null}
      <Dropdown
        holdDropdown
        {...restProps}
        trigger="click"
        overlay={<Overlay onItemClick={handleItemClick} options={LIST} />}
      >
        <TriggerWrapper>
          <GuideTooltip
            placement="bottom-end"
            iconProps={{ type: 'guide-video' }}
            footerProps={{
              okText: _t('trd.ca.detail.show'),
              onOk: () => handleItemClick(TYPES_ENUM.VIDEO_TUTORIAL),
            }}
            {...isMarginTrade ? {
              code: 'marginVideo',
              title: _t('9418ce5f53364000a812'),
              describe: _t('51d53a6707a64000a73d'),
            } : {
              code: 'videoTutorial',
              title: _t('9YEzPZuJm2SgCG7qEYQn7L'),
              describe: _t('8QFw7MMLKG3fyscvs7XP4s'),
            }}
          >
            <ICNoviceGuideOutlined size={20} color={colors.icon} className="pointer ml-8 mr-8" />
          </GuideTooltip>
        </TriggerWrapper>
      </Dropdown>
    </Fragment>
  );
};

export default memo(Tutorial);
