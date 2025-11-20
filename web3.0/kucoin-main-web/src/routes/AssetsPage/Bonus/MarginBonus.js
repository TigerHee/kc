/**
 * Owner: willen@kupotech.com
 */
/*
 * @Author: Borden.Lan
 * @Date: 2021-08-11 14:47:39
 * @Description: 杠杆赠金详情页
 */
import React, { memo, useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import clxs from 'classnames';
import { map } from 'lodash';
import { InfoOutlined } from '@kux/icons';
import { Alert, Tooltip, Spin, Button, Pagination, Dialog } from '@kux/mui';
import { useSnackbar } from '@kux/mui';
import { Dialog as KuxDialog, Breadcrumb } from '@kux/mui';
import { COUPON_CENTER_URL } from 'src/constants';

import { Link } from 'components/Router';
import MarginTradeTipModal from 'components/Margin/KuxMarginMask/MarginTradeTipModal';
import MarginTradeTestModal from 'components/Margin/KuxMarginMask/MarginTradeTestModal';

import Empty from 'components/common/KcEmpty';
import { useLocale } from '@kucoin-base/i18n';
import MarginSensors from 'components/Margin/sensors';
import siteConfig from 'utils/siteConfig';
// import formatUrlWithLang from 'utils/formatUrlWithLang';
import { push } from 'utils/router';
import { _t, addLangToPath } from 'tools/i18n';
import { ga, composeSpmAndSave } from 'utils/ga';
import { showDatetime } from 'helper';
import IsolatedBonusModal from './IsolatedBonusModal';
import { useResponsive, useTheme } from '@kux/mui';
import { styled } from '@kux/mui/emotion';
import cardYellow from 'static/assets/bonus-card-yellow.svg';
import cardGrey from 'static/assets/bonus-card-grey.svg';
import tagCrossCn from 'static/assets/tag_cross_cn.svg';
import tagCrossUs from 'static/assets/tag_cross_us.svg';
import tagCrossUsDark from 'static/assets/tag_cross_us_dark.svg';
import tagCrossCnDark from 'static/assets/tag_cross_cn_dark.svg';

import tagIsolatedCn from 'static/assets/tag_isolated_cn.svg';
import tagIsolatedUS from 'static/assets/tag_isolated_us.svg';
import tagIsolatedCnDark from 'static/assets/tag_isolated_cn_dark.svg';
import tagIsolatedUSDark from 'static/assets/tag_isolated_us_dark.svg';

const MarginBonusDetail = styled.div`
  width: 100%;
  .loansPannel {
    flex-wrap: wrap;
    align-content: baseline;
    justify-content: flex-start;
    min-height: 368px;
  }

  .loan {
    width: 32%;
    height: 160px;
    margin-top: 24px;
    padding: 8px;
    box-shadow: 0px 2px 8px 0px rgba(0, 10, 30, 0.16);
    &:not(:nth-child(3n + 1)) {
      margin-left: 2%;
    }
    ${(props) => props.theme.breakpoints.down('lg')} {
      width: 48.43%;
      &:not(:nth-child(3n + 1)) {
        margin-left: 0px;
      }
      &:not(:nth-child(2n + 1)) {
        margin-left: 3.125%;
      }
    }
    ${(props) => props.theme.breakpoints.down('lg')} {
      padding-right: 24px !important;
    }
    ${(props) => props.theme.breakpoints.down('sm')} {
      width: 100%;
      &:not(:nth-child(3n + 1)) {
        margin-left: 0px;
      }
      &:not(:nth-child(2n + 1)) {
        margin-left: 0px;
      }
    }
    &:not(.disabled) {
      cursor: pointer;
      &:hover {
        .leftBc {
          opacity: 0.9;
        }
      }
    }
  }
  .marginBonus {
    position: relative;
    height: 108px;
    background-color: ${({ theme }) =>
      theme.currentTheme === 'light' ? theme.colors.overlay : theme.colors.cover2};
    &:not(.disabled) {
      cursor: default;
      &:hover {
        .leftBc {
          opacity: 1;
        }
      }
    }
    .tag {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 9;
      width: 48px;
      [dir='rtl'] & {
        transform: scaleX(-1);
      }
    }
    .leftBox {
      height: 108px;
    }
    .text {
      font-size: 12px;
      line-height: 20px;
    }
    .number {
      font-size: 24px;
      line-height: 40px;
    }
  }
  .leftBox {
    position: relative;
    width: 240px;
    height: 140px;
    ${(props) => props.theme.breakpoints.down('sm')} {
      width: 200px;
    }
  }
  .leftBc {
    position: absolute;
    top: 0;
    right: 0px;
    bottom: 0;
    left: 0;
    z-index: 1;
    width: 100%;
  }
  .leftContent {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2;
    padding: 12px 16px;
  }
  .number {
    margin-bottom: 4px;
    color: #ffffff;
    font-weight: 500;
    font-size: 34px;
    line-height: 48px;
  }
  .text {
    color: ${({ theme }) => theme.colors.text};
    font-size: 16px;
    line-height: 24px;
  }
  .rightBox {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    min-width: 100px;
    margin-left: 8px;
    text-align: center;
    border: 1px dashed ${({ theme }) => theme.colors.cover40};
  }
  .currency {
    margin-bottom: 9px;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
    font-size: 20px;
    line-height: 20px;
  }
  .info {
    color: ${({ theme }) => theme.colors.text60};
    font-size: 12px;
    line-height: 17px;
  }
  .status {
    display: inline-block;
    height: 20px;
    margin-top: 8px;
    padding: 0 8px;
    color: #fff;
    font-weight: 500;
    font-size: 12px;
    line-height: 20px;
    line-height: 20px;
    text-align: center;
    background: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
    &.receive {
      color: ${({ theme }) => theme.colors.primary};
      background: ${({ theme }) => theme.colors.primary8};
      cursor: default;
    }
    &.disabled {
      background: ${({ theme }) => theme.colors.cover40};
      cursor: default;
    }
  }
  .alertTilte {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
    font-size: 16px;
  }
  .alertContent {
    position: relative;
    padding-left: 12px;
    color: ${({ theme }) => theme.colors.text40};
    font-size: 14px;
    line-height: 22px;
    &:not(:last-of-type) {
      margin-bottom: 4px;
    }
    &::before {
      position: absolute;
      top: 50%;
      left: 0;
      width: 4px;
      height: 4px;
      margin-top: -2px;
      background: ${({ theme }) => theme.colors.cover40};
      content: ' ';
    }
  }
  .noticeTitle {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
  }
  .noticeContent {
    color: ${({ theme }) => theme.colors.text60};
    font-size: 12px;
    line-height: 20px;
  }
  .emptyBox {
    display: flex;
    justify-content: center;
    width: 100%;
  }
  .emptyContent {
    text-align: center;
  }
  .emptyText {
    margin-bottom: 8px;
    color: ${({ theme }) => theme.colors.text60};
    font-size: 14px;
  }

  .rewards {
    & > div {
      padding-bottom: 24px;
      a {
        color: ${({ theme }) => theme.colors.text60};
      }
    }
  }

  .breadcrumb {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 15px;
    a {
      color: ${({ theme }) => theme.colors.text};
    }
  }

  .pagination {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding-top: 24px;
  }
  .centerH {
    height: 100%;
  }

  .arrowLeft {
    [dir='rtl'] & {
      transform: rotate(180deg) /* rtl:ignore */;
    }
  }
`;

const NewSuccessDialog = styled(Dialog)`
  .successTipTitle {
    margin-bottom: 10px;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
    font-size: 24px;
    line-height: 36px;
  }
  .successTipContent {
    color: ${({ theme }) => theme.colors.text60};
    font-size: 14px;
    line-height: 22px;
    &:last-child {
      margin-bottom: 26px;
    }
  }
`;

const { TRADE_HOST, KUCOIN_HOST } = siteConfig;
const PAGE_SIZE = 9;

const KYCUrl = addLangToPath(`${KUCOIN_HOST}/account/kyc?app_line=KYC&soure=DEFAULT`);

// NOT-RECEIVE || IN-RECEIVE -未领取，RECEIVED -已领取,EXPIRED -已过期，IN-RECYCLE || RECYCLED || GRANT -已结束
const STATUS = {
  1: {
    canReceive: true,
    label: 'marginBonus.status.claim',
    timeText: 'marginBonus.valid.date',
    timeKey: 'receiveExpiredAt',
  },
  2: {
    canReceive: true,
    label: 'marginBonus.status.claim',
    timeText: 'marginBonus.valid.date',
    timeKey: 'receiveExpiredAt',
  },
  3: {
    label: 'marginBonus.status.claimed',
    className: 'receive',
    timeText: 'marginBonus.expiry.date',
    timeKey: 'useExpiredAt',
  },
  4: {
    label: 'marginBonus.status.expired',
    className: 'disabled',
    timeText: 'marginBonus.valid.date',
    timeKey: 'receiveExpiredAt',
  },
  5: {
    label: 'marginBonus.status.used',
    className: 'disabled',
    timeText: 'marginBonus.expiry.date',
    timeKey: 'useExpiredAt',
  },
  6: {
    label: 'marginBonus.status.used',
    className: 'disabled',
    timeText: 'marginBonus.expiry.date',
    timeKey: 'useExpiredAt',
  },
  7: {
    label: 'marginBonus.status.used',
    className: 'disabled',
    timeText: 'marginBonus.expiry.date',
    timeKey: 'useExpiredAt',
  },
};
// 使用说明
const ILLUSTRATION = [
  'marginBonus.Illustration.content1',
  'marginBonus.Illustration.content3',
  'marginBonus.Illustration.content2',
  'dAZNtKV5mcNkdS4x2z3zaP',
];
// 注意事项
const NOTICE = [
  'marginBonus.notice.content1',
  'marginBonus.notice.content2',
  'marginBonus.notice.content3',
];
// 活动的时间格式
const FORMAT = 'YYYY/MM/DD HH:mm';
const plainObj = {};

const getTagSrc = (type, isCN, currentTheme) => {
  const isDarkTheme = currentTheme === 'dark';
  if (type === 'MARGIN') {
    if (isCN) {
      return isDarkTheme ? tagCrossCnDark : tagCrossCn;
    }
    return isDarkTheme ? tagCrossUsDark : tagCrossUs;
  }
  if (isCN) {
    return isDarkTheme ? tagIsolatedCnDark : tagIsolatedCn;
  }
  return isDarkTheme ? tagIsolatedUSDark : tagIsolatedUS;
};

const SuccessModal = (props) => {
  useLocale();
  return (
    <NewSuccessDialog
      okText={_t('marginBonus.claim.linkText')}
      cancelText={_t('i.know')}
      {...props}
    >
      <div className={'successTipContent'}>{_t('marginBonus.claim.successTip1')}</div>
      <div className={'successTipContent'}>{_t('marginBonus.claim.successTip2')}</div>
    </NewSuccessDialog>
  );
};

const KYCModal = (props) => {
  return (
    <KuxDialog
      title={_t('9kBDJ6AYeofctDgJagwTB9')}
      okText={_t('qncPHfZtro7BfcHFVfekUB')}
      cancelText={_t('i.know')}
      {...props}
    >
      {_t('5L66NXrtpatP5CwaPQ9oRW')}
    </KuxDialog>
  );
};

export default memo(() => {
  const { isCN } = useLocale();
  const targetCard = useRef(null);
  const filters = useRef({
    pageSize: PAGE_SIZE,
    currentPage: 1,
  });
  const dispatch = useDispatch();
  const { message } = useSnackbar();
  const theme = useTheme();

  const loading = useSelector(
    (state) =>
      state.loading.effects['bonus/pullMarginBonusList'] ||
      state.loading.effects['marginMeta/pullUserMarginPostion'],
  );

  const user = useSelector((state) => state.user.user);
  const marginBonusList = useSelector((state) => state.bonus.marginBonusList);
  const marginBonusPagination = useSelector((state) => state.bonus.marginBonusPagination);
  const userPosition = useSelector((state) => state.marginMeta.userPosition);
  const [kycModalVisible, setKycModalVisible] = useState(false);

  const isClosedMargin = userPosition && !userPosition?.openFlag;

  const [open, setOpen] = useState(false);
  const [isolatedBonusInfo, setIsolatedBonusInfo] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(plainObj);
  const [agreementModalShow, setAgreementModalShow] = useState(false);
  const [tradeTestVisible, setTradeTestVisible] = useState(false);

  const responsive = useResponsive();

  const queryList = useCallback(
    (currentPage) => {
      if (currentPage) {
        filters.current = {
          ...filters.current,
          currentPage,
        };
      }
      dispatch({
        type: 'bonus/pullMarginBonusList',
        payload: filters.current,
      });
    },
    [dispatch],
  );

  const handleReceive = useCallback(
    (item) => {
      if (!item) {
        item = targetCard.current || {};
      }
      const { status, id, currency, positionType } = item;
      if (!STATUS[status] || !STATUS[status].canReceive) return;
      ga('WebMarginBonusWelfareBarGet');
      MarginSensors(['marginBonus', 'receive']);

      if (isClosedMargin) {
        targetCard.current = item;
        if (user?.isSub) {
          message.info(_t('bca93a8787b24000a4c8'));
        } else {
          setAgreementModalShow(true);
        }
        return;
      }
      if (positionType === 'ISOLATED') {
        setIsolatedBonusInfo({
          id,
          currency,
          open: true,
        });
        return;
      }
      if (confirmLoading[id]) return;
      setConfirmLoading({
        ...confirmLoading,
        [id]: true,
      });
      dispatch({
        type: 'bonus/receiveMarginBonus',
        payload: {
          id,
        },
      })
        .then((res) => {
          if (res && res.success) {
            setOpen(true);
            queryList();
          }
        })
        .catch((e) => {
          // 210023 —领取处理中
          // 210024 —赠金已过期
          // 210025 —当前的状态不能领取
          if (e && [210023, 210024, 210025].includes(+e.code)) {
            queryList();
          }
          // 210028 —KYC 不是 lv3 等级
          if (e && [210028].includes(+e.code)) {
            setKycModalVisible(true);
          }
          targetCard.current = null;
        })
        .finally(() => {
          setConfirmLoading({
            ...confirmLoading,
            [id]: false,
          });
        });
    },
    [isClosedMargin, confirmLoading, queryList, user],
  );

  const agreementConfirm = useCallback(() => {
    dispatch({
      type: 'marginMeta/userSignAgreement',
      disabledOpenLoansModal: true,
    })
      .then(() => {
        setTradeTestVisible(false);
      })
      .catch((err) => {
        if (err.msg) {
          message.error(err.msg);
        }
      });
  }, [dispatch]);

  const handleTipOk = useCallback(() => {
    setAgreementModalShow(false);
    setTradeTestVisible(true);
  }, []);

  const routeToTrade = useCallback((spmIds) => {
    const { positionType, positionTag } = targetCard.current || {};
    const _type = positionType === 'ISOLATED' ? '/isolated' : '/margin';
    const url =
      positionType === 'ISOLATED' && positionTag
        ? `${TRADE_HOST}${_type}/${positionTag}`
        : `${TRADE_HOST}${_type}/BTC-USDT`;
    composeSpmAndSave(url, spmIds);
    push(url);
  }, []);

  const handleOk = useCallback(() => {
    ga('WebMarginBonusWelfareTrade');
    MarginSensors(['marginBonus', 'borrow']);

    routeToTrade(['marginBonus', '4']);
  }, [routeToTrade]);

  const handleCloseIsolatedModal = useCallback(
    (e) => {
      if (e === true) {
        queryList();
      }
      setIsolatedBonusInfo({ ...isolatedBonusInfo, open: false });
    },
    [isolatedBonusInfo],
  );
  const handleCancel = useCallback(() => {
    MarginSensors(['marginBonus', 'iknow']);

    setOpen(false);
  }, []);

  const handleKYCOk = useCallback(() => {
    MarginSensors(['marginBonus', '3']);
    window.location.href = KYCUrl;
  }, []);

  useEffect(() => {
    queryList();
  }, []);

  useEffect(() => {
    if (!userPosition) {
      dispatch({
        type: 'marginMeta/pullUserMarginPostion',
      });
    }
  }, [userPosition]);

  useEffect(() => {
    // 开通杠杆后，已经在未开通时点击过卡片的，继续弹出
    if (!isClosedMargin && targetCard.current) handleReceive();
  }, [isClosedMargin, handleReceive]);

  useEffect(() => {
    // 领取成功后，关闭成功提示弹窗（弹窗中还用到这个值，所以不在领取的回调里重置），重置targetCard
    if (!open) {
      targetCard.current = null;
    }
  }, [open]);

  return (
    <MarginBonusDetail>
      {/* 2024.06.26 melon 调试黑白主题弹窗用的调试代码 后续在07.17版本会删除的 先注释防止后面不知道怎么显示对应弹窗 */}
      {/*
      <Button onClick={() => setIsolatedBonusInfo({ open: true })}>IsolatedBonusModal</Button>
      <Button onClick={() => setAgreementModalShow(true)}>MarginTradeTipModal</Button>
      <Button onClick={() => setOpen(true)}>SuccessModal</Button>
      <Button onClick={() => setTradeTestVisible(true)}>MarginTradeTestModal</Button>
      <Button onClick={() => setKycModalVisible(true)}>KYCModal</Button>
      */}

      <IsolatedBonusModal
        {...isolatedBonusInfo}
        onCancel={handleCloseIsolatedModal}
        onKyc={() => setKycModalVisible(true)}
      />
      <SuccessModal
        open={open}
        title={_t('marginBonus.claim.success')}
        onOk={handleOk}
        onCancel={handleCancel}
      />
      {!!isClosedMargin && (
        <MarginTradeTipModal
          open={agreementModalShow}
          onCancel={() => setAgreementModalShow(false)}
          onOk={handleTipOk}
        />
      )}
      <div className="breadcrumb">
        <Breadcrumb>
          <Breadcrumb.Item key="bonus">
            {/* 我的奖励入口 2024.07.17 */}
            <Link to={COUPON_CENTER_URL}>{_t('eTDTJxStkmMUQt69pX38Mm')}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item key="marginBonus">{_t('marginBonus.title')}</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Alert
        type="success"
        showIcon={false}
        description={
          <React.Fragment>
            <div className={'alertTilte'}>
              {_t('marginBonus.Illustration')}
              <Tooltip
                interactive
                placement="bottom-start"
                classes={{ popper: 'popper' }}
                title={
                  <div>
                    <div className={'noticeTitle'}>{_t('marginBonus.notice')}</div>
                    {map(NOTICE, (item, index) => {
                      return (
                        <div key={index} className={'noticeContent'}>{`${index + 1}. ${_t(
                          item,
                        )}`}</div>
                      );
                    })}
                  </div>
                }
              >
                <span className="flex" style={{ marginLeft: 4 }}>
                  <InfoOutlined size="18" />
                </span>
              </Tooltip>
            </div>
            {map(ILLUSTRATION, (item, index) => {
              return (
                <div key={index} className={'alertContent'}>
                  {_t(item)}
                </div>
              );
            })}
          </React.Fragment>
        }
      />
      <Spin spinning={loading} size="small">
        <div className={clxs('flex', 'loansPannel')}>
          {marginBonusList.length ? (
            map(marginBonusList, (item) => {
              const { id, status, amount, currency, positionType, positionTag } = item || {};
              if (!STATUS[status]) return null;
              const disabled = !STATUS[status].canReceive;
              return (
                <div
                  key={id}
                  className={clxs('flex', 'loan', 'marginBonus', {
                    ['disabled']: disabled,
                  })}
                >
                  <img
                    alt="tag"
                    src={getTagSrc(positionType, isCN, theme.currentTheme)}
                    className={'tag'}
                  />
                  <div className={'leftBox'}>
                    <img alt="leftBc" src={disabled ? cardGrey : cardYellow} className={'leftBc'} />
                    <div className={'leftContent'}>
                      <div className={'text'}>
                        {_t('marginBonus.title')}
                        {positionTag && positionTag !== 'DEFAULT'
                          ? ` - ${positionTag.replace('-', '/')}`
                          : ''}
                      </div>
                      <div className={'number'}>
                        {amount} {currency}
                      </div>
                    </div>
                  </div>
                  <div className={'rightBox'}>
                    <div>
                      <div className={'info'} style={{ marginBottom: 4 }}>
                        {_t(STATUS[status].timeText)}
                      </div>
                      <div className={'info'}>
                        {showDatetime(item[STATUS[status].timeKey], FORMAT)}
                      </div>
                      <Spin spinning={!!confirmLoading[id]}>
                        <div
                          onClick={() => handleReceive(item)}
                          className={clxs('status', {
                            [STATUS[status].className]: !!STATUS[status].className,
                          })}
                        >
                          {_t(STATUS[status].label)}
                        </div>
                      </Spin>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={'emptyBox'}>
              <div className={'emptyContent'}>
                <Empty
                  style={{
                    width: '100%',
                    paddingTop: 120,
                    textAlign: 'center',
                  }}
                />
                <div className={'emptyText'}>{_t('marginBonus.guide')}</div>
                <Button className={'marginBonusBtn'} onClick={() => routeToTrade()}>
                  {_t('marginBonus.goTrade')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Spin>

      {marginBonusPagination?.count > PAGE_SIZE && (
        <div className={'pagination'}>
          <Pagination
            total={marginBonusPagination?.count}
            current={marginBonusPagination?.page + 1}
            pageSize={PAGE_SIZE}
            onChange={(event, target) => queryList(target)}
            simple={!responsive?.sm}
            showJumpQuick
          />
        </div>
      )}

      {tradeTestVisible && (
        <MarginTradeTestModal
          open={tradeTestVisible}
          onCancel={() => setTradeTestVisible(false)}
          onOk={agreementConfirm}
        />
      )}
      <KYCModal
        open={kycModalVisible}
        onCancel={() => setKycModalVisible(false)}
        onOk={handleKYCOk}
      />
    </MarginBonusDetail>
  );
});
