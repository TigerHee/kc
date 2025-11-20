/**
 * Owner: willen@kupotech.com
 */
import styled from '@emotion/native';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import selectImg from 'assets/convert/selectedv2.png';

import {TouchableOpacity} from 'react-native';
import {DEPOSITE_TYPE_LIST} from 'components/Convert/config';
import {openNative} from '@krn/bridge';
import ActionSheet from 'components/Common/ActionSheet';
import useLang from 'hooks/useLang';
import {getIsKC} from 'site/index';

const AccountBox = styled.View`
  position: relative;
`;

const AccountItem = styled.View`
  flex-direction: row;
  background: ${({theme, selected}) =>
    selected ? theme.colorV2.cover2 : theme.colorV2.overlay};
  padding: 0 16px;
  height: 48px;
  position: relative;
  justify-content: space-between;
  align-items: center;
`;

const AccountValue = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 16px;
  line-height: 20px;
  font-weight: 500;
`;

const SelectedIcon = styled.Image`
  width: 20px;
  height: 20px;
  display: ${({selected}) => (selected ? 'flex' : 'none')};
`;

export default ({coin, accountType}) => {
  const isKC = getIsKC();
  const openDepositeSheet = useSelector(
    state => state.convert.openDepositeSheet,
  );
  const [selected, setSelected] = useState();
  const dispatch = useDispatch();
  const {_t} = useLang();
  const handleSelect = data => {
    dispatch({
      type: 'convert/update',
      payload: {
        openDepositeSheet: false,
      },
    });
    setSelected(data.type);

    setTimeout(() => {
      openNative(data.url(coin, accountType === 'MAIN' ? 'TRADE' : 'MAIN'));
    }, 100);
  };

  return openDepositeSheet ? (
    <ActionSheet
      id="deposite-drawer"
      show={openDepositeSheet}
      onClose={() => {
        dispatch({
          type: 'convert/update',
          payload: {
            openDepositeSheet: false,
          },
        });
      }}
      headerType="native"
      showCancel
      header={<></>}>
      <AccountBox>
        {DEPOSITE_TYPE_LIST.map(item => {
          // 只有 kc 有买币
          if (item.type === 'OTC' && !isKC) return null;

          return (
            <TouchableOpacity
              activeOpacity={0.6}
              key={item.type}
              onPress={() => handleSelect(item)}>
              <AccountItem selected={item.type === selected}>
                <AccountValue>{_t(item.localeKey)}</AccountValue>

                <SelectedIcon
                  source={selectImg}
                  selected={item.type === selected}
                />
              </AccountItem>
            </TouchableOpacity>
          );
        })}
      </AccountBox>
    </ActionSheet>
  ) : null;
};
