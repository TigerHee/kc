/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import styled from '@emotion/native';
import CoinIcon from 'components/Common/CoinIcon';
import CoinCodeToName from 'components/Common/CoinCodeToName';
import detailArrowRightImg from 'assets/convert/detail_arrow_right.png';
// import {CountUp} from '@krn/ui';
import useLang from 'hooks/useLang';
import {Platform} from 'react-native';

const Wrapper = styled.View`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 24px;
  padding: 20px 0;
  border-radius: 12px;
  background-color: ${({theme}) => theme.colorV2.cover2};
`;

const ItemWrapper = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 50%;
  justify-content: center;
`;
// const Direction = styled.Text`
//   font-size: 16px;
//   line-height: 26px;
//   margin-bottom: 8px;
//   color: ${props => props.theme.colorV2.text60};
// `;
const CoinIconWrap = styled(CoinIcon)`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  margin-bottom: 8px;
`;
const CoinWrapper = styled.View`
  flex-direction: column;
  flex-wrap: wrap;
  /* max-width: ${props => (props.route === 'history' ? 'auto' : '120px')}; */
  justify-content: center;
  align-items: center;
`;
const Coin = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  /* margin: 0 2px; */
  font-weight: 600;
  font-size: 16px;
  line-height: 20.8px;
`;

const Wrap = styled.Text`
  font-weight: 500;
  font-size: 14px;
  line-height: ${() => (Platform.OS === 'android' ? undefined : '18px')};
  color: ${({theme}) => theme.colorV2.text40};
`;

const ConvertImgWrapper = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
`;
const ConvertImg = styled.Image`
  width: 20px;
  height: 20px;
  margin: 0 8px;
  flex-shrink: 0;
`;

// const WrapCountUp = styled(CountUp)`
//   height: 28px;
//   margin: 0 2px;
// `;

const Item = ({item, withAnimation, route}) => {
  const {numberFormat} = useLang();

  return (
    <ItemWrapper>
      {/* <Direction>{item.direction}</Direction> */}
      <CoinIconWrap coin={item.coin} route={route} />
      <CoinWrapper>
        <Wrap>{item.coin ? <CoinCodeToName coin={item.coin} /> : '--'}</Wrap>
        <Coin isFirst={true}>{numberFormat(item.num)}</Coin>
      </CoinWrapper>
    </ItemWrapper>
  );
};
export default ({info, withAnimation = false, route = ''}) => {
  return (
    <Wrapper>
      <Item item={info.from} withAnimation={withAnimation} route={route} />
      <ConvertImgWrapper>
        <ConvertImg source={detailArrowRightImg} />
      </ConvertImgWrapper>
      <Item item={info.to} withAnimation={withAnimation} route={route} />
    </Wrapper>
  );
};
