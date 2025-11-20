/**
 * Owner: willen@kupotech.com
 */
import styled from '@emotion/native';
import React from 'react';
import CoinIcon from 'components/Common/CoinIcon';
import CoinCodeToName from 'components/Common/CoinCodeToName';
import CoinAndValue from 'components/Convert/Common/CoinAndValue';
import {dropZero, numberFixed} from 'utils/helper';
import {useSelector} from 'react-redux';
import {CURRENCY_CHARS} from 'config';
import useLang from 'hooks/useLang';
import {useTheme} from '@krn/ui';
import HighlightText from 'components/Common/HighlightText';
import {Platform} from 'react-native';
import {HotIcon} from './ListHeader';

/**
 * 杠杆标识 tags
 */
const MARGIN_MARKS = {
  LONG3: '1k7ssjbv3Qf8tnU6ktGN6i',
  SHORT3: 'rDv5ecUJmXo9QNAcRYoduu',
  LONG2_4: 'hFJHZpBHiBE5wDPexa5s1M',
  SHORT2_4: 'kuh96p22Hj8QPV6XyXcUTA',
};

const CoinItem = styled.Pressable`
  padding: 10px 16px;
  flex-direction: row;
  align-items: center;
  background: ${({theme, selected}) =>
    selected ? theme.colorV2.cover2 : 'transparent'};
`;
const CoinName = styled.View`
  display: flex;
  align-items: center;
  margin-left: ${({type}) => (type === 'history' ? '6px' : '0px')};
`;
const CoinNameText = styled.Text`
  font-weight: 500;
  font-size: 15px;
  line-height: ${() => (Platform.OS === 'android' ? undefined : '20px')};
  color: ${props => props.theme.colorV2.text};
`;
const CoinNameWrap = styled.View`
  display: flex;
  align-items: center;
  flex-direction: row;
`;
const CoinMarginTagWrap = styled.View`
  display: flex;
  align-items: center;
  padding: 1px 4px;
  margin-left: 5px;
  border: 0.5px solid ${({theme, type}) => theme.colorV2[type]};
  background: ${({theme, type}) => theme.colorV2[`${type}8`]};
  border-radius: 2px;
`;
const CoinMarginTag = styled.Text`
  font-size: 10px;
  color: ${({theme, type}) => theme.colorV2[type]};
  font-weight: 500;
`;
const CoinFullName = styled.Text`
  font-size: 12px;
  flex: 1;
  color: ${props => props.theme.colorV2.text40};
  line-height: ${() => (Platform.OS === 'android' ? undefined : '16px')};
  margin-left: ${({type}) => (type === 'history' ? '6px' : '0px')};
`;

const HotIconPro = styled(HotIcon)`
  margin-left: 2px;
`;

const Content = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  overflow: hidden;
  margin-right: ${({type}) => (type === 'history' ? '0px' : '6px')};
`;
const CoinIconWrap = styled(CoinIcon)`
  flex-shrink: 0;
  margin-right: 8px;
`;
const AmountZero = styled.Text`
  font-weight: bold;
  font-size: 16px;
  line-height: ${() => (Platform.OS === 'android' ? undefined : '16px')};
  color: ${props => props.theme.colorV2.text40};
`;
const CoinNameWrapper = styled.View`
  flex: 1;
  overflow: hidden;
  align-items: flex-start;
`;

const NewWrapper = styled.View`
  background-color: ${({theme}) => theme.colorV2.primary8};

  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding: 0 4px;
  margin-left: 2px;
`;

const NewText = styled.Text`
  font-size: 12px;
  font-weight: 500;
  color: ${({theme}) => theme.colorV2.primary};
`;

const Tags = ({marginMark}) => {
  const {type, tag} = marginMark || {};
  const {_t} = useLang();

  const marginMarkColorType = type === 'LONG' ? 'primary' : 'secondary';

  if (type) {
    return (
      <CoinMarginTagWrap type={marginMarkColorType}>
        <CoinMarginTag type={marginMarkColorType}>
          {_t(MARGIN_MARKS[marginMark.value])}
        </CoinMarginTag>
      </CoinMarginTagWrap>
    );
  }
  if (tag === 'NEW') {
    return (
      <NewWrapper>
        <NewText>New</NewText>
      </NewWrapper>
    );
  }

  if (tag === 'HOT') {
    return <HotIconPro />;
  }
  return null;
};
const Name = ({coin, fullName, type, marginMark, keywords, ...restProps}) => {
  return (
    <>
      <CoinNameWrap type={type}>
        <CoinName type={type} {...restProps}>
          <CoinNameText type={type}>
            <CoinCodeToName coin={coin} keywords={keywords} />
          </CoinNameText>
        </CoinName>
        <Tags marginMark={marginMark} />
      </CoinNameWrap>
      <CoinFullName numberOfLines={1} ellipsizeMode={'tail'} type={type}>
        <HighlightText allText={fullName} keywords={keywords} />
      </CoinFullName>
    </>
  );
};

export default ({
  info,
  handleSelect,
  type,
  showBalance,
  marginMark,
  keywords,
}) => {
  const currency = useSelector(state => state.app.currency);
  const theme = useTheme();

  const charObj =
    CURRENCY_CHARS.filter(item => item.currency === currency)[0] || {};

  return (
    <CoinItem onPress={handleSelect} selected={info.selected}>
      <Content>
        <CoinIconWrap coin={info.coin} size={20} />
        {type === 'history' ? (
          <Name
            coin={info.coin}
            fullName={info.fullName}
            type={type}
            keywords={keywords}
          />
        ) : (
          <CoinNameWrapper>
            <Name
              type={type}
              numberOfLines={1}
              ellipsizeMode={'tail'}
              coin={info.coin}
              fullName={info.fullName}
              marginMark={marginMark}
              keywords={keywords}
            />
          </CoinNameWrapper>
        )}
      </Content>
      {showBalance ? (
        info.balance * 1 > 0 ? (
          <CoinAndValue
            char={charObj.char}
            number={dropZero(numberFixed(info.balance, info.precision || 8))}
            value={dropZero(numberFixed(info.amountByCurrency, 2))}
            text1Style={{
              fontSize: 15,
              fontWeight: '500',
              color: theme.colorV2.text,
              lineHeight: 20,
            }}
            text2Style={{
              fontSize: 12,
              color: theme.colorV2.text40,
              lineHeight: 16,
            }}
            style={{
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          />
        ) : (
          <AmountZero>0.00</AmountZero>
        )
      ) : null}
    </CoinItem>
  );
};
