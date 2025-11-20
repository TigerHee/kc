/**
 * Owner: garuda@kupotech.com
 * 合约资产组件模块
 */

import React, { useCallback, memo } from 'react';
import { useDispatch } from 'react-redux';

import { _t } from 'utils/lang';
import { formatCurrency } from '@/utils/futures';

import { styled } from '@/style/emotion';
import Button from '@mui/Button';
import KuxDivider from '@mui/Divider';
import { isFuturesCrossNew } from '@/meta/const';

import { useGetCurrentSymbolInfo } from '@/hooks/common/useSymbol';
import useAvailableBalance from '@/hooks/futures/useAvailableBalance';
import useLoginDrawer from '@/hooks/useLoginDrawer';
import { useSwitchTrialFund } from '@/hooks/futures/useFuturesTrialFund';

import AssetsBar from './AssetsBar';
import AssetsPosition from './AssetsPosition';

import { AssetsWrapper } from './commonStyle';
import AssetsPositionNew from './AssetsPositionNew';

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;

  button {
    &:first-of-type {
      margin-right: 8px;
    }
  }
`;

const ButtonCls = styled(Button)`
  display: flex;
  flex: 1;
  border-radius: 80px;
  font-size: 12px;
  line-height: 1.3;
  font-weight: 500;
  color: ${(props) => {
    return props.type === 'primary' ? props.theme.colors.textEmphasis : props.theme.colors.text60;
  }}!important;
`;

const Divider = styled(KuxDivider)`
  margin: 12px 0;
`;

const AssetsFutures = ({ isMd }) => {
  const dispatch = useDispatch();
  const { open, isLogin } = useLoginDrawer();
  const symbolInfo = useGetCurrentSymbolInfo();
  const { switchTrialFund } = useSwitchTrialFund();
  const availableBalance = useAvailableBalance(symbolInfo?.settleCurrency, switchTrialFund);

  // const handleGoBuyCoin = useCallback(() => {
  //   if (!isLogin) {
  //     open();
  //     return;
  //   }
  //   const a = document.createElement('a');
  //   a.style.display = 'none';
  //   a.href = addLangToPath(`${siteCfg.FASTCOIN_HOST}`);
  //   a.target = '_blank';
  //   a.rel = 'noopener noreferrer';
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  // }, [isLogin, open]);

  const handleTransfer = useCallback(() => {
    if (!isLogin) {
      open();
      return;
    }
    dispatch({
      type: 'transfer/updateTransferConfig',
      payload: {
        visible: true,
        initCurrency: formatCurrency(symbolInfo?.settleCurrency),
      },
    });
  }, [dispatch, isLogin, open, symbolInfo.settleCurrency]);

  return (
    <AssetsWrapper className="futures-assets-panel">
      <AssetsBar isMd={isMd} />
      <Divider />
      {isFuturesCrossNew() ? <AssetsPositionNew isMd={isMd} /> : <AssetsPosition isMd={isMd} />}
      {/* 开启体验金，屏蔽划转 */}
      {switchTrialFund ? null : (
        <ButtonGroup>
          {/* 产品要求：屏蔽充币入口 */}
          {/* <ButtonCls
          size="small"
          variant="contained"
          type="default"
          fullWidth
          onClick={handleGoBuyCoin}
        >
          {_t('assets.buy')}
        </ButtonCls> */}
          <ButtonCls
            size="small"
            onClick={handleTransfer}
            variant="contained"
            type={availableBalance !== '-' && !availableBalance && isLogin ? 'primary' : 'default'}
            fullWidth
          >
            {_t('transfer.s')}
          </ButtonCls>
        </ButtonGroup>
      )}
    </AssetsWrapper>
  );
};

export default memo(AssetsFutures);
