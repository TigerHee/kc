// styles.js
import {css} from '@emotion/native';
const deviceWidth = 375;

export const container = css`
  flex: 1;
  background-color: #151723;
  align-items: center;
  justify-content: center;
`;

export const tabWrapStyle = css`
  flex: 1;
`;

export const tabInnerStyle = css`
  width: 100%;
`;

export const tabActiveOpacity = 1;

export const tabsStyle = css`
  height: 40px;
  background-color: #151723;
`;

export const tabStyle = css`
  background-color: #151723;
  border-bottom-color: #22242f;
  border-bottom-width: 0.5px;
  width: ${deviceWidth / 4}px;
`;

export const tabUnderlineStyle = css`
  background-color: #fbd45d;
  top: 37px;
  height: 3px;
`;

export const textStyle = css`
  color: #787a84;
  font-size: 14px;
`;

export const textActiveStyle = css`
  color: #ffffff;
`;
