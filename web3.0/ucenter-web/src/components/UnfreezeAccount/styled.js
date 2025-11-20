/**
 * Owner: willen@kupotech.com
 */

import { css, styled } from '@kux/mui';

export const ContainerWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  width: 100vw;
  min-height: calc(100vh - 80px);
  padding: 120px 24px 0 24px;
  background: ${(props) => props.theme.colors.overlay};
  transition: padding 0.3s;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 60px 16px 0 16px;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 790px;
`;

export const Text = styled.div`
  margin-top: 12px;
  width: 100%;
  color: ${(props) => props.theme.colors.text60};
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  text-align: center;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 8px;
  }
  span > span {
    margin: 0 4px;
    color: ${(props) => props.theme.colors.text};
  }
`;

export const link = css`
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
  font-size: 14px;
  text-decoration: underline;
  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

export const SubDesc = styled.div`
  text-align: center;
  margin-top: 16px;
  p {
    margin: 0 0 2px;
    color: ${(props) => props.theme.colors.text60};
    font-size: 14px;
  }
`;

export const FreezIcon = styled.div`
  width: 160px;
  height: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 140px;
    height: 140px;
  }
`;
