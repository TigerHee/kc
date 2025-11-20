import React, {memo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {css} from '@emotion/native';
import {ThemeProvider as EThemeProvider} from '@emotion/react';
import {ThemeProvider} from '@krn/ui';

import profileBg from 'assets/trading/profile-banner-bg.png';
import {ProfileEditIc} from 'components/Common/SvgIcon';
import {UserAvatar} from 'components/copyTradeComponents/UserInfo';
import {largeHitSlop} from 'constants/index';
import {RowWrap} from 'constants/styles';
import {useIsMySelf} from '../hooks/useVisibilityHandler';
import FollowerInfoCard from './FollowerInfoCard';
import {IntroTagBar} from './IntroTagBar';
import {
  HeaderContentWrap,
  ProfileUserWrap,
  userInfoStyles,
  UserIntroBox,
  UserNameText,
} from './styles';
import {TopBannerTip} from './TopBannerTip';
import UserDesc from './UserDesc';

const TraderInfoBannerContent = memo(props => {
  const {handleEditMyProfile, summaryData} = props;

  const {
    nickName,
    avatar,
    introduce,
    followersSum,
    followingSum,
    leadDays,
    alreadyCopyTraders,
    status,
    onLeaderboard,
    leadStatus,
  } = summaryData || {};
  // 当前交易员详情是否为本人交易员
  const isMySelf = useIsMySelf();
  return (
    <ThemeProvider defaultTheme="dark" EmotionProviderInstance={EThemeProvider}>
      <HeaderContentWrap source={profileBg} resizeMode="repeat">
        <TopBannerTip status={status} leadStatus={leadStatus} />

        <ProfileUserWrap>
          <UserAvatar
            userInfo={{
              avatarUrl: avatar,
              nickName,
            }}
            styles={userInfoStyles}
          />
          <View
            style={css`
              justify-items: flex-start;
            `}>
            <UserIntroBox>
              <RowWrap>
                <UserNameText numberOfLines={1}>{nickName}</UserNameText>
                {isMySelf && (
                  <TouchableOpacity
                    style={css`
                      margin-left: 8px;
                    `}
                    activeOpacity={0.8}
                    hitSlop={largeHitSlop}
                    onPress={handleEditMyProfile}>
                    <ProfileEditIc />
                  </TouchableOpacity>
                )}
              </RowWrap>
            </UserIntroBox>

            <IntroTagBar
              isMySelf={isMySelf}
              onLeaderboard={onLeaderboard}
              leadDays={leadDays}
            />
          </View>
        </ProfileUserWrap>

        <FollowerInfoCard
          alreadyCopyTraders={alreadyCopyTraders}
          followersSum={followersSum}
          followingSum={followingSum}
        />

        <UserDesc content={introduce} />
      </HeaderContentWrap>
    </ThemeProvider>
  );
});

export default TraderInfoBannerContent;
