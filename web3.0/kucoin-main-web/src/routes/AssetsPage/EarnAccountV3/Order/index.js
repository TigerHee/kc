/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import clxs from 'classnames';
import { _t } from 'tools/i18n';
import { Box, styled } from '@kux/mui';
import Filters from 'components/EarnAccountV2/FiltersWrapper';
import DetailTable from './DetailTable';
// import Snackbar from '../Snackbar';
import { message } from 'components/Toast';

const Container = styled.div`
  background: ${({ theme }) => theme.colors.backgroundMajor};
  min-height: 80vh;
  .polWrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 36px 0 40px;
    .secWrapper {
      margin-top: 30px;
      margin-bottom: 24px;
    }
    .titleBox {
      align-items: flex-end;
    }

    .flexBetween {
      display: flex;
      justify-content: space-between;
    }
    .title {
      color: ${({ theme }) => theme.colors.text};
      font-weight: 500;
      font-size: 34px;
      line-height: 40px;
    }
  }
  .numFormat {
    direction: ltr /* rtl:ignore */;
  }
`;

const POLPage = () => {
  // const baseCurrency = useSelector((state) => state.earnAccount.baseCurrency);
  const { records = [], pagination = {} } = useSelector(
    (state) => state['earnAccount-assets'].historyTableInfo,
  );
  const dispatch = useDispatch();
  // Snackbar();
  const getFilterList = useCallback(() => {
    // 获取poolx账户筛选项
    return dispatch({
      type: 'earnAccount-assets/getFilterList',
      payload: {
        scene: 'order_tx',
      },
    });
  }, [dispatch]);

  // 请求详情
  const getAssetsTable = useCallback(
    (payload) => {
      dispatch({
        type: 'earnAccount-assets/getOrderHistory',
        payload: { ...payload },
      });
    },
    [dispatch],
  );

  useEffect(() => {
    // 请求详情
    getFilterList().then((res) => {
      getAssetsTable();
    });
  }, [dispatch, getAssetsTable, getFilterList]);

  const pageChange = useCallback(
    (page) => {
      getAssetsTable({ page: page || 1 });
    },
    [getAssetsTable],
  );

  return (
    <Container>
      <div data-inspector="earn_account_page" className={'polWrapper'}>
        <section
          data-inspector="earn_account_page_title"
          className={clxs('flexBetween', 'secWrapper')}
        >
          <div className={clxs('flexBetween', 'titleBox')}>
            <div className={'title'}>{_t('earn.account.order')}</div>
          </div>
        </section>
        <section data-inspector="earn_account_page_filters" className={'rowWrapper'}>
          <Filters
            dispatchEvent={getAssetsTable}
            filtersParams={{ needBizType: false, needOrderStatus: true }}
          />
        </section>
        <Box data-inspector="earn_account_page_table" mt={24}>
          <Box minWidth={1024}>
            <DetailTable onChange={pageChange} records={records} pagination={pagination} />
          </Box>
        </Box>
      </div>
    </Container>
  );
};

export default POLPage;
