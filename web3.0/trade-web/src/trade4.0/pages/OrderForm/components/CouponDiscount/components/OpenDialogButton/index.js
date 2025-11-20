/*
 * owner: solar@kupotech.com
 */
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { styled } from '@/style/emotion';
import { formatNumber } from '@/utils/format';
import { useTheme } from '@kux/mui';
import Button from '@mui/Button';
import { useYScreen } from '@/pages/OrderForm/config';
import useIsH5 from 'src/trade4.0/hooks/useIsH5';

import SvgComponent from '@/components/SvgComponent';
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import useLoginDrawer from '@/hooks/useLoginDrawer';
import useSensorFunc from '@/hooks/useSensorFunc';
import { _t, addLangToPath } from 'src/utils/lang';

import { useDiscountRate } from '../../hooks';
import { ICTradingFeeLevelOutlined, ICCouponsOutlined, ICArrowRightOutlined } from '@kux/icons';
import { siteCfg } from 'config';
import ToolTip from '@mui/Tooltip';
import Switch from '@mui/Switch';
import Drawer from '@mui/Drawer';
import { useSelector, useDispatch } from 'dva';
import useMemoizedFn from '@/hooks/common/useMemoizedFn';

const ButtonStyled = `
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
`;

const Icon = styled(SvgComponent)``;

const StyledOverlay = styled.div`
  width: ${(props) => props.width};
  .level-container {
    display: flex;
    justify-content: space-between;
    height: 40px;
    align-items: center;
    background-color: ${(props) => props.text4};
    padding: 0 12px;
    .level-left {
      display: flex;
      align-items: center;
      .level-title {
        ${(props) => props.theme.fonts.size.lg}
        color: ${(props) => props.text};
        margin-right: 8px;
        font-weight: 500;
      }
    }
    .level-right {
      display: flex;
      align-items: center;
      button.skip-viplevel-btn {
        ${ButtonStyled}
        ${(props) => props.theme.fonts.size.md}
        color: ${(props) => props.theme.colors.primary};
        margin-right: 2px;
        ${(props) => props.theme.breakpoints.up('sm')} {
          width: 108px;
          text-align: right;
        }
      }
    }
  }
  .main-container {
    background-color: ${(props) => (props.isH5 ? 'transparent' : props.mainBg) };
    padding: 16px 12px;
    .kcs-container {
      .coinpair {
        color: ${(props) => props.text};
        ${(props) => props.theme.fonts.size.lg}
        font-weight: 500;
      }
      .kcs-switch-container {
        margin-top: 8px;
        display: flex;
        justify-content: space-between;
        .kcs-switch-left {
          ${(props) => props.theme.fonts.size.md}
          .text {
            color: ${(props) => props.text40};
            margin-right: 8px;
          }
          .discount-quota {
            color: ${(props) => props.theme.colors.textPrimary};
            cursor: pointer;
          }
        }
        .KuxSwitch-container {
          .KuxSwitch-handle {
            background-color: ${(props) => props.text20};
          }
          &.KuxSwitch-checkedContainer {
            .KuxSwitch-handle {
              background-color: ${(props) => props.theme.colors.textPrimary};
            }
          }
        }
      }
    }
    .divider {
      margin: 16px 0px;
      height: 0.5px;
      background-color: ${(props) => props.text4};
    }
    .fee-rate-container {
      display: flex;
      .fee-rate-item {
        flex: 1;
        .quota {
          display: flex;
          align-items: center;
          .kcs-deduction {
            color: ${(props) => props.text};
            ${(props) => props.theme.fonts.size.lg}
            margin-right: 4px;
            font-weight: 500;
          }
          .origin-deduction {
            color: ${(props) => props.text40};
            ${(props) => props.theme.fonts.size.md}
            text-decoration: line-through;
          }
        }
        .side {
          margin-top: 2px;
          color: ${(props) => props.text40};
          ${(props) => props.theme.fonts.size.md}
        }
      }
    }
    .spot-coupon-detail-entry {
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      ${(props) => props.theme.fonts.size.md}
      .spot-coupon-detail-entry-left {
        display: flex;
        color: ${(props) => props.text};
        align-items: center;
        .title {
          margin-left: 6px;
          font-weight: 500;
        }
      }
      .spot-coupon-detail-entry-right {
        display: flex;
        align-items: center;
        .best-available {
          ${props => props.theme.fonts.size.md}
          color: ${(props) => props.theme.colors.textPrimary};
        }
      }
    }
  }
`;

const WithStyledOverlay = (WrappedComponent) => {
  return (_props) => {
    const isH5 = useIsH5();
    const { currentTheme, colors } = useTheme();
    const otherProps = useMemo(() => {
      const map = {
        width: '320px',
        text40: '#7c7c7d',
        text: '#f3f3f3',
        mainBg: '#2D2D2F',
        text20: 'rgba(243, 243, 243, 0.2)',
        text4: '#353537',
      };
      if (isH5) {
        map.width = '100%';
        map.text40 = colors.text40;
        map.text20 = colors.text20;
        map.text = colors.text;
        map.text4 = colors.text4;
        if (currentTheme === 'light') {
          map.mainBg = colors.overlay;
        }
      }
      return map;
    }, [isH5, currentTheme, colors]);
    const props = { ..._props, isH5, ...otherProps };
    return <WrappedComponent {...props} />;
  };
};

const { MAINSITE_HOST } = siteCfg;
const EnhancedOverlayComponent = WithStyledOverlay(StyledOverlay);
function Overlay({ setDialogOpen, isLogin }) {
  const baseInfo = useSelector((state) => state.homepage.baseInfo);
  const { userLevel } = baseInfo;
  const userKcsDiscountStatus = useSelector((state) => state.homepage.userKcsDiscountStatus);
  const currentSymbol = useGetCurrentSymbol();
  const skip2VipLevel = useCallback(() => {
    window.open(addLangToPath(`${MAINSITE_HOST}/vip/privilege`));
  }, []);
  const dispatch = useDispatch();
  const sensorFunc = useSensorFunc();
  const handleCheck = useMemoizedFn((checked) => {
    sensorFunc(['marginTrading', 'kcsPayFees']);
    dispatch({
      type: 'homepage/updateUserKcsDiscount',
      payload: {
        enabled: checked,
      },
    });
  });

  const currentLang = useSelector((state) => state.app.currentLang);

  const StyledICArrowRightOutlined = styled(ICArrowRightOutlined)`
    [dir='rtl'] & {
      transform: rotate(180deg);
    }
  `;

  useEffect(() => {
    if (isLogin) {
      dispatch({
        type: 'coupon/queryUsableCoupon',
        payload: { symbol: currentSymbol },
      });
      dispatch({ type: 'homepage/getUserKcsDiscount' });
    }
  }, [isLogin, currentSymbol, dispatch]);

  const usableCouponList = useSelector(
    (state) => state.coupon.usableCouponList,
  );

  const bestAvailable = formatNumber(usableCouponList[0]?.available, {
    fixed: 2,
  });
  const bestAvailableCurrency = usableCouponList[0]?.currency;

  const { takerMain, takerSub, makerMain, makerSub } = useDiscountRate(userKcsDiscountStatus);


  return (
    <EnhancedOverlayComponent>
      <div className="level-container">
        <div className="level-left">
          <span className="level-title">{_t('18E4w4dyqssWUQ9sBKYAZi')}</span>
          <Icon
            fileName="coupon"
            //   onClick={onClose}
            width="30"
            height="20"
            type={`level-numbered-${userLevel}`}
            keepOrigin
            //   color={colors.icon60}
          />
        </div>
        <div className="level-right">
          <button onClick={skip2VipLevel} className="skip-viplevel-btn">
            {_t('wizP23p382QL7MpCBn9EJW')}
          </button>
          <StyledICArrowRightOutlined size={12} className="icon" color="#585859" />
        </div>
      </div>
      <div className="main-container">
        <div className="kcs-container">
          <div className="coinpair">{currentSymbol}</div>
          <div className="kcs-switch-container">
            <div className="kcs-switch-left">
              <span className="text">{_t('uaRNzTVQvGvEX4HCzzQ7NA')}</span>
              <span
                className="discount-quota"
                onClick={() => {
                  const KCSLink = {
                    zh_CN: `${MAINSITE_HOST}/news/cht-about-pay-fees-with-kcs`,
                    zh_HK: `${MAINSITE_HOST}/news/cht-about-pay-fees-with-kcs`,
                    en_US: `${MAINSITE_HOST}/news/en-about-pay-fees-with-kcs`,
                    default: `${MAINSITE_HOST}/news/en-about-pay-fees-with-kcs`,
                  };
                  window.location.href = KCSLink[currentLang] || KCSLink.default;
                }}
              >
                {_t('bGvKzaRwTT6c5j59BsmZnh')}
              </span>
            </div>
            <Switch checked={userKcsDiscountStatus} onChange={handleCheck} size="small" />
          </div>
        </div>
        <div className="divider" />
        <div className="fee-rate-container">
          <div className="fee-rate-item">
            <div className="quota">
              <div className="kcs-deduction">{takerMain}</div>
              <div className="origin-deduction">{takerSub}</div>
            </div>
            <div className="side">{_t('n.vip.fee.taker')}</div>
          </div>
          <div className="fee-rate-item">
            <div className="quota">
              <div className="kcs-deduction">{makerMain}</div>
              <div className="origin-deduction">{makerSub}</div>
            </div>
            <div className="side">{_t('n.vip.fee.maker')}</div>
          </div>
        </div>
        <div className="divider" />
        <div className="spot-coupon-detail-entry" onClick={setDialogOpen}>
          <div className="spot-coupon-detail-entry-left">
            <ICCouponsOutlined size={12} className="icon" color="#666667" />
            <span className="title">{_t('5Lbgtjk9hVFuLzksrjx2B6')}</span>
          </div>
          <div className="spot-coupon-detail-entry-right">
            {bestAvailableCurrency && (<div className="best-available">{`${bestAvailable} ${bestAvailableCurrency}`}</div>)}
            <StyledICArrowRightOutlined size={12} className="icon" color="#585859" />
          </div>
        </div>
      </div>
    </EnhancedOverlayComponent>
  );
}

const StyledButton = styled.button`
  ${ButtonStyled}
  color: ${(props) => props.theme.colors.text40};
  ${(props) => props.theme.fonts.size.md}
  margin-top: ${props => `${props.isSm ? 10 : 16}px`};
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  .icon {
    margin-right: 6px;
  }
`;
const StyledToolTip = styled(ToolTip)`
  padding: 0;
  overflow: hidden;
`;

const StyledDrawer = styled(Drawer)`
  z-index: 1700;
  height: 60% !important;
  .confirm-button {
    position: absolute;
    bottom: 34px;
    left: 16px;
    right: 16px;
  }
`;
const FeeInfo = ({ overlay, children, onH5Close, h5Visible, isLogin }) => {
  const isH5 = useIsH5();
  if (isH5) {
    return (
      <div>
        {children}
        <StyledDrawer
          show={h5Visible}
          back={false}
          anchor="right"
          onClose={onH5Close}
          contentPadding="8px 0"
          footer={null}
          title={_t('5Lbgtjk9hVFuLzksrjx2B6')}
        >
          {overlay}
          {isH5 && (
            <div className="confirm-button">
              <Button type="primary" onClick={onH5Close} fullWidth>
                {_t('confirm')}
              </Button>
            </div>
          )}
        </StyledDrawer>
      </div>
    );
  }
  if (!isLogin) {
    return <>{children}</>;
  }
  return (
    <StyledToolTip
      title={overlay}
      maxWidth={320}
      trigger="hover"
    >
      {children}
    </StyledToolTip>
  );
};

export default function OpenDialogButton({ setDialogOpen }) {
  const isH5 = useIsH5();
  const [FeeInfoVisible, setFeeInfoVisible] = useState(false);
  const isLogin = useSelector((state) => state.user.isLogin);
  const { open } = useLoginDrawer();
  const yScreen = useYScreen();
  const isSm = yScreen === 'sm';

  // 只有h5才是点击触发
  const handleTriggerClick = useCallback(
    (visible) => {
      if (!isLogin) {
        open();
        return;
      }
      if (isH5) {
        setFeeInfoVisible(visible);
      }
    },
    [isH5, isLogin, open],
  );
  return (
    <FeeInfo
      overlay={<Overlay setDialogOpen={setDialogOpen} isLogin={isLogin} isH5={isH5} />}
      maxWidth={320}
      h5Visible={FeeInfoVisible}
      onH5Close={handleTriggerClick.bind(null, false)}
      isLogin={isLogin}
    >
      <StyledButton onClick={handleTriggerClick.bind(null, true)} isSm={isSm}>
        <ICTradingFeeLevelOutlined size={12} className="icon" />
        <span>{_t('5Lbgtjk9hVFuLzksrjx2B6')}</span>
      </StyledButton>
    </FeeInfo>
  );
}
