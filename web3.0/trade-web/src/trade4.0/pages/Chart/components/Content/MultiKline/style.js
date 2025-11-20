/**
 * Owner: borden@kupotech.com
 */
import { styled, fx } from '@/style/emotion';
import { FlexColumm } from '@/style/base';

export const ContentWrapper = styled.div`
  height: calc(100% - 33px);
`;

export const ChartContent = styled.div`
  width: 100%;
  height: 100%;
  display: relative;
`;

export const MultiWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
`;

export const MultiItem = styled.div`
  width: 50%;
  height: 50%;
  border: 1px solid;
  ${(props) => `border-color: ${props.theme.colors.overlay};`}

  &.border0 {
    ${(props) => `
    border-right-color: ${props.theme.colors.divider8};
    border-bottom-color: ${props.theme.colors.divider8};
    `}
  }

  &.border1 {
    ${(props) => `
    border-left-color: ${props.theme.colors.divider8};
    border-bottom-color: ${props.theme.colors.divider8};
    `}
  }

  &.border2 {
    ${(props) => `
    border-right-color: ${props.theme.colors.divider8};
    border-top-color: ${props.theme.colors.divider8};
    `}
  }

  &.border3 {
    ${(props) => `
    border-left-color: ${props.theme.colors.divider8};
    border-top-color: ${props.theme.colors.divider8};
    `}
  }

  &.active {
    ${(props) => `border-color: ${props.theme.colors.textPrimary} !important;`}
  }
`;

export const EmptyWrapper = styled(FlexColumm)`
  height: 100%;
  ${fx.justifyContent('center')}
`;
