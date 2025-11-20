import styled from '@emotion/native';

import {getEnhanceColorByType} from 'utils/color-helper';
import {isAndroid} from 'utils/helper';

export const Container = styled.View`
  width: 100%;
  flex: 1;
`;

export const Title = styled.Text`
  font-size: 14px;
  color: ${({theme}) => theme.colorV2.text40};
  margin-bottom: 8px;
`;

export const OptionWrap = styled.View`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

export const OptionRowWrap = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
  margin-bottom: ${({lastRow}) => (lastRow ? 0 : '8px')};
`;

export const SingleOptionWrap = styled.View`
  margin-right: ${({gap, isRowEnd}) => (isRowEnd ? 0 : gap + 'px')};
  flex: 1;
`;

export const Option = styled.Pressable`
  flex: 1;
  border-radius: 80px;
  align-items: center;
  justify-content: center;
  height: 32px;
  border-style: solid;
  border-width: 1px;

  ${({theme, selected}) => {
    if (selected) {
      //兼容安卓 border 异常 light EDEDED , 1D1D1D
      return `
       border-color: ${theme.colorV2.cover}
      `;
    }
    if (isAndroid) {
      return `
     border-color: ${getEnhanceColorByType(
       theme.type,
       'androidBorderDivider8',
     )};
     `;
    }
    return `
     border-color: ${theme.colorV2.divider8}
     `;
  }};
`;

export const OptionLabel = styled.Text`
  font-size: 14px;
  font-weight: 500;
  line-height: 18.2px;
  color: ${({theme, selected}) =>
    selected ? theme.colorV2.text : theme.colorV2.text60};
`;
