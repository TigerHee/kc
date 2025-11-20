/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, useMemo, useCallback } from 'react';
import Dialog from '@mui/Dialog';
import { useSelector, useDispatch } from 'dva';
import useMarginModel from '@/hooks/useMarginModel';
import CoinCodeToName from '@/components/CoinCodeToName';
import LiabilityRate from '@/components/Margin/PositionStatus/LiabilityRate';
import { displayNumber, floadToPercent } from 'helper';
import { _t } from 'src/utils/lang';
import Table from '@mui/Table';
import styled from '@emotion/styled';
import CoinPrecision from '@/components/CoinPrecision';

const StyledDialog = styled(Dialog)`
  .KuxDialog-content {
    padding: 0 16px;
  }
`;

const Content = styled.div`
  padding: 0 16px;
`;

export const TablePro = styled(Table)`
  th:first-of-type {
    border-radius: 12px 0 0 12px;
  }
  th:nth-last-of-type(2) {
    padding-right: 16px;
    border-radius: 0 12px 12px 0;
  }
  th:last-of-type {
    display: none;
  }
  td {
    padding: 8px 0;
    font-size: 12px;
  }
`;
export const TdTitle = styled.div`
  color: ${(props) => props.theme.colors.text60};
`;

export const TdItem = styled.div`
  color: ${(props) =>
    (props.disabled ? props.theme.colors.text40 : props.theme.colors.text)};
  font-weight: 500;
`;

export const PercentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${(props) => props.theme.colors.divider8};
  border-top: 1px solid ${(props) => props.theme.colors.divider8};
  padding: 8px 0;
`;

export const DescTip = styled.div`
  color: ${(props) => props.theme.colors.text60};
  background-color: ${(props) => props.theme.colors.divider4};
  padding: 12px;
  margin-top: 24px;
`;

export const DescWrapper = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 130%;
`;

export const DescTitle = styled.div`
  margin: 8px 0;
`;

export const DescItem = styled.div`
  position: relative;
  &::before {
    content: '';
    display: inline-block;
    width: 3px;
    height: 3px;
    top: 50%;
    transform: translate(0, -50%);
    background-color: ${(props) => props.theme.colors.text60};
    border-radius: 50%;
    margin-right: 4px;
  }
`;

/**
 * DebtModal
 * 负债率弹窗
 */
const DebtModal = (props) => {
  const dispatch = useDispatch();

  const debtModalVisible = useSelector(
    (state) => state.marginMeta.debtModalVisible,
  );

  const categories = useSelector((state) => state.categories);
  const { totalBalance, totalLiability, coinList, accountConfigs } =
    useMarginModel([
      'totalBalance',
      'totalLiability',
      'coinList',
      'accountConfigs',
    ]);
  const { precision: btcPrecision } = categories.BTC || { precision: 8 };
  const {
    transferableAmountDebtRatio,
    liquidationDebtRatio,
    transferOutMaxDebtRatio,
    flDebtRatio,
  } = accountConfigs || {};

  const displayTotalBalance = useMemo(
    () => displayNumber(totalBalance, btcPrecision),
    [totalBalance, btcPrecision],
  );
  const displayTotalLiability = useMemo(
    () => displayNumber(totalLiability, btcPrecision),
    [totalLiability, btcPrecision],
  );

  const handleCancel = useCallback(() => {
    dispatch({
      type: 'marginMeta/update',
      payload: {
        debtModalVisible: false,
      },
    });
  }, []);

  const columns = [
    {
      title: _t('newAssets.debt.coin'),
      dataIndex: 'currency',
      render: (text) => <TdTitle><CoinCodeToName coin={text} /></TdTitle>,
    },
    {
      title: _t('newAssets.debt.totalBalance'),
      dataIndex: 'totalBalance',
      render: (text, { currency }) => (
        <TdItem disabled={!+text}>
          <CoinPrecision coin={currency} value={text} />
        </TdItem>
      ),
    },
    {
      title: _t('newAssets.debt.debt'),
      dataIndex: 'liability',
      align: 'right',
      render: (text, { currency }) => (
        <TdItem disabled={!+text}>
          <CoinPrecision coin={currency} value={text} />
        </TdItem>
      ),
    },
  ];

  const data = useMemo(() => {
    return [
      ...coinList
        ?.filter((item) => {
          const { totalBalance: total, liability } = item || {};
          return +total || +liability;
        }),
      {
        currency: _t('newAssets.debt.total'),
        totalBalance: displayTotalBalance,
        liability: displayTotalLiability,
      },
    ];
  }, [coinList, displayTotalBalance, displayTotalLiability]);

  return (
    <StyledDialog
      size="medium"
      maskClosable
      open={debtModalVisible}
      title={_t('margin.debt.ratio')}
      onCancel={handleCancel}
      onOk={handleCancel}
      okText={_t('confirm')}
      cancelText={_t('cancel')}
      {...props}
    >
      <TablePro
        dataSource={data}
        columns={columns}
        rowKey="currency"
        headerType={'filled'}
        size="small"
        scroll={{ y: 200 }}
      />
      <Content>
        <PercentWrapper>
          <div>{_t('margin.debt.ratio')}</div>
          <LiabilityRate />
        </PercentWrapper>
        <DescWrapper>
          <DescTitle>{_t('newAssets.debt.warn95')}</DescTitle>
          <DescItem>
            {_t('newAssets.debt.warn96', {
              a: floadToPercent(
                +transferableAmountDebtRatio || +transferOutMaxDebtRatio,
                '',
              ),
            })}
          </DescItem>
          <DescItem>
            {_t('newAssets.debt.warn97', {
              a: floadToPercent(+liquidationDebtRatio || +flDebtRatio, ''),
            })}
          </DescItem>
          <DescTip>{_t('newAssets.debt.warn98')}</DescTip>
        </DescWrapper>
      </Content>
    </StyledDialog>
  );
};

export default memo(DebtModal);
