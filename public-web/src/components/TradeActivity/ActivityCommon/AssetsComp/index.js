/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { ICTradeAddOutlined } from '@kux/icons';
import { Divider, Dropdown, useResponsive } from '@kux/mui';
import { numberFormat } from '@kux/mui/utils';
import isNil from 'lodash/isNil';
import { memo, useCallback, useMemo, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import { useVaildSymbol } from 'TradeActivity/hooks';
import numberFixed from 'utils/numberFixed';
import { push } from 'utils/router';
import {
  AssetBtnWrapper,
  FilterDialog,
  PoolAvailableWrapper,
  StyledDropDownH5Option,
  StyledDropDownOption,
} from './styledComponents';

const AssetsComp = memo(({ stakingToken, tokenScale, mini = false }) => {
  const { sm } = useResponsive();
  const isInApp = JsBridge.isApp();
  const { currentLang } = useLocale();
  const dispatch = useDispatch();
  const vaildSymbol = useVaildSymbol(`${stakingToken}-USDT`);

  const [visible, setVisible] = useState(false);

  const tradeMap = useSelector((state) => state.user_assets.tradeMap, shallowEqual);
  const user = useSelector((state) => state.user.user, shallowEqual);

  const availableBalance = useMemo(() => {
    const { availableBalance: _availableBalance } = tradeMap?.[stakingToken] || {};
    return !isNil(_availableBalance) ? numberFixed(_availableBalance, +tokenScale || 0) : undefined;
  }, [tradeMap, stakingToken, tokenScale]);

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

  const handleToTrade = useCallback(
    (e) => {
      e.preventDefault && e.preventDefault();
      e.stopPropagation && e.stopPropagation();
      if (isInApp) {
        // app内跳转
        JsBridge.open({
          type: 'jump',
          params: {
            url: `/trade?symbol=${vaildSymbol}&goBackUrl=${encodeURIComponent(
              window.location.href,
            )}`,
          },
        });
      } else {
        push(`/trade/${vaildSymbol}`);
      }
    },
    [isInApp, vaildSymbol],
  );

  const overlayItems = useMemo(() => {
    return [
      {
        label: _t('19435b295e504000a652'),
        onClick: handleAssetTransformPop,
      },
      {
        label: _t('6ec261c1b1d04000a348', { currency: stakingToken }),
        onClick: handleToTrade,
      },
    ];
  }, [handleToTrade, handleAssetTransformPop, stakingToken]);

  return (
    <PoolAvailableWrapper
      onClick={(e) => {
        e.preventDefault && e.preventDefault();
        e.stopPropagation && e.stopPropagation();
      }}
    >
      <div className="leftWrapper">
        <span className="label">{_t('7c65faa586b64000af61')}</span>
        <span className="value ml-4">{`${available} ${stakingToken}`}</span>
        {!!user &&
          (!sm ? (
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
            <Dropdown
              trigger="hover"
              placement="bottom-end"
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
              <div tabIndex={0} role="button" className={`icon ${mini ? 'miniIcon' : ''}`}>
                <ICTradeAddOutlined />
              </div>
            </Dropdown>
          ))}
      </div>

      {!!user && (
        <div className={`operatorWrapper ${mini ? 'miniOperatorWrapper' : ''}`}>
          {overlayItems.map((item, index) => {
            return (
              <>
                <AssetBtnWrapper
                  onClick={item.onClick}
                  className="assetsBtn"
                  key={`button_${index}`}
                >
                  {item.label}
                </AssetBtnWrapper>
                {index !== overlayItems?.length - 1 && <Divider type="vertical" />}
              </>
            );
          })}
        </div>
      )}
    </PoolAvailableWrapper>
  );
});

export default AssetsComp;
