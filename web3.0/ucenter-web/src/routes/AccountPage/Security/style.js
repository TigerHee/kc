/**
 * Owner: willen@kupotech.com
 */
import { styled } from '@kux/mui';

export const WithMinHeight = styled.div`
  min-height: 680px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    min-height: unset;
    padding-bottom: 56px;
  }
`;

export const Wrapper = styled.div`
  max-width: 560px;
  margin: 26px auto 88px auto;
  height: auto;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 24px 16px 88px 16px;
  }

  [dir='rtl'] & {
    .KuxAlert-icon {
      padding-right: unset;
      padding-left: 8px;
    }
  }
`;

export const StyledTitle = styled.h1`
  color: ${(props) => props.theme.colors.text};
  font-size: 36px;
  font-style: normal;
  font-weight: 600;
  padding: 0;
  margin: 0 0 16px 0;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 24px;
  }
`;

export const AlertContent = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 4px;
  line-height: 150%;
`;
