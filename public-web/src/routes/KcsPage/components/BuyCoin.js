/**
 * Owner: chris@kupotech.com
 */
import sentry from '@kc/sentry';
import JsBridge from '@knb/native-bridge';
import { ICArrowRightOutlined, ICTradeAddOutlined } from '@kux/icons';
import { Button, Popover, styled } from '@kux/mui';
import { useEventCallback } from '@kux/mui/hooks';
import BaseDrawer from 'components/BaseDrawer';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import sensors from 'src/tools/ext/kc-sensors';
import { _t } from 'src/tools/i18n';
import HOST from 'utils/siteConfig';
import { callJump, getScene } from '../utils';
import { BASE_CURRENCY } from 'config/base';

const { MAINSITE_HOST, TRADE_HOST } = HOST;

const ICTradeAddOutlineds = styled(ICTradeAddOutlined)`
  color: ${({ theme }) => theme.colors.text60};
  cursor: pointer;
`;

const PlusOverLay = ({ menus }) => {
  return (
    <>
      {menus.map(({ label, onClick }, idx) => (
        <div className="item" role="presentation" key={idx} onClick={onClick}>
          {label}
        </div>
      ))}
    </>
  );
};

const Popovers = styled(Popover)`
  color: ${(props) => props.theme.colors.text40};
  font-size: 14px;
  line-height: 1.3;
  z-index: 1000;
  .KuxPopover-root {
    background: ${(props) => props.theme.colors.layer};
    border: ${({ theme }) =>
      theme.currentTheme === 'dark' ? `1px solid ${theme.colors.cover4}` : 'none'};
    border-radius: 8px;
  }
  .item {
    min-width: 80px;
    padding: 12px;
    color: ${(props) => props.theme.colors.text};
    font-size: 14px;
    &:hover {
      background-color: ${(props) => props.theme.colors.cover2};
      cursor: pointer;
    }
  }
  .KuxPopover-root {
    background: ${(props) => {
      return props.theme.colors.layer;
    }};
  }
  .KuxPopover-message {
    color: ${(props) => props.theme.colors.text};
  }
  .KuxPopover-content {
    padding: 0;
  }
`;

const DrawerItem = styled.div`
  height: 48px;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 500;
  svg {
    color: ${({ theme }) => theme.colors.icon60};
  }
`;

const CancelButton = styled(Button)`
  margin-top: 12px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.cover8};
  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.cover8};
  }
`;

function BuyCoin({ currency, getTotalKcs, isSm, userLevel, currentLevel }) {
  const dispatch = useDispatch();
  const isInApp = JsBridge.isApp();
  const contentRef = useRef();
  const [open, setOpen] = useState(false);
  const menus = [
    {
      label: _t('transfer.s'),
      onClick: () => {
        sensors.trackClick([`AddKCSOperate`, `1`], {
          kcs_level: userLevel,
          pagePosition: `${currentLevel}`,
          ...getScene(),
        });
        if (isInApp) {
          callJump(
            {
              url: '/account/transfer',
              coin: currency,
              from: 'MAIN',
              to: 'TRADE',
              type: 'TRADE',
            },
            // 化转成功回调
            async function (res) {
              if (res.msg === 'succeed') {
                getTotalKcs();
              } else {
                // 划转失败上报
                sentry.captureEvent({
                  message: `transfer error:${res?.msg || ''}`,
                  level: 'info',
                  tags: {
                    transferError: 'transferError',
                  },
                });
              }
            },
          );
        } else {
          dispatch({
            type: 'transfer/update',
            payload: {
              visible: true,
              initCurrency: currency,
              cusOnClose: getTotalKcs,
            },
          });
        }
      },
    },
    {
      label: _t('ff8903a103fa4000ac14'),
      onClick: () => {
        sensors.trackClick([`AddKCSOperate`, `2`], {
          kcs_level: userLevel,
          pagePosition: `${currentLevel}`,
          ...getScene(),
        });
        callJump(
          {
            url: '/account/deposit',
            type: 0,
            currency: currency,
          },
          `${MAINSITE_HOST}/assets/coin/${currency || ''}`,
        );
      },
    },
    {
      label: _t('40a34ed0db5f4000a713'),
      onClick: () => {
        sensors.trackClick([`AddKCSOperate`, `3`], {
          kcs_level: userLevel,
          pagePosition: `${currentLevel}`,
          ...getScene(),
        });
        callJump(
          {
            url: `/otc?type=2&fiat=USD&coin=${BASE_CURRENCY}&currency=${BASE_CURRENCY}`,
          },
          `${MAINSITE_HOST}/express?target=${currency || ''}`,
        );
      },
    },
    {
      label: _t('5602ecd6b6d94000a571'),
      onClick: () => {
        sensors.trackClick([`AddKCSOperate`, `4`], {
          kcs_level: userLevel,
          pagePosition: `${currentLevel}`,
          ...getScene(),
        });
        let _href = window.location.href;
        const query = 'loading=2&isBanner=1&appNeedLang=true';
        _href = _href.includes('?') ? `${_href}&${query}` : `${_href}?${query}`;
        callJump(
          {
            url: `/trade?symbol=KCS-${BASE_CURRENCY}&goBackUrl=${encodeURIComponent(_href)}`,
          },
          `${TRADE_HOST}/KCS-${BASE_CURRENCY}`,
        );
      },
    },
  ];

  const maxTouchYFunc = useEventCallback(() => {
    // 返回内容主区域dom
    return contentRef.current;
  });

  const addBtnSensors = () => {
    sensors.trackClick([`AddKCS`, `1`], {
      kcs_level: userLevel,
      pagePosition: `${currentLevel}`,
      ...getScene(),
    });
  };

  const modalHandle = () => {
    addBtnSensors();
    setOpen(!open);
  };

  if (isSm) {
    return (
      <>
        <ICTradeAddOutlineds onClick={modalHandle} className="transfer ml-4" />
        <BaseDrawer
          showRightOpt={false}
          show={open}
          onClose={modalHandle}
          anchor="bottom"
          header={<></>}
          touchConfig={{
            maxTouchYFunc,
            maxTouchYField: 'top',
          }}
          // isUseNewSkin={isUseNewSkin}
        >
          {menus.map(({ label, onClick }, idx) => (
            <DrawerItem onClick={onClick} key={idx}>
              <span>{label}</span>
              <ICArrowRightOutlined size={20} />
            </DrawerItem>
          ))}
          <CancelButton onClick={modalHandle} fullWidth>
            {_t('cancel')}
          </CancelButton>
        </BaseDrawer>
      </>
    );
  }
  return (
    <>
      <Popovers
        placement="bottom-start"
        trigger="hover"
        arrow={false}
        content={<PlusOverLay menus={menus} currency={currency} />}
      >
        <ICTradeAddOutlineds onMouseEnter={addBtnSensors} className="transfer ml-4" />
      </Popovers>
    </>
  );
}
export default BuyCoin;
