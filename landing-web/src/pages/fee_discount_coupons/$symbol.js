/**
 * Owner: solar.xia@kupotech.com
 */
import React, { useEffect, useMemo } from 'react';
import { useDispatch } from 'dva';
import {useSelector} from 'hooks';
import Decimal from 'decimal.js/decimal';
import { styled } from '@kufox/mui/emotion';
import moment from 'moment';
import { Helmet } from 'react-helmet';
import { numberFormat } from '@kux/mui/utils';
import './style.less';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';
import { _t } from 'utils/lang';
import { assetUrl } from 'utils/url';
import LinkArrow from 'assets/fee_discount_coupons/link_arrow.svg';
import LightBg from 'assets/fee_discount_coupons/light_coupon_bg.svg';
import DarkBg from 'assets/fee_discount_coupons/dark_coupon_bg.svg';
import LightEmptyBg from 'assets/fee_discount_coupons/coupons_empty_light_bg.svg';
import DarkEmptyBg from 'assets/fee_discount_coupons/coupons_empty_dark_bg.svg';

function formatTime(time) {
  return moment(time).utc().format('DD/MM/YYYY HH:mm');
}
const Page = styled.div`
  font-family: Roboto;
  font-style: normal;
  line-height: 130%;
  padding: 0 16px;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  ${(props) =>
    props.isDark
      ? `
    color: #E1E8F5;
    background-color: #111721;
  `
      : `
    color: #000d1d;
    background-color: #f9f9fa;
  `}
  overflow-x: hidden;
  overflow-y: auto;
  @media (min-width: 1040px) {
    max-width: 375px;
    margin: 0 auto;
    ::-webkit-scrollbar {
      width: 2px;
      height: 2px;
      background: transparent;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(0, 20, 42, 0.2);
      border-radius: 2px;
    }
  }
  button {
    padding: 0;
    color: inherit;
    font: inherit;
    background: none;
    border: none;
    outline: inherit;
    cursor: pointer;
  }
`;

const Header = styled.header`
  font-size: 20px;
  font-weight: 600;
  padding: 24px 0 10px;
`;
const Coupons = styled.div`
  padding: 16px 0 8px;
`;

const Coupon = styled.div`
  height: 150px;
  margin-bottom: 12px;
  display: flex;
  ${(props) =>
    props.isDark
      ? `
      background-image: url(${DarkBg});
  `
      : `
      background-image: url(${LightBg});
  `}
  background-repeat: no-repeat;
  background-size: auto 100%;
  background-position: left center;
`;
const CouponLeft = styled.div`
  width: 98px;
  color: #7780df;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .amount {
    font-weight: 600;
    font-size: 36px;
    line-height: 130%;
    text-align: center;
    word-break: break-all;
    transform: translateX(-5px);
  }
  .currency {
    font-weight: 500;
    font-size: 12px;
    line-height: 130%;
    transform: translateX(-5px);
  }
`;
const singleLineText = `
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
`;

const CouponRight = styled.div`
  flex-grow: 1;
  flex-basis: 0;
  overflow: hidden;
  ${(props) =>
    props.isDark
      ? `
      border: 0.5px solid #353945;
  `
      : `
      border: 0.5px solid #ebeced;
  `}
  background-color: ${(props) => (props.isDark ? '#191e28' : '#fff')};
  border-left: 0;
  padding-left: 10px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  display: block;
  position: relative;

  .coupon-name {
    display: -webkit-box;
    width: 100%;
    max-height: 260%;
    margin-top: 16px;
    overflow: hidden;
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .expire-time {
    margin-top: 4px;
    color: ${(props) => (props.isDark ? 'rgba(225, 232, 245, 0.40)' : 'rgba(0, 13, 29, 0.4)')};
    font-weight: 400;
    font-size: 12px;
    line-height: 130%;
    ${singleLineText}
  }
  .deduct-ratio {
    margin-top: 4px;
    color: ${(props) => (props.isDark ? 'rgba(225, 232, 245, 0.40)' : 'rgba(0, 13, 29, 0.4)')};
    font-weight: 400;
    font-size: 12px;
    line-height: 130%;
    ${singleLineText}
  }
  .type-tag {
    position: absolute;
    bottom: 16px;
    display: inline-block;
    /* margin-top: 18px; */
    padding: 1px 4px;

    font-weight: 500;
    font-size: 12px;
    line-height: 130%;

    border-radius: 2px;
    ${(props) =>
      props.isDark
        ? `
      background-color: #2a2e38;
    color: rgba(225, 232, 245, 0.68);
    border: 0.5px solid rgba(225, 232, 245, 0.12);
  `
        : `
      background-color: rgba(0, 13, 29, 0.04);
    color: rgba(0, 13, 29, 0.68);
    border: 0.5px solid rgba(0, 13, 29, 0.12);
  `}
  }
  button {
    display: block;
  }
  .link {
    margin-top: 14px;
    color: ${(props) => (props.isDark ? 'rgba(225, 232, 245, 0.40)' : 'rgba(0, 13, 29, 0.4)')};
    font-weight: 400;
    font-size: 12px;
    font-style: normal;
    line-height: 130%;
  }
`;
const More = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  color: rgba(0, 13, 29, 1);
  button {
    color: rgba(1, 188, 141, 1);
  }
`;
const Empty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgba(0, 13, 29, 0.4);
  font-size: 14px;
  line-height: 22px;
  font-weight: 500;
  padding-top: 90px;
  img {
    width: 100px;
    height: 100px;
  }
  .empty-text {
    margin-top: 8px;
    color: ${(props) => (props.isDark ? 'rgba(225, 232, 245, 0.4)' : 'rgba(0, 13, 29, 0.4)')};
  }
  .link {
    margin-top: 8px;
    line-height: 18px;
    a {
      color: rgba(1, 188, 141, 1);
    }
  }
`;
function formatPercent(lang, number) {
  const _lang = (lang || window._DEFAULT_LANG_).replace('_', '-');
  const numberFormat = new Intl.NumberFormat(_lang, {
    maximumFractionDigits: 8,
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return numberFormat.format(number);
}

function FeeDiscountCoupons(props) {
  const { match: { params: { symbol } } = {} } = props;
  const isDark = location.href.includes('night=true');
  const dispatch = useDispatch();
  const coupons = useSelector((state) => state.coupon.coupons);
  const currentLang = useSelector((state) => state.app.currentLang);
  const count = useMemo(() => coupons?.length ?? 0, [coupons]);
  const isEmpty = coupons.length === 0;
  useEffect(() => {
    dispatch({
      type: 'coupon/queryUsableCoupon',
      payload: { symbol },
    });
  }, [dispatch, symbol]);
  const couponName = _t('86JnPWgqHWkaXT5c9cmqxr');
  return (
    <Page isDark={isDark} data-inspector="feeDiscount">
      <Helmet>
        <link rel="stylesheet" href={`${assetUrl}/natasha/npm/@kux/font/css.css`} />
      </Helmet>
      <Header>
        {_t('4NruPjtvgdEgdee2ZN37wz')} ({count})
      </Header>
      {isEmpty ? (
        <Empty isDark={isDark}>
          <img src={isDark ? DarkEmptyBg : LightEmptyBg} alt="" />
          <div className="empty-text">{_t('5N5UDnujMwy47MFRMbURuA')}</div>
          {/* <div className="link">
            Let’s head to the <a href="#">Rewards Hub</a>
          </div> */}
        </Empty>
      ) : (
        <Coupons>
          {coupons.map((item, index) => (
            <Coupon key={index} isDark={isDark}>
              <CouponLeft className="couponLeft">
                <div className="amount">
                  {Decimal(item.available || 0)
                    .toDecimalPlaces(2, 1)
                    .toString()}
                </div>
                <div className="currency">{item.currency}</div>
              </CouponLeft>
              <CouponRight isDark={isDark}>
                <div className="coupon-name">{couponName}</div>
                <div className="expire-time">
                  {_t('rpsfT1zHFENQ2SeJczTvY2', {
                    time: `${formatTime(item.expireTime)} (UTC)`,
                  })}
                </div>
                <div className="deduct-ratio">
                  {_t('4SR5HC84KrZUrYqgKfwWy4', {
                    num: item.deductRatio * 100,
                  })}
                </div>
                <div className="type-tag">{_t('eQdoxSGznG64jnfH7AvAn8')}</div>
                {/* <button
                  className="link"
                  onClick={() => {
                    console.log('dianji');
                  }}
                >
                  <span>Term & Condition Apply</span>
                  <img src={LinkArrow} alt="" />
                </button> */}
              </CouponRight>
            </Coupon>
          ))}
        </Coupons>
      )}
      {/* {!isEmpty && (
        <More>
          Wanting get more? let’s head to{' '}
          <button
            onClick={() => {
              console.log('rewards center');
            }}
          >
            rewards center
          </button>
        </More>
      )} */}
    </Page>
  );
}

export default brandCheckHoc(FeeDiscountCoupons, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute))
