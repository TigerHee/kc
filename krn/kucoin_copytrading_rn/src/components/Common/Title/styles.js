import styled, {css} from '@emotion/native';

import {commonStyles} from 'constants/styles';

export const TitleText = styled.Text`
  ${commonStyles.textStyle};
  font-size: 16px;
  line-height: 20.8px;
  margin-right: 2px;
`;

export const styles = {
  container: css`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `,
  titleWrap: css`
    flex-direction: row;
    align-items: center;
  `,
  tips: css`
    font-size: 16px;
  `,
};

export const TitleQAIcon = styled.Image`
  width: 16px;
  height: 16px;
`;
