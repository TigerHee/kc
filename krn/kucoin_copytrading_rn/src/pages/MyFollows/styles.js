import styled, {css} from '@emotion/native';

import {commonStyles} from 'constants/styles';

export const MyFollowsPage = styled.SafeAreaView`
  flex-direction: column;
  flex: 1;
  background: ${({theme}) => theme.colorV2.overlay};
`;

export const MyFollowsFlatListWrap = styled.FlatList`
  padding: 0 16px 16px;
  background: ${({theme}) => theme.colorV2.overlay};
`;

export const UserInfoItemWrap = styled.View`
  ${commonStyles.flexRowCenter}
  border-bottom-width: 0.5px;
  border-color: ${({theme}) => theme.colorV2.divider8};
  padding: 16px 0;
`;

export const styles = {
  emptyText: css`
    flex: 1;
  `,
  emptyBox: css`
    margin-top: 80px;
  `,
};

export const Avatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border-width: 0.5px;
  border-color: ${({theme}) => theme.colorV2.divider8};
`;

export const InfoWrap = styled.View`
  flex-direction: column;
  margin-left: 8px;
`;

export const PersonDescText = styled.Text`
  font-size: 14px;
  font-weight: 400;
  line-height: 15.6px;
  color: ${({theme}) => theme.colorV2.text40};
`;

export const FollowBtnIconImg = styled.Image`
  width: 16px;
  height: 16px;
`;

export const TraderName = styled.Text`
  ${commonStyles.textStyle};
  font-weight: 500;
  margin-bottom: 4px;
`;

export const DescLine = styled.View`
  background: ${({theme}) => theme.colorV2.divider8};
  width: 1px;
  height: 8px;
  margin: 0 8px;
`;
