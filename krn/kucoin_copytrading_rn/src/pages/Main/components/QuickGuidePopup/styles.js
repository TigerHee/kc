import styled, {css} from '@emotion/native';

export const PopupTitle = styled.Text`
  margin: 24px 0 0 16px;
  color: ${({theme}) => theme.colorV2.text};
  font-size: 20px;
  font-weight: 600;
  line-height: 26px;
  flex-shrink: 1;
`;

export const ContentTitle = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  flex-shrink: 1;
`;

export const ContentSubTitle = styled(ContentTitle)`
  font-size: 14px;
  font-weight: 700;
  line-height: 18.2px;
`;

// 公共基础样式
export const BaseText = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 14px;
  line-height: 21px;
  flex-shrink: 1;
`;

export const BoldText = styled(BaseText)`
  font-weight: 500;
`;

export const Text60 = styled(BaseText)`
  color: ${({theme}) => theme.colorV2.text60};
`;

export const BoldText60 = styled(Text60)`
  font-weight: 500;
`;

export const makeCustomScrollableTabStyles = colorV2 => {
  return {
    tabWrapStyle: css`
      background: ${colorV2.layer};
    `,
    tabsStyle: css`
      background: ${colorV2.layer};
      border-top-width: 0;
    `,
  };
};
