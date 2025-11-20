/**
 * Owner: roger.chen@kupotech.com
 */
import React, {useCallback, useMemo, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from '@emotion/native';
import {TouchableOpacity, SafeAreaView, Platform} from 'react-native';
import Bridge from 'utils/bridge';
import useLang from 'hooks/useLang';
import {
  _getHighLightsContent,
  _onClickTrack,
  _getHighLightsParamsObj,
  _onExpose,
} from 'components/Gembox/config';
import Button from './Button';

const SafeWrapper = styled(SafeAreaView)`
  background: #fff;
`;
const Main = styled.View`
  flex-direction: row;
  align-items: center;
  padding-right: 12px;
  border-style: solid;
  border-top-color: ${({theme}) => theme.color.complementary};
  border-top-width: 2px;
  width: 100%;
  height: 50px;
  background: ${({theme}) => theme.color.background};
`;

const Optional = styled.View`
  width: 90px;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

const OptionalImg = styled.Image`
  width: 24px;
  height: 24px;
`;

const OptionalText = styled.Text`
  width: 100%;
  font-size: 10px;
  line-height: 16px;
  color: ${({theme}) => theme.color.complementary};
  text-align: center;
`;

const BtnView = styled.View`
  flex: 4;
  height: auto;
`;

const FlashBtnView = styled.View`
  flex: 3;
  height: auto;
  margin-right: 8px;
`;
const FlashButtonBox = styled.View`
  width: 100%;
  height: 38px;
  padding: 0 4px;
  background: #737e8d;
  border-style: solid;
  border-width: 1px;
  border-color: ${({theme}) => theme.color.complementary};
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;
const FlashTips = styled.View`
  width: 35px;
  height: 16px;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -1px;
  left: -1px;
  background: #ffb547;
  border-style: solid;
  border-width: 1px;
  border-color: ${({theme}) => theme.color.complementary};
  border-bottom-right-radius: 8px;
  z-index: 1;
`;
const FlashTipText = styled.Text`
  width: 100%;
  height: 100%;
  line-height: ${Platform.OS === 'ios' ? '16px' : '13px'};
  text-align: center;
  font-size: 10px;
  color: ${({theme}) => theme.color.complementary};
`;
const FlashTextWrapper = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
const FlashImg = styled.Image`
  width: 8px;
  height: 16px;
  margin-right: 4px;
`;
const FlashButtonText = styled.Text`
  color: ${({theme}) => theme.color.surface};
  font-size: 14px;
`;

const btnStyle = {
  width: '100%',
  height: 38,
  borderStyle: 'solid',
  borderWidth: 1,
  borderColor: ({theme}) => theme.color.complementary,
  borderBottomLeftRadius: 8,
  borderBottomRightRadius: 8,
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
  alignItems: 'center',
};

const btnTextStyle = {
  fontSize: 16,
};

let _timer = null;
const Bottom = () => {
  const dispatch = useDispatch();
  const {_t} = useLang();
  const [favLoading, setFavLoading] = useState(false);
  const [exposeFlashBtn, setExposeFlashBtn] = useState('');

  const {isLogin} = useSelector(state => state.app) || {};
  const {topOneInfo, isFav, isFlashTrade, changeRate} =
    useSelector(state => state.gembox) || {};
  const {symbolCode, name, heatValue, highLights = []} = topOneInfo || {};

  const allItemContent = useMemo(() => {
    return _getHighLightsContent(highLights);
  }, [highLights]);

  const getHighLightsParams = useMemo(() => {
    return _getHighLightsParamsObj(highLights);
  }, [highLights]);

  const onTrade = useCallback(() => {
    if (!symbolCode) {
      return;
    }
    Bridge.openNative(`/trade?symbol=${symbolCode}`);
    // 点击埋点
    _onClickTrack({
      blockId: 'tradeButton',
      locationId: 1,
      properties: {
        postTitle: name,
        likes: heatValue,
        intervals: changeRate || topOneInfo.changeRate, // 24h涨跌幅
        ...getHighLightsParams,
        allItemContent,
        yesOrNo: isFav,
        clickPosition: 'bottomTrade',
      },
    });
  }, [
    allItemContent,
    changeRate,
    getHighLightsParams,
    heatValue,
    isFav,
    name,
    symbolCode,
    topOneInfo.changeRate,
  ]);

  const onFlash = useCallback(() => {
    if (!symbolCode) {
      return;
    }
    Bridge.openNative(
      `/krn/router?biz=convert&entry=main&component=kucoin_convert_rn&route=${encodeURIComponent(
        `ConvertPage?from=USDT&to=${name}`,
      )}`,
    );
    // 点击埋点
    _onClickTrack({
      blockId: 'tradeButton',
      locationId: 1,
      properties: {
        postTitle: name,
        likes: heatValue,
        intervals: changeRate || topOneInfo.changeRate, // 24h涨跌幅
        ...getHighLightsParams,
        allItemContent,
        yesOrNo: isFav,
        clickPosition: 'bottomConvert',
      },
    });
  }, [
    allItemContent,
    changeRate,
    getHighLightsParams,
    heatValue,
    isFav,
    name,
    symbolCode,
    topOneInfo.changeRate,
  ]);

  useEffect(() => {
    if (
      name &&
      isFlashTrade &&
      isFav !== undefined &&
      name !== exposeFlashBtn
    ) {
      _onExpose({
        blockId: 'tradeButton',
        locationId: 1,
        properties: {
          postTitle: name,
          likes: heatValue,
          intervals: changeRate || topOneInfo.changeRate, // 24h涨跌幅
          ...getHighLightsParams,
          allItemContent,
          yesOrNo: isFav,
          clickPosition: 'bottomConvert',
        },
      });
      setExposeFlashBtn(name);
    }
  }, [
    name,
    isFav,
    isFlashTrade,
    heatValue,
    changeRate,
    allItemContent,
    getHighLightsParams,
    exposeFlashBtn,
    topOneInfo,
  ]);
  const onOptional = useCallback(async () => {
    if (favLoading || !symbolCode) {
      return;
    }
    // 点击埋点
    _onClickTrack({
      blockId: 'favoriteButton',
      locationId: 1,
      properties: {
        postTitle: name,
        likes: heatValue,
        yesOrNo: isFav,
      },
    });
    setFavLoading(true);
    // 触发自选
    try {
      Bridge.favCoin(symbolCode)
        .then(({success}) => {
          if (success) {
            dispatch({
              type: 'gembox/update',
              payload: {isFav: !isFav},
            });
            Bridge.Toast(
              isFav ? _t('cancel.favor.ok') : _t('add.favorites.ok'),
            );
          }
          _timer = setTimeout(() => {
            setFavLoading(false);
          });
        })
        .catch();
    } catch (e) {
      console.error(e);
    }
  }, [_t, dispatch, favLoading, heatValue, isFav, name, symbolCode]);

  useEffect(() => {
    if (symbolCode) {
      // 询问是否已自选
      dispatch({
        type: 'gembox/checkIsFav',
        payload: {symbolCode},
      });
    }
  }, [dispatch, symbolCode, isLogin]);

  useEffect(() => {
    // 退出时清除一下_timer
    return () => {
      _timer && clearTimeout(_timer);
    };
  }, []);

  return (
    <SafeWrapper>
      <Main>
        <TouchableOpacity activeOpacity={0.6} onPress={onOptional}>
          <Optional>
            <OptionalImg
              source={
                isFav
                  ? require('assets/gembox/optionalHas.png')
                  : require('assets/gembox/optional.png')
              }
            />
            <OptionalText numberOfLines={1}>
              {isFav
                ? _t('catRcVkQPGY2g6Nrqdrfkn')
                : _t('ibzGppzw2yzV2FRTdo9sbW')}
            </OptionalText>
          </Optional>
        </TouchableOpacity>
        {isFlashTrade ? (
          <FlashBtnView>
            <TouchableOpacity activeOpacity={0.6} onPress={onFlash}>
              <FlashButtonBox>
                <FlashTips>
                  <FlashTipText>0 Fee</FlashTipText>
                </FlashTips>
                <FlashTextWrapper>
                  <FlashImg source={require('assets/gembox/flash.png')} />
                  <FlashButtonText numberOfLines={1}>
                    {_t('oCr1adi2Ds9poF5GNUm4Dc')}
                  </FlashButtonText>
                </FlashTextWrapper>
              </FlashButtonBox>
            </TouchableOpacity>
          </FlashBtnView>
        ) : null}
        <BtnView>
          <Button
            style={btnStyle}
            textStyle={btnTextStyle}
            disabled={false}
            onPress={onTrade}
            textAttr={{numberOfLines: 1}}>
            {_t('ogHMLaKY3cpaWk794csG6i', {currency: name || ''})}
          </Button>
        </BtnView>
      </Main>
    </SafeWrapper>
  );
};

export default Bottom;
