import {css} from '@emotion/native';

const textStyle = props => css`
  font-size: 16px;
  color: ${props.theme.colorV2.text};
  font-weight: 600;
  line-height: 20.8px;
`;

const titleStyle = props => css`
  font-size: 18px;
  color: ${props.theme.colorV2.text};
  font-weight: 600;
  line-height: 23.4px;
`;

const textSecondaryStyle = props => css`
  font-size: 12px;
  color: ${props.theme.colorV2.text40};
  font-weight: 400;
`;

const flexRowCenter = css`
  flex-direction: row;
  align-items: center;
`;

const justifyBetween = css`
  justify-content: space-between;
`;

//TODO: 拆分成 commonMixinStyle 和 commonCss
export const commonStyles = {
  textStyle,
  textSecondaryStyle,
  titleStyle,
  flexRowCenter,
  justifyBetween,
};
