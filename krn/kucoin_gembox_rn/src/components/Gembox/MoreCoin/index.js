/**
 * Owner: roger.chen@kupotech.com
 */
import React, {useCallback} from 'react';
import {useSelector} from 'react-redux';
import {TouchableOpacity, StyleSheet} from 'react-native';
import styled from '@emotion/native';
import {map} from 'lodash';
import HackAutoWidthText from 'components/Common/HackAutoWidthText';
import HeatPlate from 'components/Gembox/HeatPlate';
import Bridge from 'utils/bridge';
import useLang from 'hooks/useLang';
import {_onClickTrack} from 'components/Gembox/config';

const MoreCoinView = styled.View`
  width: 100%;
  height: auto;
  padding: 16px 16px 12px;
  border: 1px solid ${({theme}) => theme.color.complementary};
  border-bottom-width: 3px;
  border-radius: 14px;
  background: ${({theme}) => theme.color.background};
  margin: 16px 0;
`;

const Top = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 4px;
`;

const Title = styled.Text`
  font-size: 16px;
  line-height: 22px;
  margin-right: 10px;
  color: ${({theme}) => theme.color.complementary};
  text-align: left;
  min-width: 80px;
  height: 22px;
`;

const Desc = styled.Text`
  font-size: 12px;
  line-height: 16px;
  flex-shrink: 1;
  color: ${({theme}) => theme.color.complementary40};
  height: 22px;
  min-width: 120px;
  min-height: 14px;
  text-align: right;
`;

const List = styled.View`
  width: 100%;
  height: auto;
  margin-top: 12px;
`;

const Item = styled.View`
  width: 100%;
  height: auto;
  padding: 10px 0;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ItemLeft = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ItemRight = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CoinLogo = styled.Image`
  width: 24px;
  height: 24px;
`;

const CoinName = styled(HackAutoWidthText)`
  font-size: 16px;
  line-height: 22px;
  color: ${({theme}) => theme.color.complementary};
  margin-left: 12px;
  text-align: left;
  min-width: 52px;
  height: 20px;
`;

const CoinNum = styled.Text`
  width: 38px;
  min-height: 20px;
  font-size: 16px;
  line-height: 22px;
  color: ${({theme}) => theme.color.complementary};
  text-align: right;
`;

const MoreCoin = () => {
  const {_t} = useLang();
  const {hotCoinList, topOneInfo} = useSelector(state => state.gembox);
  const {name: topOneInfoName} = topOneInfo;
  const handleClick = useCallback((symbolCode, name, heatValue, index) => {
    if (!symbolCode) {
      return;
    }
    Bridge.openNative(`/market?symbol=${symbolCode}`);
    // 点击埋点
    _onClickTrack({
      blockId: 'moreCoin',
      locationId: 1,
      properties: {
        postTitle: name,
        likes: heatValue,
        sortPosition: index + 1,
      },
    });
  }, []);

  if (topOneInfoName && hotCoinList.length <= 1) {
    return null;
  }

  return (
    <MoreCoinView>
      {topOneInfoName ? (
        <Top>
          <Title>{_t('4HwUhTHJHDmdr3ewwd9fPq')}</Title>
          <Desc numberOfLines={1}>{_t('sp2UKLKqMDUwc2ziW5J3sV')}</Desc>
        </Top>
      ) : (
        <Top>
          <Title style={styles.skeletonBg} />
          <Desc style={styles.skeletonBg} />
        </Top>
      )}
      {topOneInfoName ? (
        <List>
          {map(hotCoinList, (item, index) => {
            const {iconUrl, name, heatValue, symbolCode} = item || {};
            return (
              <TouchableOpacity
                activeOpacity={0.6}
                key={name}
                onPress={() => {
                  handleClick(symbolCode, name, heatValue, index);
                }}>
                <Item>
                  <ItemLeft>
                    <CoinLogo autoRotateDisable source={{uri: iconUrl}} />
                    <CoinName>{name}</CoinName>
                  </ItemLeft>
                  <ItemRight>
                    <HeatPlate width={13} height={12} hotNum={heatValue} />
                    <CoinNum>{Number(heatValue).toFixed(1)}</CoinNum>
                  </ItemRight>
                </Item>
              </TouchableOpacity>
            );
          })}
        </List>
      ) : (
        <List>
          {map(new Array(5).fill(1), (item, index) => {
            return (
              <Item key={index}>
                <ItemLeft>
                  <CoinLogo source={require('assets/gembox/defaultImg.png')} />
                  <CoinName style={styles.skeletonBg} />
                </ItemLeft>
                <ItemRight>
                  <HeatPlate width={13} height={12} hotNum={0} />
                  <CoinNum style={styles.skeletonBgNumber} />
                </ItemRight>
              </Item>
            );
          })}
        </List>
      )}
    </MoreCoinView>
  );
};
const styles = StyleSheet.create({
  skeletonBg: {
    backgroundColor: 'rgba(0, 20, 42, 0.04)',
    borderRadius: 1,
  },
  skeletonBgNumber: {
    backgroundColor: 'rgba(0, 20, 42, 0.04)',
    borderRadius: 1,
    width: 20,
    marginLeft: 18,
  },
});
export default MoreCoin;
