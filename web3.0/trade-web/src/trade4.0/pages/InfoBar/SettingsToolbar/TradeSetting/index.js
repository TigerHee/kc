/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, Fragment, useState, useCallback, useEffect, Suspense } from 'react';
import GuideTooltip from '@/components/GuideTooltip';
import TooltipWrapper from '@/components/TooltipWrapper';
import { IconWrapper } from '../style';
import { _t } from 'utils/lang';
import { useDispatch, useSelector } from 'dva';
import { commonSensorsFunc } from '@/meta/sensors';

const SettingDrawer = React.lazy(() => {
  return import(/* webpackChunkName: 'tradev4-settingDrawer' */ './SettingDrawer');
});

/**
 * TradeSetting
 * 目前包含预警设置和铃声设置
 */
const TradeSetting = (props) => {
  const { ...restProps } = props;
  const [visible, setVisible] = useState(false);
  const isLogin = useSelector((state) => state.user.isLogin);

  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    commonSensorsFunc(['tradeZoneFunctionArea', 'setting', 'click']);
    setVisible(true);
  }, []);

  useEffect(() => {
    if (isLogin && visible) {
      dispatch({
        type: 'priceWarn/pull',
      });
    }
  }, [dispatch, isLogin, visible]);

  return (
    <Fragment>
      <GuideTooltip
        code="soundReminder"
        placement="bottom-end"
        popperStyle={{ zIndex: 999 }}
        iconProps={{ type: 'guide-sound' }}
        title={_t('8R85JxxwW7Z8hy1niyuiN8')}
        describe={_t('xcakR1avRVUgUWuP2jf13Q')}
      >
        <TooltipWrapper
          placement="bottom"
          title={_t('trd.info.set')}
          popperStyle={{ zIndex: 999 }}
          disabledOnMobile
          {...restProps}
        >
          <IconWrapper type="setting" fileName="toolbar" onClick={handleClick} />
        </TooltipWrapper>
      </GuideTooltip>
      <Suspense fallback={<div />}>
        <SettingDrawer
          show={visible}
          onClose={() => setVisible(false)}
          onOk={() => setVisible(false)}
        />
      </Suspense>
    </Fragment>
  );
};

export default memo(TradeSetting);
