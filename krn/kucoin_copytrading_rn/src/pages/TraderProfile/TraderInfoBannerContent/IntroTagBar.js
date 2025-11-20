import {useMount} from 'ahooks';
import React, {memo, useState} from 'react';
import {View} from 'react-native';
import {getBaseCurrency} from 'site/tenant';
import {css} from '@emotion/native';
import {ThemeProvider as EThemeProvider} from '@emotion/react';
import {ThemeProvider} from '@krn/ui';

import {TraderProfileTinyExclamationIc} from 'components/Common/SvgIcon';
import TipTrigger from 'components/Common/TipTrigger';
import useLang from 'hooks/useLang';
import {getNativeInfo} from 'utils/helper';
import {InfoTagText, InfoTagTextBox, IntroTagBarScroll} from './styles';

const OnBoardTipTrigger = memo(() => {
  const [theme, setTheme] = useState('');
  const {_t} = useLang();

  useMount(async () => {
    const nativeInfo = await getNativeInfo();
    const {darkMode} = nativeInfo || {};
    setTheme(darkMode ? 'dark' : 'light');
  });

  if (!theme) {
    return null;
  }
  return (
    <ThemeProvider
      defaultTheme={theme}
      EmotionProviderInstance={EThemeProvider}>
      <TipTrigger
        showUnderLine={false}
        showIcon={false}
        title={_t('ce0ab2acb9534000a1a7')}
        message={_t('0f5edf5c57504000a41f', {symbol: getBaseCurrency()})}>
        <InfoTagTextBox>
          <View
            style={css`
              margin-right: 4px;
            `}>
            <TraderProfileTinyExclamationIc />
          </View>
          <InfoTagText>{_t('118a6dc3dcd44000a490')}</InfoTagText>
        </InfoTagTextBox>
      </TipTrigger>
    </ThemeProvider>
  );
});

export const IntroTagBar = ({isMySelf, onLeaderboard, leadDays}) => {
  const {_t} = useLang();
  // 我的带单员主页 && 不在榜单展示
  const isShowOnBoardTag = isMySelf && !onLeaderboard;
  return (
    <IntroTagBarScroll bounces={false}>
      {isShowOnBoardTag && <OnBoardTipTrigger />}

      {!!leadDays && (
        <InfoTagTextBox>
          <InfoTagText>
            {_t('69e77230e66e4000a77d', {
              x: leadDays,
            })}
          </InfoTagText>
        </InfoTagTextBox>
      )}
    </IntroTagBarScroll>
  );
};
