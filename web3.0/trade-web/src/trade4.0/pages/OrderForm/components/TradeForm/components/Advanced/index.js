/*
 * owner: borden@kupotech.com
 */
import React, {
  useState,
  useMemo,
  useCallback,
  Suspense,
  Fragment,
} from 'react';
import { ICDeleteOutlined } from '@kux/icons';
import { useDispatch, useSelector } from 'dva';
import withAuth from '@/hocs/withAuth';
import useSensorFunc from '@/hooks/useSensorFunc';
import { _t, _tHTML } from 'src/utils/lang';
import useSide from '../../../../hooks/useSide';
import {
  Container,
  SettingInfo,
  SettingLabel,
  SettingButton,
  StyledDeleteTooltipWrapper,
  StyledTooltipWrapperForTitle,
} from './style';

const AdvancedModal = React.lazy(() => {
  return import(/* webpackChunkName: 'tradev4-advancedModal' */ './Modal');
});

const AuthSettingButton = withAuth(SettingButton);

const Advanced = React.memo((props) => {
  const dispatch = useDispatch();
  const sensorFunc = useSensorFunc();
  const { side } = useSide();
  const user = useSelector((state) => state.user.user);
  const isLogin = useSelector((state) => state.user.isLogin);
  const advanceSettings = useSelector(
    (state) => state.tradeForm[`advanceSettings_${side}`],
  );

  const [advancedOpen, setAdvancedOpen] = useState(false);

  const { referralCode } = user || {};
  const memoryKey = `${referralCode || '_'}advance_modal_${side}`;

  const clearAdvanceSettings = useCallback(() => {
    if (isLogin) {
      window.localStorage.removeItem(memoryKey);
      dispatch({
        type: 'tradeForm/updateAdvanceModalData',
        payload: {
          settings: null,
          side,
        },
      });
    }
  }, [isLogin, memoryKey]);

  const displaySetting = useMemo(() => {
    if (!isLogin) {
      return '--';
    }
    const settings = [
      advanceSettings?.ph,
      advanceSettings?.timeStrategy,
    ].filter(Boolean);
    return settings.length > 0 ? (
      <Fragment>
        {settings.join(',')}
        <StyledDeleteTooltipWrapper title={_t('trd.advance.reset')}>
          <ICDeleteOutlined size={14} onClick={clearAdvanceSettings} />
        </StyledDeleteTooltipWrapper>
      </Fragment>
    ) : (
      '--'
    );
  }, [isLogin, advanceSettings, clearAdvanceSettings]);

  const handleSettingClick = () => {
    sensorFunc(['spotTrading', 'advancedSetting']);
    setAdvancedOpen(true);
  };
  return (
    <Fragment>
      <Container>
        <SettingInfo>
          <StyledTooltipWrapperForTitle size="small" isTip useUnderline title={_t('trd.help.advanced')}>
            {_t('trd.info.advance')}
          </StyledTooltipWrapperForTitle>
          {displaySetting}
        </SettingInfo>
        <AuthSettingButton onClick={handleSettingClick}>
          {_t('trd.info.set')}
        </AuthSettingButton>
      </Container>
      {Boolean(isLogin) && (
        <Suspense fallback={<div />}>
          <AdvancedModal
            {...props}
            memoryKey={memoryKey}
            open={advancedOpen}
            onCancel={() => setAdvancedOpen(false)}
          />
        </Suspense>
      )}
    </Fragment>
  );
});

export default Advanced;
