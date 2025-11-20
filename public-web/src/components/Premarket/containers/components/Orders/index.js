/**
 * Owner: solar.xia@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { ICPlusOutlined } from '@kux/icons';
import { Button, Status, Table, useSnackbar } from '@kux/mui';
import { dateTimeFormat } from '@kux/mui/utils';
import clsx from 'clsx';
import { debounce, indexOf, toLower } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import myOrderFlag from 'static/aptp/my-order-flag.svg';
import { addLangToPath, _t, _tHTML } from 'tools/i18n';
import { trackClick } from 'utils/ga';
import { useActivityStatus, useResponsiveSize } from '../../../hooks';
import { CountDown } from './CountDown';
import {
  StyledActionButtonWrapper,
  StyledActivityEnd,
  StyledButton,
  StyledEmptyText,
  StyledFoldText,
  StyledNotInProcess,
  StyledTable,
} from './styledComponents';

const FIXED_HEIGHT = 110;

function ActionButton({ ownOrder, id, size = 'basic', userSide }) {
  const dispatch = useDispatch();
  const { message } = useSnackbar();
  const btnSize = size === 'sm' ? 'mini' : 'basic';
  if (ownOrder) {
    return (
      <StyledButton
        type="default"
        variant="outlined"
        size={btnSize}
        onClick={() => {
          dispatch({
            type: 'aptp/changeConfirmVisible',
            payload: {
              open: true,
              content: _t('ei2zW7xnajvAQr6ZtKWgez'),
              title: _t('hmMdg7DMuLwHvqys1H1QpT'),
              buttonText: _t('caHePZWPZqASREnyQquAcH'),
              buttonAction: (next) => {
                dispatch({
                  type: 'aptp/cancelGreyMarketOrder',
                  payload: {
                    id,
                  },
                })
                  .then(next)
                  .then(() => {
                    message.success(_t('3n2HoJK55KM2oZjoA9YFzt'));
                  });
              },
            },
          });
        }}
      >
        <div>{_t('aF4x9BVDYhEZAvMrD9ymNK')}</div>
      </StyledButton>
    );
  }
  return (
    <StyledButton
      className={clsx({
        buy: userSide === 'buy',
        sell: userSide === 'sell',
      })}
      size={btnSize}
      onClick={() => {
        // 吃单买入
        if (userSide === 'buy') {
          trackClick(['PreMarketTakerBuy', '1']);
          // 吃单卖出
        } else if (userSide === 'sell') {
          trackClick(['PreMarketTakerSell', '1']);
        }
        dispatch({
          type: 'aptp/openTakeModal',
          payload: {
            id,
          },
        });
      }}
    >
      <div>{userSide === 'buy' ? _t('5Ddkynfshh1yt1bYhsRpVo') : _t('nJ3PPErdms3xMk1b8hHGjH')}</div>
    </StyledButton>
  );
}
function PendingOrder() {
  const { currentLang } = useLocale();
  const dispatch = useDispatch();
  const records = useSelector((state) => state.aptp.records, shallowEqual);
  const deliveryCurrency = useSelector((state) => state.aptp.deliveryCurrency);
  const { offerCurrency } = useSelector((state) => state.aptp.deliveryCurrencyInfo, shallowEqual);
  const isShowRestrictNotice = useSelector((state) => state?.$header_header?.isShowRestrictNotice);
  const { side, sortValue, sortFields, currentPage, pageSize } = useSelector(
    (state) => state.aptp.filter,
    shallowEqual,
  );
  const total = useSelector((state) => state.aptp.totalNum);
  const loading = useSelector((state) => {
    return state.loading.effects['aptp/pullGreyMarketOrders'];
  });
  const [headerHeight, setHeaderHeight] = useState(0);
  const size = useResponsiveSize();
  const { message } = useSnackbar();
  // 对于用户测的buy或sell
  const userSide = useMemo(() => {
    if (side === 'buy') return 'sell';
    if (side === 'sell') return 'buy';
    if (side === 'my') return 'my';
    return 'finished';
  }, [side]);

  const getSortOrder = useCallback(
    (key) => {
      return sortFields === key
        ? {
            ASC: 'ascend',
            DESC: 'descend',
          }[sortValue]
        : null;
    },
    [sortFields, sortValue],
  );

  const handleSortChange = useCallback(
    (key) => {
      const sortKeys = ['ASC', 'DESC', null];
      let _sortValue;
      if (sortFields === key) {
        const index = indexOf(sortKeys, sortValue);
        _sortValue = sortKeys[(index + 1) % 3];
      } else {
        _sortValue = 'ASC';
      }

      dispatch({
        type: 'aptp/updateFilterCondition',
        payload: {
          resetFilter: false,
          triggerSearch: true,
          sortFields: key,
          sortValue: _sortValue,
          side,
        },
      });
    },
    [sortFields, sortValue, dispatch, side],
  );

  const getPledgeAmountHeaderTitle = useCallback(
    (coin) => {
      if (userSide === 'buy') {
        return _t('8Hu4okmBs5MfEtRXuK3L2o', {
          coin,
        });
      } else if (userSide === 'sell') {
        return _t('rXzxCeEgbkj1bpAZorTX1f', {
          coin,
        });
      } else {
        return _t('pv7Uxeuysz5r1Wrgt7PZ5F', {
          coin,
        });
      }
    },
    [userSide],
  );

  // 用户
  const userColumn = useMemo(() => {
    return {
      title: userSide !== 'finished' ? _t('342mURDHeU2d37y9AV5TGx') : _t('entew1cdFQZyFtxX2ghoFD'),
      key: 'userShortName',
      render({ ownOrder, userShortName: sn }) {
        return (
          <div className="user-container">
            <div className="user-flag">{sn}</div>
            {(ownOrder || userSide === 'my') && (
              <div>
                <img src={myOrderFlag} alt="myOrder" className="my-order-flag" />
              </div>
            )}
          </div>
        );
      },
    };
  }, [userSide]);

  const sideColumn = useMemo(() => {
    return {
      title: _t('side', {
        coin: offerCurrency,
      }),
      dataIndex: 'side',
      key: 'side',
      render(v) {
        const _v = toLower(v) === 'sell' ? 'buy' : 'sell';
        // buy sell 是反着的
        return (
          <div className={`${toLower(_v)}-price`}>
            {toLower(v) === 'sell' ? _t('sell') : _t('buy')}
          </div>
        );
      },
    };
  }, [offerCurrency]);

  // 价格
  const priceColumn = useMemo(() => {
    return {
      title: _t('1AhBdji3feG1etpm9mbsbB', {
        coin: offerCurrency,
      }),
      dataIndex: 'price',
      key: 'price',
      sorter(a, b) {
        return a - b;
      },
      sortOrder: getSortOrder('price'),
      render(price) {
        return <div className={`${side}-price`}>{price}</div>;
      },
    };
  }, [getSortOrder, offerCurrency, side]);

  const sizeAndFunds = useMemo(() => {
    return [
      {
        title: _t('onN8Ngma1zNALyN6dvDWDh', {
          coin: deliveryCurrency,
        }),
        dataIndex: 'size',
        key: 'size',
        sorter(a, b) {
          return a - b;
        },
        sortOrder: getSortOrder('size'),
      },
      {
        title: _t('ryTfqggyqrQwRTB6UxaJfi', {
          coin: offerCurrency,
        }),
        dataIndex: 'funds',
        key: 'funds',
        sorter(a, b) {
          return a - b;
        },
        sortOrder: getSortOrder('funds'),
      },
    ];
  }, [getSortOrder, offerCurrency, deliveryCurrency]);

  // 成交时间
  const dealTimeColumn = useMemo(() => {
    return {
      title: _t('aKFGh4GoiPpzG7mATFbvik'),
      dataIndex: 'dealTime',
      key: 'dealTime',
      align: 'right',
      render(time) {
        if (size === 'md') {
          return (
            <StyledFoldText>
              <span>
                {dateTimeFormat({ date: +time, lang: currentLang, options: { timeZone: 'UTC' } })}
              </span>
            </StyledFoldText>
          );
        } else if (size === 'lg') {
          return (
            <>{dateTimeFormat({ date: +time, lang: currentLang, options: { timeZone: 'UTC' } })}</>
          );
        }
      },
    };
  }, [size, currentLang]);

  const statusColumn = useMemo(() => {
    return {
      title: _t('status'),
      key: 'displayStatus',
      dataIndex: 'displayStatus',
      align: 'right',
      render(v, { id }) {
        if (v === 'NEW') {
          return <ActionButton id={id} ownOrder={true} />;
        } else if (v === 'MATCHED') {
          return _t('98qTVNe9sSS9hnxJezTPtF');
        } else {
          return '--';
        }
      },
    };
  }, []);

  // 操作
  const actionColumn = useMemo(() => {
    return {
      title: _t('8U2jhXJewEoNzpJF32592j'),
      key: 'action',
      align: 'right',
      render({ id, ownOrder }) {
        return (
          <StyledActionButtonWrapper>
            <ActionButton id={id} ownOrder={ownOrder} userSide={userSide} />
          </StyledActionButtonWrapper>
        );
      },
    };
  }, [userSide]);

  const commonColumns = useMemo(() => {
    if (userSide === 'finished') {
      return [userColumn, priceColumn, ...sizeAndFunds, dealTimeColumn];
    } else if (userSide === 'my') {
      return [sideColumn, priceColumn, ...sizeAndFunds, statusColumn];
    } else {
      return [userColumn, priceColumn, ...sizeAndFunds, actionColumn];
    }
  }, [
    userSide,
    userColumn,
    priceColumn,
    sideColumn,
    sizeAndFunds,
    dealTimeColumn,
    statusColumn,
    actionColumn,
  ]);

  const smColumn = [
    {
      key: 'main',
      render({ ownOrder, id, price, size, funds, pledgeAmount, dealTime, displayStatus, side }) {
        let statusComp;
        if (userSide === 'finished') {
          statusComp = (
            <div className="deal-time">
              {dateTimeFormat({ date: +dealTime, lang: currentLang, options: { timeZone: 'UTC' } })}
            </div>
          );
        } else if (userSide === 'my') {
          statusComp =
            displayStatus === 'NEW' ? (
              <div className="action">
                <ActionButton id={id} ownOrder={true} size={'sm'} />
              </div>
            ) : (
              <div className="deal-time">
                {displayStatus === 'MATCHED' ? _t('98qTVNe9sSS9hnxJezTPtF') : '--'}
              </div>
            );
        } else {
          statusComp = (
            <div className="action">
              <ActionButton id={id} ownOrder={ownOrder} size={'sm'} userSide={userSide} />
            </div>
          );
        }

        const _side = toLower(side);

        return (
          <div className="main-column">
            <div className="main-header">
              <div className="left-header">
                <div className="price-label">
                  {_t('1AhBdji3feG1etpm9mbsbB', {
                    coin: offerCurrency,
                  })}
                </div>
                <div className={`price-value ${toLower(userSide)}`}>{price}</div>
              </div>
              {statusComp}
            </div>

            <div className="main-content">
              {userSide === 'my' && (
                <>
                  <div className="label">
                    <span>{_t('side')}</span>
                  </div>
                  <div className="value">
                    <span className={`side-value ${_side}`}>
                      {_side === 'sell' ? _t('sell') : _t('buy')}
                    </span>
                  </div>
                </>
              )}
              <div className="label">
                <span>
                  {_t('onN8Ngma1zNALyN6dvDWDh', {
                    coin: deliveryCurrency,
                  })}
                </span>
              </div>
              <div className="value">{size}</div>
              <div className="label">
                <span>
                  {_t('ryTfqggyqrQwRTB6UxaJfi', {
                    coin: offerCurrency,
                  })}
                </span>
              </div>
              <div className="value">{funds}</div>
              {userSide !== 'finished' && (
                <>
                  <div className="label">
                    <span>{getPledgeAmountHeaderTitle(offerCurrency)}</span>
                  </div>
                  <div className="value">{pledgeAmount}</div>
                </>
              )}
            </div>
          </div>
        );
      },
    },
  ];
  const columns = size === 'sm' ? smColumn : commonColumns;
  function handleChange(pagination, filters, sorter) {
    const sortValue = {
      ascend: 'ASC',
      descend: 'DESC',
    }[sorter?.order];

    const sortFields = sortValue ? sorter?.field : null;
    dispatch({
      type: 'aptp/updateFilterCondition',
      payload: {
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
        sortFields,
        sortValue,
        triggerSearch: true,
      },
    });
  }
  const handleResize = useCallback(
    debounce(() => {
      let { height } = document
        .getElementsByClassName('gbiz-headeroom')?.[0]
        ?.getBoundingClientRect?.() ?? { height: 0 };
      if (height !== headerHeight) {
        setHeaderHeight(height);
      }
    }, 1000),
    [headerHeight],
  );

  useEffect(() => {
    handleResize();
  }, [handleResize, isShowRestrictNotice]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);
  return (
    <StyledTable>
      <Table
        className="aptp-table"
        headerBorder={true}
        size={'basic'}
        dataSource={records}
        columns={columns}
        rowKey="id"
        bordered={true}
        showHeader={size !== 'sm'}
        onChange={handleChange}
        loading={loading}
        pagination={
          total
            ? {
                current: currentPage,
                pageSize,
                total,
                siblingCount: 1,
              }
            : null
        }
        locale={{
          emptyText: (
            <>
              <StyledEmptyText>
                <span>{_t('cLVT36jYLG6F7EYwXY7rxG')}</span>
              </StyledEmptyText>
              {/* 只在买卖tab展示创建订单按钮 */}
              {records.length === 0 && (side === 'sell' || side === 'buy') && (
                <div className="empty-container">
                  <Button
                    className="create-order"
                    variant="outlined"
                    onClick={() => {
                      dispatch({
                        type: 'aptp/openPostModal',
                        payload: {
                          side: side === 'buy' ? 'sell' : 'buy',
                        },
                      });
                    }}
                    type="default"
                    startIcon={<ICPlusOutlined size="16" />}
                  >
                    {_t('e1ypdPpUZx9nrAGMGKVW24')}
                  </Button>
                </div>
              )}
            </>
          ),
        }}
      />
    </StyledTable>
  );
}
function ActivityEnd({ deliveryTime }) {
  return (
    <StyledActivityEnd>
      {deliveryTime ? (
        <div className="delivery-body">
          <span>{_t('80b2cd51a04d4000a62d')}</span>
          <CountDown date={deliveryTime * 1000 || 0} />
        </div>
      ) : (
        <Status name="loading" />
      )}
      <div className="delivery-foot">
        <div>{_t('5300026cf6504000a4fc')}</div>
        <div>{_tHTML('bf41e61e49fe4000aa5f', { link: addLangToPath('/pre-market/myOrder') })}</div>
      </div>
    </StyledActivityEnd>
  );
}

function DeliveryEnd() {
  return (
    <StyledNotInProcess>
      <Status name="success" />
      <span>{_tHTML('8178660a3abe4000acca', { link: addLangToPath('/pre-market/myOrder') })}</span>
    </StyledNotInProcess>
  );
}

function ActivityNotStarted({ tradeStartAt }) {
  return (
    <StyledNotInProcess>
      <Status name="loading" />
      <span>{_t('f8acf2ddcc574000a89f')}</span>
      <CountDown date={tradeStartAt * 1000 || 0} />
    </StyledNotInProcess>
  );
}
export default function Orders() {
  const activityStatus = useActivityStatus();
  const { tradeStartAt, tradeEndAt, deliveryTime } = useSelector(
    (state) => state.aptp.deliveryCurrencyInfo,
  );
  return (
    <>
      {activityStatus === 0 && <ActivityNotStarted tradeStartAt={tradeStartAt} />}
      {activityStatus === 1 && <PendingOrder />}
      {activityStatus === 2 && <ActivityEnd deliveryTime={deliveryTime} />}
      {activityStatus === 3 && <DeliveryEnd />}
    </>
  );
}
