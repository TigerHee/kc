/**
 * Owner: solar.xia@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import {
  ICArrowDownOutlined,
  ICArrowUpOutlined,
  ICWaitOutlined,
  ICWarningOutlined,
} from '@kux/icons';
import {
  Button,
  Col,
  Divider,
  EmotionCacheProvider,
  Row,
  Select,
  Table,
  ThemeProvider,
  useResponsive,
  useSnackbar,
  useTheme,
} from '@kux/mui';
import { dateTimeFormat } from '@kux/mui/utils';
import clns from 'clsx';
import { formatNumber } from 'helper';
import isUndefined from 'lodash/isUndefined';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ApplyCancelModal from 'src/components/Premarket/containers/CancelModal/ApplyCancel';
import ReviewCancelModal from 'src/components/Premarket/containers/CancelModal/ReviewCancel';
import Confirm from 'src/components/Premarket/containers/Confirm';
import Footer from 'src/components/Premarket/containers/Footer';
import AppHeader from 'src/components/Premarket/containers/Header';
import ToolTipContent from 'src/components/Premarket/containers/TradeModal/ToolTipContent';
import { useSelector } from 'src/hooks/useSelector';
import { saTrackForBiz, trackClick } from 'src/utils/ga';
import backArrowRight from 'static/aptp/back-arrow-right.svg';
import { _t } from 'tools/i18n';
import {
  StyledApplyCancelActionRecord,
  StyledApplyCancelActionRecordList,
  StyledApplyCancelStatusWrapper,
  StyledAptpMyOrder,
  StyledCondition,
  StyledFoldColumn,
  StyledHeader,
  StyledPlaceholderWrapper,
  StyledTable,
  StyledTabs,
  StyledXsTableCol,
} from './styledComponents';

const statusOptions = [
  {
    // 未成交
    // label: _t('5Ddkynfshh1yt1bYhsRpVo'),
    label: _t('wTgHEgAn9RBQDLbNCro7o8'),
    value: 'NEW',
    suportTabIndex: [0],
  },
  {
    // 已成交
    label: _t('98qTVNe9sSS9hnxJezTPtF'),
    value: 'MATCHED',
    suportTabIndex: [0],
  },
  {
    // 未交割，违约
    label: _t('f4arwn1ZdPfsjZZdD1bsed'),
    value: 'BREAK_CONTRACT',
    suportTabIndex: [1],
  },
  {
    // 已交割
    label: _t('wCFskMBdDf9bJyrTWzJxX8'),
    value: 'DELIVERED',
    suportTabIndex: [1],
  },
  {
    // 取消（用户取消、交割取消管理员取消
    label: _t('eJTGv9MwcZuL4gsMt9TcwL'),
    value: 'CANCELED',
    suportTabIndex: [1],
  },
];

const ApplyCancelStatus = {
  PENDING: 'PENDING',
  AGREE: 'AGREE',
  REJECT: 'REJECT',
};

const ApplyCancelConfig = {
  [ApplyCancelStatus.PENDING]: {
    getSelfSummary: () => _t('b95a178d35044000ac74'),
    getCounterpartSummary: () => _t('601ac7eddac44000ae5b'),
    getSelfDetail: (rate) => _t('f2fb97a7db1c4000a73f', { percent: `${rate}%` }),
    getCounterpartDetail: (rate) => _t('d93e70f797d04000a306', { percent: `${rate}%` }),
    getStatusIconComp: () => ICWaitOutlined,
    getSelfStatusText: () => _t('d8121c2f33834000ab43'),
    getCounterpartStatusText: () => _t('d8121c2f33834000ab43'),
  },
  [ApplyCancelStatus.REJECT]: {
    getSelfSummary: () => '',
    getCounterpartSummary: () => _t('84a605be2a634000a396'),
    getSelfDetail: (rate) => _t('29f81da7c8fb4000a102'),
    getCounterpartDetail: (rate) => _t('9b6ae4b8ef584000a164'),
    getStatusIconComp: () => ICWarningOutlined,

    getSelfStatusText: () => _t('8e4d9ed243334000a5c1'),
    getCounterpartStatusText: () => _t('6dffe28700d74000a72c'),
  },
  [ApplyCancelStatus.AGREE]: {
    getSelfSummary: () => '',
    getCounterpartSummary: () => _t('84a605be2a634000a396'),
    getSelfDetail: (rate) => _t('daff689b681e4000a7cf'),
    getCounterpartDetail: (rate) => _t('4f303a25418f4000a655'),
    getStatusIconComp: () => null,
    getSelfStatusText: () => '',
    getCounterpartStatusText: () => '',
  },
};

function Header() {
  const history = useHistory();
  const isInApp = JsBridge.isApp();
  if (isInApp) {
    return <AppHeader showMyOrder={false}>{_t('hkh1Ezk6muufQVCTAaiiRH')}</AppHeader>;
  }

  return (
    <StyledHeader>
      <div className="left">{_t('p2oTgByxdzWA9H6cob7umF')}</div>
      <div
        className="right"
        onClick={() => {
          history.goBack();
        }}
        role="button"
        tabIndex="0"
      >
        <span>{_t('89STwra9PE9jbuNVg1aYAR')}</span>
        <img src={backArrowRight} alt="" />
      </div>
    </StyledHeader>
  );
}
function Tabs() {
  const myOrderActivedTotalNum = useSelector((state) => state.aptp.myOrderActivedTotalNum);
  // isActive的状态
  const filterStatus = useSelector((state) => state.aptp.myOrderFilter.isActive) ? 0 : 1;
  const dispatch = useDispatch();

  return (
    <StyledTabs data-inspector="inspector_premarket_myorder_tabs">
      {[
        {
          text: `${_t('jipxcFHLhv4WSp7rwqLpZf', {
            num: myOrderActivedTotalNum,
          })}`,
          key: 0,
        },
        { text: _t('eijTVtcREYXCoQuHC8xeEa'), key: 1 },
      ].map(({ text, key }) => (
        <div
          key={key}
          role="button"
          tabIndex="0"
          onClick={() => {
            dispatch({
              type: 'aptp/updateMyOrderFilterCondition',
              payload: {
                isActive: key === 0,
                currentPage: 1,
                isReset: true,
                triggerSearch: true,
              },
            });
            // 进行中
            if (key === 0) {
              trackClick(['MyOrder', 'progress']);
              // 已完成
            } else {
              trackClick(['MyOrder', 'completed']);
            }
          }}
          className={filterStatus === key ? 'actived' : undefined}
        >
          {text}
        </div>
      ))}
    </StyledTabs>
  );
}
function Side({ side, className = '' }) {
  return side === 'BUY' ? (
    <div className={clns('buy', 'side', className)}>{_t('5Ddkynfshh1yt1bYhsRpVo')}</div>
  ) : (
    <div className={clns('sell', 'side', className)}>{_t('nJ3PPErdms3xMk1b8hHGjH')}</div>
  );
}
function Condition() {
  const deliveryCurrencyList = useSelector((state) => state.aptp.deliveryCurrencyList);
  const baseCurrency = useSelector((state) => state.aptp.myOrderFilter.baseCurrency);
  const side = useSelector((state) => state.aptp.myOrderFilter.side);
  const displayStatus = useSelector((state) => state.aptp.myOrderFilter.displayStatus);
  // isActive的状态
  const filterStatus = useSelector((state) => state.aptp.myOrderFilter.isActive) ? 0 : 1;
  const pairOptions = useMemo(() => {
    return deliveryCurrencyList.map((coin) => ({
      label: coin.shortName,
      value: coin.shortName,
    }));
  }, [deliveryCurrencyList]);
  useEffect(() => {
    dispatch({
      type: 'aptp/pullAllCurrencies',
    });
  }, [dispatch]);
  const sideOptions = [
    {
      // 买
      label: _t('5Ddkynfshh1yt1bYhsRpVo'),
      value: 'buy',
    },
    {
      // 卖
      label: _t('nJ3PPErdms3xMk1b8hHGjH'),
      value: 'sell',
    },
  ];

  const dispatch = useDispatch();
  const _statusOptions = useMemo(() => {
    return statusOptions.filter((item) => item.suportTabIndex.includes(filterStatus));
  }, [filterStatus]);
  const generateHandler = (key) => (val) => {
    dispatch({
      type: 'aptp/updateMyOrderFilterCondition',
      payload: {
        [key]: val,
        currentPage: 1,
        triggerSearch: true,
      },
    });
  };

  useEffect(() => {
    return () => {
      dispatch({
        type: 'aptp/resetMyOrderFilter',
      });
    };
  }, [dispatch]);

  return (
    <StyledCondition data-inspector="inspector_premarket_myorder_condition">
      <Row gutter={[16, 16]}>
        <Col xs={{ span: 12 }} sm={{ span: 6 }} lg={{ span: 4 }}>
          <Select
            className="select-item"
            placeholder={_t('r5Vd6cLdkZfnpBbFt1aNk8')}
            options={pairOptions}
            value={baseCurrency}
            onChange={generateHandler('baseCurrency')}
            allowClear
          />
        </Col>
        <Col xs={{ span: 12 }} sm={{ span: 6 }} lg={{ span: 4 }}>
          <Select
            className="select-item"
            placeholder={_t('h5L97UJWmhKgnGmiQvwysv')}
            options={sideOptions}
            value={side}
            onChange={generateHandler('side')}
            allowClear
          />
        </Col>
        <Col xs={{ span: 12 }} sm={{ span: 6 }} lg={{ span: 4 }}>
          <Select
            className="select-item"
            placeholder={_t('6CmC4SLBKNUswdc3wUjNjo')}
            options={_statusOptions}
            value={displayStatus}
            onChange={generateHandler('displayStatus')}
            allowClear
          />
        </Col>
      </Row>
    </StyledCondition>
  );
}

function Currency({ value, currency }) {
  return (
    <>
      <span className="value">{`${value} `}</span>
      <span className="currency">{currency}</span>
    </>
  );
}
function formatTime(time, currentLang, isMs) {
  return time
    ? `${dateTimeFormat({
        date: isMs ? time : time * 1000,
        lang: currentLang,
        options: { timeZone: 'UTC', second: undefined },
      })}${_t('wMm9D9jK8iibsKRZrPbiQ8')}`
    : '--';
  // return time
  //   ? moment(time * 1000)
  //       .clone()
  //       .utc()
  //       .format('YYYY.MM.DD HH:mm') +
  //   : '--';
}
function Liquidity({ liquidity }) {
  return liquidity === 'MAKER' ? _t('81a54BS61d9s6GPde1wPNY') : _t('jiwkuLeLpHwB47Hzgh8d8C');
}
function getStatusLabel(displayStatus) {
  return statusOptions.find((item) => item.value === displayStatus)?.label;
}

function XsTableCol({ record, currentLang, handleApplyCancel, handleCancel, isActive, size }) {
  const {
    deliveryCurrency,
    offerCurrency,
    createdAt,
    side,
    price,
    pledgeAmount,
    liquidity,
    displayStatus,
    id,
    tax,
    breakApplyList = [],
    breakApplySwitch,
  } = record;

  const canApplyCancel =
    breakApplyList.length === 0 ||
    (breakApplyList[0].opType === ApplyCancelStatus.REJECT &&
      breakApplyList.filter((one) => one.opType === ApplyCancelStatus.PENDING && one.selfApply)
        .length < 3);
  const disabled = !(displayStatus === 'NEW' || (displayStatus === 'MATCHED' && canApplyCancel));
  return (
    <StyledXsTableCol>
      <header>
        <div className="left">
          <div className="currencyPair">
            {deliveryCurrency}/{offerCurrency}
          </div>
          <div className="time">{formatTime(createdAt, currentLang)}</div>
        </div>
        {/* 进行中的展示取消按钮 */}
        {isActive && (
          <div
            className={clns('right', 'actived', { disabled })}
            role="button"
            tabIndex={0}
            onClick={() => {
              if (disabled) return;
              if (displayStatus !== 'MATCHED') {
                handleCancel(id)();
              } else if (breakApplySwitch) {
                handleApplyCancel(record)();
              }
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '14px' }}>
                {displayStatus !== 'MATCHED'
                  ? _t('aF4x9BVDYhEZAvMrD9ymNK')
                  : breakApplySwitch
                  ? _t('063e2db609a04000a535')
                  : null}
              </span>
              {breakApplySwitch && <TableActionStatus actionRecord={breakApplyList[0]} />}
            </div>
          </div>
        )}
        {!isActive && (
          <div className={clns('right')}>
            <span>{getStatusLabel(displayStatus)}</span>
          </div>
        )}
      </header>
      {breakApplySwitch && (
        <ApplyCancelActionRecordList
          list={record.breakApplyList || []}
          orderRecord={record}
          size={size}
          currentLang={currentLang}
          isActive={isActive}
        />
      )}

      <main>
        <div className="row">
          <div className="col">{_t('h5L97UJWmhKgnGmiQvwysv')}</div>
          <div className="col">
            <Side side={side} />
          </div>
        </div>
        <div className="row">
          <div className="col">{_t('7zuFtuHz7PrjTtq8rUw8Sh')}</div>
          <div className="col">
            <Liquidity liquidity={liquidity} />
          </div>
        </div>
        <div className="row">
          <div className="col">{_t('qidVjpf13KYd5L8hNg1dHT')}</div>
          <div className="col">
            <Currency value={formatNumber(price)} currency={offerCurrency} />
          </div>
        </div>
        <div className="row">
          <div className="col">{_t('1mDf2TmQsjAKqqUoKnVe4G')}</div>

          <div className="col">
            <Currency value={formatNumber(record.size)} currency={deliveryCurrency} />
          </div>
        </div>
        <div className="row">
          <div className="col">
            {isActive ? _t('eg8WtgEkk5nG42SayA5Ny9') : _t('noGaSi6rqLAqLgNyPo4ab8')}
          </div>
          <div className="col">
            {/* <Currency value={formatNumber(pledgeAmount)} currency={offerCurrency} /> */}
            <StyledFoldColumn className="sm">
              <div>
                <Currency value={formatNumber(pledgeAmount)} currency={offerCurrency} />
              </div>
              {/* 仅已完成显示 */}
              {!isActive && +tax ? (
                <div className="taxInfo">
                  <ToolTipContent />
                  <Currency value={formatNumber(tax)} currency={offerCurrency} />
                </div>
              ) : null}
            </StyledFoldColumn>
          </div>
        </div>
        {isActive && (
          <div className="row">
            <div className="col">{_t('6CmC4SLBKNUswdc3wUjNjo')}</div>
            <div className="col">{getStatusLabel(displayStatus)}</div>
          </div>
        )}
      </main>
    </StyledXsTableCol>
  );
}

function ApplyCancelActionRecord({
  actionRecord,
  orderRecord,
  index,
  currentLang,
  size,
  showSummary,
}) {
  const dispatch = useDispatch();
  const showActions =
    index === 0 && actionRecord.opType === ApplyCancelStatus.PENDING && !actionRecord.selfApply;
  const reviewCancel = useCallback(() => {
    dispatch({
      type: 'aptp/openReviewCancelModal',
      payload: {
        record: orderRecord,
        actionRecord,
      },
    });
  }, [actionRecord, dispatch, orderRecord]);
  const conf = ApplyCancelConfig[actionRecord.opType];
  const summary = (actionRecord.selfApply ? conf.getSelfSummary : conf.getCounterpartSummary)();
  const detail = (actionRecord.selfApply ? conf.getSelfDetail : conf.getCounterpartDetail)(
    actionRecord.compensationRate,
  );
  return (
    <StyledApplyCancelActionRecord>
      <div>
        <div className="time">{formatTime(actionRecord.opDate, currentLang, true)}</div>
        <div className="content">
          <span className="summary">{showSummary ? `${summary} ` : ''}</span>
          <span className="detail">{detail}</span>
        </div>
      </div>
      {showActions && (
        <div className="action-buttons">
          <Button
            variant={size === 'xs' ? 'contained' : 'text'}
            size="mini"
            onClick={reviewCancel}
            type={size === 'xs' ? undefined : 'brandGreen'}
          >
            {_t('7867a497c96e4000a760')}
          </Button>
        </div>
      )}
      {/* {hasDivider && <Divider style={{ margin: '12px 0'}} />} */}
    </StyledApplyCancelActionRecord>
  );
}

function ApplyCancelActionRecordList({ list, orderRecord, size, currentLang, isActive }) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const finalList = useMemo(() => {
    if (!list.length) {
      return [];
    }
    if (expanded || list.length < 2) {
      return list;
    } else {
      return list.slice(0, 1);
    }
  }, [expanded, list]);
  // 未处理而进入已完成 不展示
  if (!isActive && list[0]?.opType === ApplyCancelStatus.PENDING) {
    return false;
  }
  if (!finalList.length) {
    return false;
  }
  const ArrowIcon = expanded ? ICArrowUpOutlined : ICArrowDownOutlined;
  const hasExpandButton = list?.length > 1;
  return (
    <StyledApplyCancelActionRecordList hasExpandButton>
      {finalList.map((one, index) => {
        const showSummary =
          (one.selfApply && one.opType === ApplyCancelStatus.PENDING) ||
          (!one.selfApply && (one.opType !== ApplyCancelStatus.PENDING || index === 0));
        return (
          <Fragment key={one.id || index}>
            <ApplyCancelActionRecord
              actionRecord={one}
              orderRecord={orderRecord}
              index={index}
              currentLang={currentLang}
              size={size}
              showSummary={showSummary}
            />
            {expanded && index !== finalList.length - 1 && <Divider style={{ margin: '12px 0' }} />}
          </Fragment>
        );
      })}
      {hasExpandButton && (
        <Button
          className="expand-button"
          endIcon={
            <ArrowIcon
              color={size === 'xs' ? theme.colors.primary : theme.colors.icon}
              size={size === 'xs' ? 12 : 16}
            />
          }
          variant="text"
          size="mini"
          type="brandGreen"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {size !== 'xs' ? '' : expanded ? _t('5QPyaWBbRAw2t3ssNMZGoU') : _t('details')}
        </Button>
      )}
    </StyledApplyCancelActionRecordList>
  );
}

const TableActionStatus = ({ actionRecord }) => {
  if (!actionRecord || actionRecord.opType === ApplyCancelStatus.AGREE) {
    return false;
  }
  const conf = ApplyCancelConfig[actionRecord.opType];
  const summary = (
    actionRecord.selfApply ? conf.getSelfStatusText : conf.getCounterpartStatusText
  )();
  const IconComp = conf.getStatusIconComp();
  return (
    <StyledApplyCancelStatusWrapper
      className={clns({
        pending: actionRecord.opType === ApplyCancelStatus.PENDING,
        reject: actionRecord.opType === ApplyCancelStatus.REJECT,
      })}
    >
      {summary && <span className="summary">{summary}</span>} {IconComp && <IconComp size={14} />}
    </StyledApplyCancelStatusWrapper>
  );
};

function OrderTable() {
  const { currentLang, isRTL } = useLocale();
  const myOrderRecords = useSelector((state) => state.aptp.myOrderRecords);
  const isActive = useSelector((state) => state.aptp.myOrderFilter.isActive);
  const myOrderStatus = useSelector((state) => state.aptp.myOrderStatus);
  const user = useSelector((state) => state.user.user, shallowEqual);
  const filter = useSelector((state) => state.aptp.myOrderFilter);
  const dispatch = useDispatch();
  const { sm, lg } = useResponsive();
  const size = useMemo(() => {
    if (!sm) return 'xs';
    if (lg) return 'lg';
    return 'sm';
  }, [sm, lg]);

  const { message } = useSnackbar();

  useEffect(() => {
    if (user) {
      dispatch({
        type: 'aptp/pullTaxTips',
      });
    }
  }, [dispatch, user]);

  const handleCancel = useCallback(
    (id) => () => {
      dispatch({
        type: 'aptp/changeConfirmVisible',
        payload: {
          open: true,
          content: _t('ei2zW7xnajvAQr6ZtKWgez'),
          title: _t('hmMdg7DMuLwHvqys1H1QpT'),
          buttonText: _t('caHePZWPZqASREnyQquAcH'),
          buttonAction: (next) => {
            dispatch({
              type: 'aptp/cancelMyGreyMarketOrder',
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
    },
    [dispatch, message],
  );

  const handleApplyCancel = useCallback(
    (record) => () => {
      dispatch({
        type: 'aptp/openApplyCancelModal',
        payload: {
          record,
        },
      });
    },
    [dispatch],
  );

  const baseAlign = 'left';
  const _columns = [
    {
      key: 'xsCol',
      responsive: ['xs'],
      render(record) {
        return (
          <XsTableCol
            {...{ record, currentLang, handleApplyCancel, handleCancel, isActive, size }}
          />
        );
      },
    },
    {
      title: _t('mMcSTZmqTcEvkR9j5Y2JTy'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: baseAlign,
      responsive: ['sm', 'lg'],
      render(v) {
        return formatTime(v, currentLang);
      },
    },
    {
      title: _t('rdAH4rWh2u4EnfAnC7fyJc'),
      dataIndex: 'deliveryCurrency',
      key: 'deliveryCurrency',
      // 自定义属性响应属性，用作自己过滤列
      responsive: ['lg'],
      //   render: (currency) => currency,
    },
    {
      title: _t('h5L97UJWmhKgnGmiQvwysv'),
      dataIndex: 'side',
      key: 'side',
      responsive: ['lg'],
      render: (side) => <Side side={side} />,
    },
    {
      title: _t('7zuFtuHz7PrjTtq8rUw8Sh'),
      dataIndex: 'liquidity',
      key: 'liquidity',
      responsive: ['lg'],
      render(liquidity) {
        return <Liquidity liquidity={liquidity} />;
      },
    },
    {
      title: `${_t('r5Vd6cLdkZfnpBbFt1aNk8')}/${_t('h5L97UJWmhKgnGmiQvwysv')}/${_t(
        '7zuFtuHz7PrjTtq8rUw8Sh',
      )}`,
      key: 'pair/side/type',
      responsive: ['sm'],
      render(record) {
        const { deliveryCurrency, side, liquidity } = record;
        return (
          <>
            <span className="mr-6">{deliveryCurrency}</span>
            <Side side={side} />
            <div>{liquidity}</div>
          </>
        );
      },
    },
    {
      title: _t('qidVjpf13KYd5L8hNg1dHT'),
      key: 'orderPrice',
      responsive: ['lg'],
      render(record) {
        const { price, offerCurrency } = record;
        return <Currency value={formatNumber(price)} currency={offerCurrency} />;
      },
    },
    {
      title: _t('1mDf2TmQsjAKqqUoKnVe4G'),
      key: 'amount',
      responsive: ['lg'],
      render(record) {
        const { size, deliveryCurrency } = record;
        return <Currency value={formatNumber(size)} currency={deliveryCurrency} />;
      },
    },
    {
      title: `${_t('qidVjpf13KYd5L8hNg1dHT')}/${_t('1mDf2TmQsjAKqqUoKnVe4G')}`,
      key: 'orderPrice/account',
      responsive: ['sm'],
      render(record) {
        const { price, offerCurrency, size, deliveryCurrency } = record;
        return (
          <>
            <div>
              <Currency value={formatNumber(price)} currency={offerCurrency} />
            </div>
            <div>
              <Currency value={formatNumber(size)} currency={deliveryCurrency} />
            </div>
          </>
        );
      },
    },
    {
      title: isActive ? _t('eg8WtgEkk5nG42SayA5Ny9') : _t('noGaSi6rqLAqLgNyPo4ab8'),
      key: 'frozen',
      responsive: ['lg'],
      render(record) {
        const { pledgeAmount, offerCurrency, tax } = record;
        return (
          <StyledFoldColumn>
            <div>
              <Currency value={formatNumber(pledgeAmount)} currency={offerCurrency} />
            </div>
            {/* 仅已完成显示 */}
            {!isActive && +tax ? (
              <div className="taxInfo">
                <Currency value={formatNumber(tax)} currency={offerCurrency} />
                <ToolTipContent />
              </div>
            ) : null}
          </StyledFoldColumn>
        );
      },
    },
    {
      title: _t('6CmC4SLBKNUswdc3wUjNjo'),
      dataIndex: 'displayStatus',
      key: 'displayStatus',
      responsive: ['lg'],
      render(displayStatus) {
        return getStatusLabel(displayStatus);
      },
    },
  ].concat(
    isActive
      ? [
          {
            title: `${isActive ? _t('eg8WtgEkk5nG42SayA5Ny9') : _t('noGaSi6rqLAqLgNyPo4ab8')}/${_t(
              '6CmC4SLBKNUswdc3wUjNjo',
            )}`,
            key: 'frozen/state',
            responsive: ['sm'],
            render(record) {
              const { pledgeAmount, offerCurrency, displayStatus } = record;
              return (
                <>
                  <div>
                    <Currency value={formatNumber(pledgeAmount)} currency={offerCurrency} />
                  </div>
                  <div>{getStatusLabel(displayStatus)}</div>
                </>
              );
            },
          },
          {
            title: _t('gVbLXpSESY9KDZfEVxuQx7'),
            dataIndex: 'id',
            responsive: ['sm', 'lg'],
            key: 'action',
            render(id, record) {
              const { displayStatus, breakApplyList, breakApplySwitch } = record;
              const canApplyCancel =
                breakApplyList.length === 0 ||
                (breakApplyList[0].opType === ApplyCancelStatus.REJECT &&
                  breakApplyList.filter(
                    (one) => one.opType === ApplyCancelStatus.PENDING && one.selfApply,
                  ).length < 3);
              const disabled = !(
                displayStatus === 'NEW' ||
                (displayStatus === 'MATCHED' && canApplyCancel)
              );

              return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <Button
                    onClick={() => {
                      if (displayStatus !== 'MATCHED') {
                        handleCancel(id)();
                      } else if (breakApplySwitch) {
                        handleApplyCancel(record)();
                      }
                    }}
                    className="cancel-btn"
                    type="brandGreen"
                    variant="text"
                    disabled={disabled}
                  >
                    {displayStatus !== 'MATCHED' ? (
                      _t('aF4x9BVDYhEZAvMrD9ymNK')
                    ) : breakApplySwitch ? (
                      _t('063e2db609a04000a535')
                    ) : (
                      <StyledPlaceholderWrapper>--</StyledPlaceholderWrapper>
                    )}
                  </Button>
                  {breakApplySwitch && <TableActionStatus actionRecord={breakApplyList[0]} />}
                </div>
              );
            },
          },
        ]
      : [
          {
            title: isActive ? _t('eg8WtgEkk5nG42SayA5Ny9') : _t('noGaSi6rqLAqLgNyPo4ab8'),
            key: 'frozen',
            responsive: ['sm'],
            render(__, { pledgeAmount, offerCurrency, tax }) {
              return (
                <StyledFoldColumn>
                  <div>
                    <Currency value={formatNumber(pledgeAmount)} currency={offerCurrency} />
                  </div>
                  {/* 仅已完成显示 */}
                  {!isActive && +tax ? (
                    <div className="taxInfo">
                      <Currency value={formatNumber(tax)} currency={offerCurrency} />
                      <ToolTipContent />
                    </div>
                  ) : null}
                </StyledFoldColumn>
              );
            },
          },
          {
            title: _t('6CmC4SLBKNUswdc3wUjNjo'),
            dataIndex: 'displayStatus',
            key: 'displayStatus',
            responsive: ['sm'],
            render(displayStatus) {
              return getStatusLabel(displayStatus);
            },
          },
        ],
  );
  const columns = _columns
    .filter((col) => {
      if (col.key === 'action' && myOrderStatus === 1) return false;
      if (isUndefined(col.responsive)) return true;
      return col.responsive.includes(size);
    })
    .map((obj, index, { length }) => {
      // 删除responsive以免Table组件错误的使用它
      Reflect.deleteProperty(obj, 'responsive');
      // 除了第一个并且最后一个右对齐
      if (index && index === length - 1) {
        return { ...obj, align: 'right' };
      }
      return obj;
    });
  const loading = useSelector((state) => {
    return state.loading.effects['aptp/pullMineOfGreyMarketOrder'];
  });
  const total = useSelector((state) => state.aptp.myOrderTotalNum);

  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const rowExpandable = useCallback(
    (record) => {
      return (
        record.breakApplySwitch &&
        record.breakApplyList?.length > 0 &&
        !(!isActive && record.breakApplyList?.[0]?.opType === ApplyCancelStatus.PENDING)
      );
    },
    [isActive],
  );

  const hasBreakContract = useMemo(() => {
    if (!myOrderRecords?.length) return false;
    const _list =
      myOrderRecords.filter((one) => one.breakApplySwitch && one.breakApplyList?.length > 0) || [];
    return !!_list.length;
  }, [myOrderRecords]);

  useEffect(() => {
    setExpandedRowKeys(
      myOrderRecords.filter((one) => rowExpandable(one) && isActive).map((one) => one.id),
    );
  }, [isActive, myOrderRecords, rowExpandable]);

  const expandedRowClassName = useCallback((record, index) => {
    return 'nested-row';
  }, []);

  const rowClassName = useCallback(
    (record, index) => {
      let cn = 'parent-row';
      if (expandedRowKeys.includes(record.id)) {
        cn += ' expanded';
      }
      return cn;
    },
    [expandedRowKeys],
  );

  const onExpand = useCallback(function (expanded, record) {
    setExpandedRowKeys((prev) => {
      const set = new Set(prev);
      expanded ? set.add(record.id) : set.delete(record.id);
      return [...set];
    });
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }
    dispatch({
      type: 'aptp/pullMineOfGreyMarketOrder',
    });
  }, [dispatch, user]);

  return (
    <StyledTable data-inspector="inspector_premarket_myorder_table">
      <Table
        loading={loading}
        id="aptp-myorder-table"
        headerBorder={true}
        size={'basic'}
        dataSource={myOrderRecords}
        columns={columns}
        rowKey="id"
        rowClassName={rowClassName}
        bordered={true}
        showHeader={size !== 'xs'}
        onRow={size !== 'xs' ? () => ({ className: 'expanded' }) : undefined}
        expandable={
          size !== 'xs' && hasBreakContract
            ? {
                expandedRowKeys,
                expandedRowClassName,
                rowExpandable,
                onExpand,
                expandedRowRender: (record) => (
                  <ApplyCancelActionRecordList
                    list={record.breakApplyList || []}
                    orderRecord={record}
                    currentLang={currentLang}
                    size={size}
                    isActive={isActive}
                  />
                ),
              }
            : undefined
        }
        locale={{
          emptyText: (
            <>
              <div>
                <span>{_t('cLVT36jYLG6F7EYwXY7rxG')}</span>
              </div>
            </>
          ),
        }}
        pagination={{
          current: filter.currentPage,
          pageSize: filter.pageSize,
          total,
          onChange(_, current, pageSize) {
            dispatch({
              type: 'aptp/updateMyOrderFilterCondition',
              payload: {
                currentPage: current,
                pageSize,
                triggerSearch: true,
              },
            });
          },
        }}
        // locale={{
        //   emptyText: (
        //     <StyledEmptyText>
        //       <span>{_t('cLVT36jYLG6F7EYwXY7rxG')}</span>
        //     </StyledEmptyText>
        //   ),
        // }}
      />
    </StyledTable>
  );
}

export default function AptpMyOrder() {
  const timerRef = useRef();
  const { isRTL } = useLocale();
  const isInApp = JsBridge.isApp();
  const currentTheme = useSelector((state) => state.setting.currentTheme);
  useEffect(() => {
    if (isInApp) {
      JsBridge.open({
        type: 'event',
        params: {
          name: 'updateHeader',
          statusBarIsLightMode: currentTheme !== 'dark', // 状态栏文字颜色为黑色 true为黑色
          statusBarTransparent: true,
          visible: false,
          background: '#121212',
        },
      });
    }
  }, [isInApp, currentTheme]);

  useEffect(() => {
    if (isInApp) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        JsBridge.open({
          type: 'event',
          params: {
            name: 'onPageMount',
            dclTime: window.DCLTIME,
            pageType: window._useSSG ? 'SSG' : 'CSR', //'SSR|SSG|ISR|CSR'
          },
        });
      }, 200);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [isInApp]);

  useEffect(() => {
    // 曝光埋点
    try {
      saTrackForBiz({}, ['MyOrder', '1'], {});
    } catch (error) {}
  }, []);

  return (
    <EmotionCacheProvider isRTL={isRTL}>
      <ThemeProvider theme={currentTheme}>
        <StyledAptpMyOrder>
          <Header />
          <Tabs />
          <Condition />
          <OrderTable />
          <Confirm />
          <Footer />
          <ApplyCancelModal />
          <ReviewCancelModal />
        </StyledAptpMyOrder>
      </ThemeProvider>
    </EmotionCacheProvider>
  );
}
