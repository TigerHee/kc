/**
 * Owner: mike@kupotech.com
 */
import React, { memo } from 'react';
import ComponentWrapper from '@/components/ComponentWrapper';
import FundSelector from './components/FundSelector';
import { TableBox, LoginWrapper } from './style';
import AutoSizer from 'react-virtualized-auto-sizer';
import { name, fundTableHeadFilterCfg, WrapperContext } from './config';
import { useTradeType } from '@/hooks/common/useTradeType';
import { FUTURES } from '@/meta/const';
import { useSelector } from 'dva';
import { _tHTML } from 'utils/lang';
import getMainsiteLink from 'utils/getMainsiteLink';

const { registerUrl } = getMainsiteLink();

const Fund = () => {
  const tradeType = useTradeType();
  const { breakPoints, FundTable } = fundTableHeadFilterCfg.get(tradeType);
  const isLogin = useSelector((state) => state.user.isLogin);
  const screen = React.useContext(WrapperContext);
  return (
    <ComponentWrapper name={name} breakPoints={breakPoints}>
      <FundSelector />
      {isLogin ? (
        <TableBox>
          {tradeType !== FUTURES ? (
            <AutoSizer disableWidth>
              {({ height }) => {
                return <FundTable height={height - 40} />;
              }}
            </AutoSizer>
          ) : (
            <FundTable />
          )}
        </TableBox>
      ) : (
        <LoginWrapper screen={screen}>{_tHTML('trd.form.login.reg', { registerUrl })}</LoginWrapper>
      )}
    </ComponentWrapper>
  );
};

export default memo(Fund);
