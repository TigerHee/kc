import React from 'react';
import {View} from 'react-native';
import {css} from '@emotion/native';

import {AccountHistoryArrow} from 'components/Common/SvgIcon';
import {RowWrap} from 'constants/styles';
import useLang from 'hooks/useLang';
import {DIRECTION_MAP} from '../constant';
import {ItemWrap, LabelText, ValueText} from './styles';

const RecordItem = ({info}) => {
  const {dateTimeFormat, numberFormat} = useLang();
  const {_t} = useLang();
  const {amount, createdAt, currency, direction} = info;

  const isParentAccOutDirection = direction === DIRECTION_MAP.OUT;

  return (
    <ItemWrap>
      <View>
        <LabelText>{currency}</LabelText>
        <ValueText>
          {dateTimeFormat(createdAt, {
            options: {
              year: undefined,
              second: undefined,
            },
          })}
        </ValueText>
      </View>
      <View
        style={css`
          align-items: flex-end;
        `}>
        <LabelText>{numberFormat(amount)}</LabelText>
        <RowWrap
          style={css`
            margin-top: 2px;
            flex: 1;
          `}>
          <ValueText>
            {isParentAccOutDirection
              ? _t('1459b0e26a984000a1c7')
              : _t('525845ec781b4000a8df')}
          </ValueText>
          <View
            style={css`
              margin: 0 4px;
            `}>
            <AccountHistoryArrow />
          </View>
          <ValueText>
            {!isParentAccOutDirection
              ? _t('1459b0e26a984000a1c7')
              : _t('525845ec781b4000a8df')}
          </ValueText>
        </RowWrap>
      </View>
    </ItemWrap>
  );
};

export default RecordItem;
