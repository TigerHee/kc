/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, useCallback } from 'react';
import { BtnWrapper } from '../../style';
import { _t } from 'src/utils/lang';
import { siteCfg } from 'config';
import { useDispatch, useSelector } from 'dva';
import useSensorFunc from '@/hooks/useSensorFunc';
import PrivateButton from '@/components/PrivateButton';
import styled from '@emotion/styled';
// import { commonSensorsFunc } from '@/meta/sensors';

const { KUCOIN_HOST } = siteCfg;

export const Button = styled(PrivateButton)`
  color: ${(props) => (props.type === 'primary' ? undefined : props.theme.colors.text60)};
`;

/**
 * Buttons 资产模块的按钮
 * 包含 充币，借币，还币，划转
 */
const Buttons = (props) => {
  const {
    showRepay = true,
    showDeposit = false,
    showBorrow = true,
    highlightTransfer,
    ...restProps
  } = props;
  const dispatch = useDispatch();
  const currentLang = useSelector((state) => state.app.currentLang);
  const currentSymbol = useSelector((state) => state.trade.currentSymbol);
  const sensorFunc = useSensorFunc();

  const [coin, pair] = currentSymbol.split('-');

  // 充币
  const handleDeposit = () => {
    sensorFunc(['assetDisplayArea', 'deposit']);
    const newWindow = window.open(
      `${KUCOIN_HOST}/assets/coin/${pair || ''}?lang=${currentLang}`,
    );
    newWindow.opener = null;
  };

  // 借币还币
  const openMarginModal = useCallback(
    (modalType, type) => {
      sensorFunc(['assetDisplayArea', type]);

      dispatch({
        type: 'marginMeta/updateMarginModalConfig',
        payload: {
          open: true,
          modalType,
        },
      });
    },
    [sensorFunc],
  );

  const openTransferModal = useCallback(() => {
    sensorFunc(['assetDisplayArea', 'transfer']);

    dispatch({
      type: 'transfer/updateTransferConfig',
      payload: {
        visible: true,
      },
    });
  }, [sensorFunc]);

  return (
    <BtnWrapper {...restProps}>
      {/* 充币 */}
      {showDeposit && (
        <Button type="default" size="small" onClick={handleDeposit}>
          {_t('deposit')}
        </Button>
      )}
      {/* 借币 */}
      {showBorrow && (
        <Button
          type="default"
          size="small"
          onClick={() => openMarginModal(0, 'borrow')}
        >
          {_t('margin.borrow')}
        </Button>
      )}
      {/* 还币 */}
      {showRepay && (
        <Button
          type="default"
          size="small"
          onClick={() => openMarginModal(1, 'repay')}
        >
          {_t('margin.repay')}
        </Button>
      )}
      {/* 划转 */}
      <Button
        type={highlightTransfer ? 'primary' : 'default'}
        size="small"
        onClick={openTransferModal}
      >
        {_t('transfer.s')}
      </Button>
    </BtnWrapper>
  );
};

export default memo(Buttons);
