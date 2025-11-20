/*
  * owner: borden@kupotech.com
 */
import React from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'dva';
import { ICEdit2Outlined } from '@kux/icons';
import useSensorFunc from '@/hooks/useSensorFunc';
import useMarginModel from '@/hooks/useMarginModel';
import TooltipWrapper from '@/components/TooltipWrapper';
import { _t } from 'src/utils/lang';


const StyledTooltipWrapper = styled(TooltipWrapper)`
  font-weight: 500;
  font-size: 12px;
  cursor: pointer;
  height: fit-content;
  color: ${props => props.theme.colors.primary};
`;

const LeverageSetting = React.memo(({ userLeverage, onClick, ...otherProps }) => {
  const dispatch = useDispatch();
  const sensorFunc = useSensorFunc();
  const { userLeverage: _userLeverage } = useMarginModel(['userLeverage']);
  const isLogin = useSelector((state) => !!state.user.isLogin);

  const handleOpenLeverageModal = () => {
    dispatch({
      type: 'isolated/updateLeverageModalConfig',
      payload: {
        open: true,
      },
    });
    sensorFunc(['marginTrading', 'setMulti']);
  };

  if (!isLogin) return null;
  return (
    <StyledTooltipWrapper
      disabledOnMobile
      title={_t('multi.setting')}
      onChildClick={onClick || handleOpenLeverageModal}
      {...otherProps}
    >
      {userLeverage || _userLeverage || '-'}x
      <ICEdit2Outlined className="ml-2 horizontal-flip-in-arabic" />
    </StyledTooltipWrapper>
  );
});

export default LeverageSetting;
