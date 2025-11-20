import styled, {css} from '@emotion/native';

import {commonStyles} from 'constants/styles';

export const SearchPage = styled.SafeAreaView`
  width: 100%;
  flex-direction: column;
  flex: 1;
  // 夜间模式与 input-search bg统一 使用overlay
  background: ${({theme}) => theme.colorV2.overlay};
`;

export const TraderOverviewItemWrap = styled.Pressable`
  ${commonStyles.flexRowCenter}
  border-bottom-width: 0.5px;
  border-color: ${({theme}) => theme.colorV2.divider8};
  padding: 16px 0;
`;

export const PrefixImg = styled.Image`
  width: 16px;
  height: 16px;
  margin-right: 4px;
`;

export const Cancel = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 14px;
  font-weight: 400;
  line-height: 18.2px;
  margin-left: 12px;
`;

export const userInfoStyles = {
  avatar: css`
    width: 32px;
    height: 32px;
    border-radius: 32px;
  `,
  avatarText: css`
    font-size: 13px;
    line-height: 19.5px;
  `,
  avatarTextBox: css`
    width: 32px;
    height: 32px;
    border-radius: 32px;
  `,
};

export const InfoWrap = styled.View`
  flex-direction: column;
  margin-left: 8px;
`;

export const ExistPersonText = styled.Text`
  font-size: 12px;
  color: ${({theme}) => theme.colorV2.text};
  font-weight: 400;
  line-height: 15.6px;
`;

export const TraderInfoUserIconWrap = styled.View`
  margin-right: 4px;
`;

export const AllPersonText = styled(ExistPersonText)`
  color: ${({theme}) => theme.colorV2.text40};
`;

export const TraderName = styled.Text`
  font-weight: 500;
  color: ${({theme}) => theme.colorV2.text};
  font-size: 14px;
  line-height: 18.2px;
  margin-bottom: 2px;
`;

export const SearchIconWrap = styled.View`
  margin-right: 4px;
`;
