import React, {memo} from 'react';
import {View} from 'react-native';
import styled, {css} from '@emotion/native';

import copyPanelFirstImg from 'assets/help/2-1.png';
import darkCopyPanelFirstImg from 'assets/help/2-1-dark.png';
import copyPanelThirdImg from 'assets/help/3-3.png';
import copyPanelFourthImg from 'assets/help/3-4.png';
import copyPanelFifthImg from 'assets/help/3-5.png';
import copyPanelSixthImg from 'assets/help/3-6.png';
import darkCopyPanelSixthImg from 'assets/help/3-6-dark.png';
import {useIsLight} from 'hooks/useIsLight';
import useLang from 'hooks/useLang';
import {ContentImage} from './components/ContentImage';
import {Panel} from './components/Panel';
import {PrefixPointWrap} from './components/PrefixPointWrap';
import {CopyPanelContentFragmentMap, CopySetParamIntro} from './constant';
import {BaseText, ContentTitle, Text60} from './styles';

const StyledContentTitle = styled(ContentTitle)`
  margin-bottom: 16px;
`;

const StyledBaseText = styled(BaseText)`
  margin-bottom: 12px;
`;

const {copyFoundFilterTip, copyAttentionFragment} = CopyPanelContentFragmentMap;
const CopyRolePanel = () => {
  const {_t} = useLang();
  const isLight = useIsLight();
  return (
    <Panel>
      <StyledContentTitle>{_t('22a7035191bc4000a3a9')}</StyledContentTitle>

      <StyledBaseText>{_t('6acfb31906e44000a8e4')}</StyledBaseText>
      <StyledBaseText>{_t('9dbbfa313ecb4000ad63')}</StyledBaseText>
      <ContentImage
        width={343}
        height={129}
        source={isLight ? copyPanelFirstImg : darkCopyPanelFirstImg}
        hiddenPaddingColor
        style={css`
          margin-bottom: 16px;
        `}
      />

      <StyledBaseText>{_t('13c19c2b334f4000a7fc')}</StyledBaseText>

      {copyFoundFilterTip.map(key => (
        <PrefixPointWrap key={key}>
          <Text60>{_t(key)}</Text60>
        </PrefixPointWrap>
      ))}
      <ContentImage
        width={343}
        height={257}
        style={css`
          margin: 12px 0 16px;
        `}
        source={copyPanelThirdImg}
      />

      <BaseText>{_t('12b622da81544000a761')}</BaseText>

      <PrefixPointWrap
        isBlack
        style={css`
          margin: 12px 0;
          width: 100%;
        `}>
        <View>
          <BaseText>{_t('be17bfe060d54000a580')}</BaseText>
          <Text60>{_t('c835f8b8f0154000a451')}</Text60>
        </View>
      </PrefixPointWrap>

      <ContentImage
        width={343}
        height={211}
        style={css`
          margin-bottom: 12px;
        `}
        source={copyPanelFourthImg}
      />

      <PrefixPointWrap
        isBlack
        style={css`
          margin: 12px 0;
        `}>
        <View>
          <BaseText>{_t('be17bfe060d54000a580')}</BaseText>
          <Text60>{_t('6dd0ec8f5abf4000a29a')}</Text60>
        </View>
      </PrefixPointWrap>
      <ContentImage
        width={343}
        height={321}
        style={css`
          margin-bottom: 12px;
        `}
        source={copyPanelFifthImg}
      />
      {CopySetParamIntro.map(({title, desc}) => (
        <PrefixPointWrap
          isBlack
          style={css`
            margin-bottom: 12px;
          `}
          key={title}>
          <View>
            <BaseText>{_t(title)}</BaseText>
            {desc.map(key => (
              <Text60 key={key}>{_t(key)}</Text60>
            ))}
          </View>
        </PrefixPointWrap>
      ))}
      <StyledBaseText>{_t('862a2a04b3304000a299')}</StyledBaseText>
      {copyAttentionFragment.map(({text, hasPrefixPoint}) =>
        hasPrefixPoint ? (
          <PrefixPointWrap key={text}>
            <Text60>{_t(text)}</Text60>
          </PrefixPointWrap>
        ) : (
          <Text60 key={text}>{_t(text)}</Text60>
        ),
      )}

      <StyledContentTitle
        style={css`
          margin-top: 24px;
        `}>
        {_t('22a7035191bc4000a3a9')}
      </StyledContentTitle>
      <StyledBaseText>{_t('f86f71fc732b4000a6df')}</StyledBaseText>
      <ContentImage
        width={343}
        height={184}
        style={css`
          margin-bottom: 16px;
          border-radius: 15px;
        `}
        source={isLight ? copyPanelSixthImg : darkCopyPanelSixthImg}
        hiddenPaddingColor
      />

      <StyledBaseText>{_t('72e1bbb65fcd4000acb9')}</StyledBaseText>
      <StyledBaseText>{_t('668bab85e3b14000aaa2')}</StyledBaseText>
    </Panel>
  );
};

export default memo(CopyRolePanel);
