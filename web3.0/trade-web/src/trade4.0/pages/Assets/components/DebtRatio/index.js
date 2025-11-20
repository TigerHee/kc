/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, Fragment } from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'dva';
import Mask, { Placeholder } from 'src/trade4.0/components/Mask';
import PositionStatus from '@/components/Margin/PositionStatus';
import DebtModal from './DebtModal';

const StyledPositionStatus = styled(PositionStatus)`
  margin-top: 6px;
`;
/**
 * DebtRatio
 * 风险模块
 * 包含展示风险和各种穿仓状态之类的
 */
const DebtRatio = () => {
  const showAssets = useSelector((state) => state.setting.showAssets);
  const isLogin = useSelector((state) => state.user.isLogin);

  if (!showAssets) return <Mask />;
  if (!isLogin) return <Placeholder />;

  return (
    <Fragment>
      <DebtModal />
      <StyledPositionStatus />
    </Fragment>
  );
};

export default memo(DebtRatio);
