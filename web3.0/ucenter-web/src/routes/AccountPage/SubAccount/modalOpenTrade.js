/**
 * Owner: tiger@kupotech.com
 * 开通交易
 */
import styled from '@emotion/styled';
import { Checkbox, Dialog, useSnackbar } from '@kux/mui';
import classnames from 'classnames';
import { useState } from 'react';
import { openSubTrade } from 'services/account';
import { _t } from 'tools/i18n';
import { FUTURE_AGREEMENT, MARGIN_AGREEMENT } from './agreement';
import { TRADE_TYPE_FUTURE, TRADE_TYPE_MARGIN } from './config';

const Main = styled.div`
  .KuxCheckbox-group {
    display: flex;
    justify-content: space-between;
    .KuxCheckbox-wrapper {
      display: flex;
      flex: 1;
      align-items: center;
      &:nth-child(2) {
        margin-left: 12px;
      }
      .KuxCheckbox-checkbox {
        top: 0;
      }
    }
  }
`;
const TradeAgreementBox = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  div {
    margin-bottom: 6px;
  }
`;
const TradeAgreementItem = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.colors.cover2};
  border: 0.5px solid ${({ theme }) => theme.colors.divider8};
  border-radius: 12px;
  font-weight: 400;
  font-size: 12px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text30};
  height: 230px;
  max-height: 230px;
  &:nth-child(2) {
    margin-left: 12px;
  }
  &.heightAuto {
    height: fit-content;
  }
  &::-webkit-scrollbar {
    width: 8px;
    background-color: ${({ theme }) => theme.colors.background};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.icon40};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: ${({ theme }) => theme.colors.background};
    border-radius: 4px;
  }
`;
const TradeOption = styled.div``;

export default ({ open, onCancel, curItem, dispatchWrapper }) => {
  const { openedTradeTypes = [] } = curItem;
  const { message } = useSnackbar();
  const [tradeType, setTradeType] = useState(openedTradeTypes);
  // ok按钮loading
  const [isConfirmLoading, setConfirmLoading] = useState(false);

  const tradeOptions = [
    {
      label: <TradeOption>{_t('pqPAVnph8dBRksv2sLAyte')}</TradeOption>,
      value: TRADE_TYPE_MARGIN,
      agreement: (
        <>
          {MARGIN_AGREEMENT.map((i) => (
            <div key={i}>{i}</div>
          ))}
        </>
      ),
      hide: openedTradeTypes.includes(TRADE_TYPE_MARGIN),
    },
    {
      label: <TradeOption>{_t('vJKKPUP1hn11P4p8MhG7dM')}</TradeOption>,
      value: TRADE_TYPE_FUTURE,
      agreement: FUTURE_AGREEMENT,
      hide: openedTradeTypes.includes(TRADE_TYPE_FUTURE),
    },
  ].filter((i) => !i.hide);

  const onSubmit = () => {
    setConfirmLoading(true);
    openSubTrade({
      subUid: curItem?.uid,
      openMargin: tradeType.includes(TRADE_TYPE_MARGIN),
      openFutures: tradeType.includes(TRADE_TYPE_FUTURE),
      riskVersion: 1.0,
      userVersion: 1.0,
    })
      .then((res) => {
        if (res?.success) {
          message.success(_t('convert.order.status.success'));
          dispatchWrapper('getAccountList', {
            refreshAmount: true,
          });
          onCancel();
        }
      })
      .catch((err) => {
        err?.msg && message.error(err?.msg);
        onCancel();
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  };

  return (
    <Dialog
      open={open}
      onCancel={onCancel}
      style={{ margin: 24 }}
      title={_t('w9MYXUzReNi4CoxQ6jck4N')}
      cancelText={null}
      okText={_t('save')}
      onOk={onSubmit}
      okButtonProps={{
        loading: isConfirmLoading,
      }}
    >
      <Main>
        <TradeAgreementBox>
          {tradeOptions.map((i) => (
            <TradeAgreementItem
              className={classnames({
                heightAuto: tradeOptions.length === 1,
              })}
              key={i.value}
            >
              {i.agreement}
            </TradeAgreementItem>
          ))}
        </TradeAgreementBox>

        <Checkbox.Group value={tradeType} onChange={setTradeType} options={tradeOptions} />
      </Main>
    </Dialog>
  );
};
