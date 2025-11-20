import React, {memo, useCallback} from 'react';
import {TouchableWithoutFeedback, View} from 'react-native';
import {useSelector} from 'react-redux';
import {css} from '@emotion/native';
import {useTheme} from '@krn/ui';

import {ArrowRightIcon} from 'components/Common/SvgIcon';
import {RouterNameMap} from 'constants/router-name-map';
import {RowWrap} from 'constants/styles';
import useLang from 'hooks/useLang';
import {usePush} from 'hooks/usePush';
import useTracker from 'hooks/useTracker';
import {ApplyTraderBannerWrap, ContentText, ContentTitle} from './styles';

export const ApplyTraderBanner = memo(() => {
  const {push} = usePush();
  const {colorV2} = useTheme();

  const {_t} = useLang();
  const isLeadTrader = useSelector(state => state.leadInfo.isLeadTrader);

  const {onClickTrack} = useTracker();

  const gotoApplyTrader = useCallback(() => {
    onClickTrack({
      blockId: 'banner',
      locationId: 'applyEntry',
    });

    if (isLeadTrader) {
      push(RouterNameMap.ApplySuccessResult);
      return;
    }
    push(RouterNameMap.ApplyTrader);
  }, [isLeadTrader, onClickTrack, push]);

  return (
    <TouchableWithoutFeedback onPress={gotoApplyTrader}>
      <ApplyTraderBannerWrap>
        <RowWrap
          style={css`
            flex: 1;
          `}>
          <View
            style={css`
              flex: 1;
              margin-right: 8px;
            `}>
            <ContentTitle numberOfLines={2}>
              {_t('8c0a4b17e4ad4000aa86')}
            </ContentTitle>
            <ContentText numberOfLines={2}>
              {_t('604cdb41d81e4000a0c4')}
            </ContentText>
          </View>
        </RowWrap>
        <ArrowRightIcon sizeNumber={16} color={colorV2.icon60} />
        {/* <LongArrowRightI con opacity={1} color={colorV2.text} /> */}
      </ApplyTraderBannerWrap>
    </TouchableWithoutFeedback>
  );
});
