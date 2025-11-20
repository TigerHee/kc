/**
 * Owner: borden@kupotech.com
 */
import { styled, fx } from '@/style/emotion';
import { FlexColumm } from '@/style/base';

export const ContentWrapper = styled.div`
  height: 100%;
`;

export const ChartContent = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

export const SingleWrapper = styled.div`
  width: 100%;
  height: 100%;
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
    ${(props) => `border-color: ${props.isSingle ? props.theme.colors.cover16 : props.theme.colors.textPrimary} !important;`}
  }
`;

export const EmptyWrapper = styled(FlexColumm)`
  height: 100%;
  ${fx.justifyContent('center')}
  align-items: center;
  color: ${(props) => props.theme.colors.cover8};
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;

  svg {
    width: 118px;
    height: 28px;
    margin-bottom: 4px;
    color: ${(props) => props.theme.colors.cover8};
  }
`;
