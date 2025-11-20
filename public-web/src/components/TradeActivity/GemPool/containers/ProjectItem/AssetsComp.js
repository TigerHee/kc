/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { ICTradeAddOutlined } from '@kux/icons';
import { Divider, Dropdown, useResponsive } from '@kux/mui';
import { numberFormat } from '@kux/mui/utils';
import { add } from 'helper';
import isNil from 'lodash/isNil';
import { memo, useCallback, useMemo, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import numberFixed from 'utils/numberFixed';
import { push } from 'utils/router';
import {
  AssetBtnWrapper,
  FilterDialog,
  PoolAvailableWrapper,
  StyledDropDownH5Option,
  StyledDropDownOption,
} from './styledComponents';

// 资产组建，登陆后才能调用
const AssetsComp = memo(({ stakingToken, tokenScale, isMini = false, isTotal = false }) => {
  const isInApp = JsBridge.isApp();
  const { currentLang } = useLocale();
  const dispatch = useDispatch();
  const { sm } = useResponsive();

  const [visible, setVisible] = useState(false);

  const tradeMap = useSelector((state) => state.user_assets.tradeMap, shallowEqual);
  const currency = useSelector((state) => state.currency.currency); // 当前用户选择的法币单位
  const kcsAvailable = useSelector((state) => state.gempool.kcsAvailable);

  const availableBalance = useMemo(() => {
    try {
      const { availableBalance: _availableBalance } = tradeMap?.[stakingToken] || {};
      let num = _availableBalance;
      if (isTotal) {
        if (_availableBalance && kcsAvailable) {
          num = add(_availableBalance, kcsAvailable);
        } else if (!isNil(kcsAvailable)) {
          num = kcsAvailable;
        }
      }
      return !isNil(_availableBalance) ? numberFixed(num, +tokenScale || 0) : undefined;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }, [tradeMap, stakingToken, tokenScale, isTotal, kcsAvailable]);

  const available = useMemo(() => {
    if (isNil(availableBalance)) return '--';
    return availableBalance
      ? numberFormat({
          number: availableBalance,
          lang: currentLang,
        })
      : '0';
  }, [currentLang, availableBalance]);

  // 划转弹窗
  const handleAssetTransformPop = useCallback(
    (e) => {
      e.preventDefault && e.preventDefault();
      e.stopPropagation && e.stopPropagation();
      setVisible(false);

      if (isInApp) {
        // app内跳转
        JsBridge.open({
          type: 'jump',
          params: {
            url: `/account/transfer?coin=${stakingToken}`,
          },
        });
      } else {
        dispatch({
          type: 'transfer/update',
          payload: {
            visible: true,
            initCurrency: stakingToken,
          },
        });
      }
    },
    [dispatch, stakingToken, isInApp],
  );

  // 充币
  const handleToDeposit = useCallback(
    (e) => {
      e.preventDefault && e.preventDefault();
      e.stopPropagation && e.stopPropagation();
      setVisible(false);
      if (isInApp) {
        // app内跳转
        JsBridge.open({
          type: 'jump',
          params: {
            url: `/account/deposit?coin=${stakingToken}`,
          },
        });
      } else {
        push(`/assets/coin/${stakingToken}`);
      }
    },
    [isInApp, stakingToken],
  );

  const handleToBuy = useCallback(
    (e) => {
      e.preventDefault && e.preventDefault();
      e.stopPropagation && e.stopPropagation();
      setVisible(false);
      if (isInApp) {
        // app内跳转
        JsBridge.open({
          type: 'jump',
          params: {
            url: `/otc?type=2&currency=${stakingToken}&coin=${stakingToken}&fiat=${currency}`,
          },
        });
      } else {
        push(`/express?base=${currency}&target=${stakingToken}`);
      }
    },
    [isInApp, stakingToken, currency],
  );

  const handleToFiat = useCallback(
    (e) => {
      e.preventDefault && e.preventDefault();
      e.stopPropagation && e.stopPropagation();
      setVisible(false);
      if (isInApp) {
        // app内跳转
        JsBridge.open({
          type: 'jump',
          params: {
            url: `/otc?type=0&currency=${stakingToken}&coin=${stakingToken}&fiat=${currency}`,
          },
        });
      } else {
        push(`/otc/buy/${stakingToken}-${currency}`);
      }
    },
    [isInApp, stakingToken, currency],
  );
  const overlayItems = useMemo(() => {
    if (isMini) {
      return [
        {
          label: _t('19435b295e504000a652'),
          onClick: handleAssetTransformPop,
        },
        {
          label: _t('deposit'),
          onClick: handleToDeposit,
        },
        {
          label: _t('97aa78a7987f4800ab16'),
          onClick: handleToFiat,
        },
        {
          label: _t('dc350b453d964800a3a1'),
          onClick: handleToBuy,
        },
      ];
    }
    return [
      {
        label: _t('97aa78a7987f4800ab16'),
        onClick: handleToFiat,
      },
      {
        label: _t('dc350b453d964800a3a1'),
        onClick: handleToBuy,
      },
    ];
  }, [isMini, handleToDeposit, handleAssetTransformPop, handleToFiat, handleToBuy]);

  return (
    <PoolAvailableWrapper
      className={isMini ? 'mini' : ''}
      onClick={(e) => {
        e.preventDefault && e.preventDefault();
        e.stopPropagation && e.stopPropagation();
      }}
    >
      <div className="leftWrapper">
        <span className="label">{_t('7c65faa586b64000af61')}</span>
        <span className="value">{`${available} ${stakingToken}`}</span>
      </div>

      <div className="operatorWrapper">
        {!sm ? (
          <>
            <div tabIndex={0} role="button" className="icon" onClick={() => setVisible(!visible)}>
              <ICTradeAddOutlined />
            </div>
            <FilterDialog
              header={null}
              back={false}
              maskClosable
              show={visible}
              className="filterDialog"
              okText={null}
              cancelText={_t('2tZpffHG63KjtUMj246ry5')}
              onCancel={() => setVisible(false)}
              onClose={() => setVisible(false)}
              cancelButtonProps={{ variant: 'contained', type: 'default', size: 'large' }}
              centeredFooterButton
              isInApp={isInApp}
            >
              <StyledDropDownH5Option>
                {overlayItems.map((item, index) => (
                  <button
                    className="create-option"
                    key={`dropdwon_${index}`}
                    onClick={item.onClick}
                  >
                    {item.label}
                  </button>
                ))}
              </StyledDropDownH5Option>
            </FilterDialog>
          </>
        ) : (
          <>
            <Dropdown
              trigger="hover"
              placement="bottom"
              disablePortal={true}
              overlay={
                <StyledDropDownOption>
                  {overlayItems.map((item, index) => (
                    <button
                      className="create-option"
                      key={`dropdwon_${index}`}
                      onClick={item.onClick}
                    >
                      {item.label}
                    </button>
                  ))}
                </StyledDropDownOption>
              }
            >
              <div tabIndex={0} role="button" className="dropdownIcon icon">
                <ICTradeAddOutlined />
              </div>
            </Dropdown>

            {!isMini && (
              <>
                <Divider type="vertical" />
                <AssetBtnWrapper onClick={handleAssetTransformPop} className="assetsBtn">
                  {_t('19435b295e504000a652')}
                </AssetBtnWrapper>
                <Divider type="vertical" />
                <AssetBtnWrapper onClick={handleToDeposit} className="assetsBtn">
                  {_t('deposit')}
                </AssetBtnWrapper>
              </>
            )}
          </>
        )}
      </div>
    </PoolAvailableWrapper>
  );
});

export default AssetsComp;
