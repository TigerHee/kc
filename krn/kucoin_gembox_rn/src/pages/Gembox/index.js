/**
 * Owner: roger.chen@kupotech.com
 */
import React, {useEffect, useCallback} from 'react';
import {TouchableWithoutFeedback, Image} from 'react-native';
import {onPageExpose} from 'utils/tracker';
import Header from 'components/Gembox/Header';
import styled from '@emotion/native';
import Gembox from 'components/Gembox';
import {pageId, _onClickTrack} from 'components/Gembox/config';
import useLang from 'hooks/useLang';
import {openNative} from '@krn/bridge';
import {getNativeInfo} from 'utils/helper';

const GemboxPageView = styled.View`
  flex: 1;
`;
const GemboxBG = styled.ImageBackground`
  flex: 1;
  resize-mode: cover;
`;
const RightIconWrapper = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: flex-end;
`;
const RightIcon = styled(Image)`
  width: 24px;
  height: 24px;
`;

const GemboxPage = () => {
  const {_t} = useLang();
  const goFaqPage = useCallback(async () => {
    const {webApiHost} = await getNativeInfo();
    openNative(`https://${webApiHost}/support/24393753068057`);
    // 点击埋点
    _onClickTrack({
      blockId: 'gemboxDetail',
      locationId: 1,
    });
  }, []);

  useEffect(() => {
    onPageExpose({pageId});
  }, []);

  return (
    <GemboxBG source={require('assets/gembox/fullBG.png')}>
      <GemboxPageView>
        <Header
          title={_t('oRFVcjZqSc3kVtM8HRSzkP')}
          rightSlot={
            <TouchableWithoutFeedback onPress={goFaqPage}>
              <RightIconWrapper>
                <RightIcon source={require('assets/gembox/questionMark.png')} />
              </RightIconWrapper>
            </TouchableWithoutFeedback>
          }
        />
        <Gembox />
      </GemboxPageView>
    </GemboxBG>
  );
};

export default GemboxPage;
