/**
 * Owner: willen@kupotech.com
 */
import styled from '@emotion/native';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import selectImg from 'assets/convert/selectedv2.png';

import {TouchableOpacity} from 'react-native';
import {currencyMap} from 'config';
import {ACCOUNT_TYPE_LIST} from 'components/Convert/config';
import {
  dropZero,
  numberFixed,
  multiply,
  divide,
  delt,
  getCoinAvailableBalance,
} from 'utils/helper';
import CoinAndValue from 'components/Convert/Common/CoinAndValue';
import AccountAndIcon from 'components/Convert/Common/AccountAndIcon';
import ActionSheet from 'components/Common/ActionSheet';

const AccountBox = styled.View`
  position: relative;
  overflow: hidden;
`;

const AccountItem = styled.View`
  flex-direction: row;
  background: ${({theme, selected}) =>
    selected ? theme.colorV2.cover2 : theme.colorV2.layer};
  padding: 0 16px;
  height: 72px;
  position: relative;
  justify-content: space-between;
  align-items: center;
`;

const AccountValue = styled.View`
  flex-direction: column;
`;

const SelectedIcon = styled.Image`
  width: 20px;
  height: 20px;
  display: ${({selected}) => (selected ? 'flex' : 'none')};
`;

export default ({coin, precision}) => {
  const openAccountSheet = useSelector(state => state.convert.openAccountSheet);
  const selectAccountType = useSelector(
    state => state.convert.selectAccountType,
  );
  const baseConfig = useSelector(state => state.convert.baseConfig);
  const isLogin = useSelector(state => state.app.isLogin);

  const mainMap = useSelector(state => state.app.mainMap) || {};
  const tradeMap = useSelector(state => state.app.tradeMap) || {};
  const prices = useSelector(state => state.app.prices);
  const rates = useSelector(state => state.app.rates);
  const currency = useSelector(state => state.app.currency);

  const dispatch = useDispatch();
  const char = currencyMap[currency] || currency;

  const onSelect = async data => {
    dispatch({
      type: 'convert/update',
      payload: {
        selectAccountType: data,
        openAccountSheet: false,
      },
    });
  };

  const returnSelect = data => {
    return selectAccountType === data;
  };

  return (
    <ActionSheet
      id="account-drawer"
      show={openAccountSheet}
      onClose={() => {
        dispatch({
          type: 'convert/update',
          payload: {
            openAccountSheet: false,
          },
        });
      }}
      headerType="native"
      showCancel
      header={<></>}>
      <AccountBox>
        {ACCOUNT_TYPE_LIST.map(item => {
          let balance = getCoinAvailableBalance({
            coin,
            precision,
            mainMap,
            tradeMap,
            accountType: item.type,
            isLogin,
          });
          const currencyPrice = prices[coin] || 0;
          const amountByCurrency = multiply(balance, currencyPrice);
          const amountByUSD = divide(amountByCurrency, rates[currency] || 9999);

          if (delt(amountByUSD, 0.1)) balance = 0;

          return (
            <TouchableOpacity
              activeOpacity={0.6}
              key={item.type}
              onPress={() => onSelect(item.type)}>
              <AccountItem selected={returnSelect(item.type)}>
                <AccountValue>
                  <AccountAndIcon
                    type={item.type}
                    textStyle={{
                      fontSize: 16,
                      fontWeight: '500',
                      marginBottom: 2,
                    }}
                  />

                  <CoinAndValue
                    coin={coin}
                    char={char}
                    number={
                      baseConfig.downtime
                        ? '--'
                        : dropZero(numberFixed(balance, precision))
                    }
                    value={dropZero(numberFixed(amountByCurrency, precision))}
                  />
                </AccountValue>

                <SelectedIcon
                  source={selectImg}
                  selected={returnSelect(item.type)}
                />
              </AccountItem>
            </TouchableOpacity>
          );
        })}
      </AccountBox>
    </ActionSheet>
  );
};
