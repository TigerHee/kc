/**
 * Owner: roger.chen@kupotech.com
 */
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import styled from '@emotion/native';
import {useSelector} from 'react-redux';
import {useTheme} from '@krn/ui';
import {TAB_MAP, DEFAULT_PERCENT} from './config';
import useLang from 'hooks/useLang';
import {_onClickTrack} from 'components/Gembox/config';

const TabView = styled.View`
  width: 100%;
  height: 54px;
  flex-direction: row;
  align-items: flex-end;
`;
const TextWrapper = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const BgTop = styled.View`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.24);
`;
const BgBottom = styled.View`
  width: 100%;
  height: 4px;
  background: rgba(0, 0, 0, 0.1);
`;
const TabBtn = styled.View`
  height: 44px;
  align-items: center;
  flex-shrink: 1;
  flex-basis: 0%;
  justify-content: space-between;
`;

const TabText = styled.Text`
  font-size: 12px;
  color: #ffffff;
  line-height: 14px;
`;

const PercentText = styled.Text`
  font-size: 12px;
`;

const Tab = props => {
  const {isRTL} = useTheme();
  const {_t} = useLang();
  const {onChange, activeStatus} = props;
  const {topOneInfo, tabMap} = useSelector(state => state.gembox) || {};
  const {name} = topOneInfo;
  const [buyPercent, setBuyPercent] = useState(DEFAULT_PERCENT);
  const [sellPercent, setSellPercent] = useState(100 - DEFAULT_PERCENT);
  const [isInit, setIsInit] = useState(true);

  const initActiveTap = useCallback(
    (_buyPercent, _sellPercent) => {
      // 默认值是 buyPercent 更大，未初始状态且sellPercent更大才执行一次
      if (isInit && _sellPercent > _buyPercent) {
        onChange(_buyPercent >= _sellPercent ? TAB_MAP.buy : TAB_MAP.sell);
        setIsInit(false);
      }
    },
    [isInit, onChange],
  );

  const onTabChange = useCallback(
    (val, percent) => {
      onChange(val);
      // 点击埋点
      _onClickTrack({
        blockId: val === TAB_MAP.buy ? 'buyBlock' : 'sellBlock',
        locationId: 1,
        properties: {
          allItemAmount: percent / 100,
        },
      });
    },
    [onChange],
  );
  useEffect(() => {
    const {param = ''} =
      tabMap.filter(i => i.tradeDirection === TAB_MAP.buy)[0] || {};
    const {param: sellParam = ''} =
      tabMap.filter(i => i.tradeDirection === TAB_MAP.sell)[0] || {};
    const number = param.split('%')[0] || DEFAULT_PERCENT;
    const sellNumber = sellParam.split('%')[0] || 100 - DEFAULT_PERCENT;
    const _buyPercent = Number(number);
    const _sellPercent = Number(sellNumber);
    setBuyPercent(_buyPercent);
    setSellPercent(_sellPercent);
    initActiveTap(_buyPercent, _sellPercent);
  }, [initActiveTap, tabMap]);
  return (
    <TabView>
      <TabBtn
        style={[
          styles.TabBuyBtn,
          activeStatus === TAB_MAP.buy ? styles.TabBtnActive : null,
          {
            flexGrow: buyPercent > 85 ? 85 : buyPercent < 15 ? 15 : buyPercent,
          },
        ]}>
        <BgTop />
        {name ? (
          <TouchableOpacity
            style={styles.TextWrapper}
            activeOpacity={0.6}
            onPress={() => onTabChange(TAB_MAP.buy, buyPercent)}>
            {activeStatus === TAB_MAP.buy ? (
              <TextWrapper>
                {isRTL ? (
                  <TabText style={styles.TabTextActiveTop} numberOfLines={1}>
                    <PercentText>%</PercentText>
                    {buyPercent}
                  </TabText>
                ) : (
                  <TabText style={styles.TabTextActiveTop} numberOfLines={1}>
                    {buyPercent}
                    <PercentText>%</PercentText>
                  </TabText>
                )}
                <TabText style={styles.TabTextActiveBottom} numberOfLines={1}>
                  {buyPercent >= sellPercent
                    ? _t('uxVYfQgQFCcjxHePyEfrVA')
                    : _t('nRaepbPTi7m2tUArCVg6QL')}
                </TabText>
              </TextWrapper>
            ) : (
              <TextWrapper>
                {isRTL ? (
                  <TabText numberOfLines={1}>
                    <PercentText>%</PercentText>
                    {buyPercent}
                  </TabText>
                ) : (
                  <TabText numberOfLines={1}>
                    {buyPercent}
                    <PercentText>%</PercentText>
                  </TabText>
                )}

                <TabText numberOfLines={1}>
                  {buyPercent >= sellPercent
                    ? _t('uxVYfQgQFCcjxHePyEfrVA')
                    : _t('nRaepbPTi7m2tUArCVg6QL')}
                </TabText>
              </TextWrapper>
            )}
          </TouchableOpacity>
        ) : (
          <TextWrapper />
        )}
        <BgBottom />
      </TabBtn>
      <TabBtn
        style={[
          styles.TabSellBtn,
          activeStatus === TAB_MAP.sell ? styles.TabBtnActive : null,
          {
            flexGrow:
              sellPercent > 85 ? 85 : sellPercent < 15 ? 15 : sellPercent,
          },
        ]}>
        <BgTop />
        {name ? (
          <TouchableOpacity
            style={styles.TextWrapper}
            activeOpacity={0.6}
            onPress={() => onTabChange(TAB_MAP.sell, sellPercent)}>
            {activeStatus === TAB_MAP.sell ? (
              <TextWrapper>
                {isRTL ? (
                  <TabText style={styles.TabTextActiveTop} numberOfLines={1}>
                    <PercentText>%</PercentText>
                    {sellPercent}
                  </TabText>
                ) : (
                  <TabText style={styles.TabTextActiveTop} numberOfLines={1}>
                    {sellPercent}
                    <PercentText>%</PercentText>
                  </TabText>
                )}

                <TabText style={styles.TabTextActiveBottom} numberOfLines={1}>
                  {buyPercent >= sellPercent
                    ? _t('qV2W6zfyAWwTASvYqaaXnU')
                    : _t('1E1bsJL4WdsoiTAUyXtBm9')}
                </TabText>
              </TextWrapper>
            ) : (
              <TextWrapper>
                {isRTL ? (
                  <TabText numberOfLines={1}>
                    <PercentText>%</PercentText>
                    {sellPercent}
                  </TabText>
                ) : (
                  <TabText numberOfLines={1}>
                    {sellPercent}
                    <PercentText>%</PercentText>
                  </TabText>
                )}

                <TabText numberOfLines={1}>
                  {buyPercent >= sellPercent
                    ? _t('qV2W6zfyAWwTASvYqaaXnU')
                    : _t('1E1bsJL4WdsoiTAUyXtBm9')}
                </TabText>
              </TextWrapper>
            )}
          </TouchableOpacity>
        ) : (
          <TextWrapper />
        )}
        <BgBottom />
      </TabBtn>
    </TabView>
  );
};
const styles = StyleSheet.create({
  TabBtnActive: {
    height: 52,
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#00142a',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  TextWrapper: {
    width: '100%',
    flex: 1,
  },
  TabBuyBtn: {
    flexGrow: 3,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#00142a',
    borderTopLeftRadius: 10,
    borderRightWidth: 0,
    backgroundColor: '#21c397',
  },
  TabSellBtn: {
    flexGrow: 2,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#00142a',
    borderTopRightRadius: 10,
    borderLeftWidth: 0,
    flex: 1,
    backgroundColor: '#ed6666',
  },
  TabTextActiveTop: {
    fontSize: 18,
    color: '#00142A',
    fontWeight: 'bold',
    lineHeight: 18,
  },
  TabTextActiveBottom: {
    fontSize: 12,
    color: '#00142A',
  },
});
export default Tab;
