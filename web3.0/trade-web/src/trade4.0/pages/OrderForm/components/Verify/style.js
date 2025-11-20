/**
 * Owner: borden@kupotech.com
 */
import styled from '@emotion/styled';

export const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  .KuxAlert-root {
    border-radius: 0;
    padding: 9px 16px;
  }
`;
export const AlertTitle = styled.span`
  font-weight: 500;
  font-size: 12px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
`;
export const PwdTitle = styled.div`
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  font-size: ${props => (props.isSimple ? 12 : 16)}px;
  font-weight: ${props => (props.isSimple ? 400 : 500)};
`;

export const Content = styled.div`
  margin: 0 auto;
  max-width: 400px;
  padding: ${(props) =>
    (props.isModal ? '0px' : props.isSimple ? '0px 38px 12px 38px' : '24px 12px 0 12px')};
`;
export const Description = styled.div`
  display: flex;
  font-size: 12px;
  line-height: 130%;
  align-items: center;
  color: ${(props) => props.theme.colors.text40};
  ${(props) => {
    if (!props.isSimple) {
      return `
        margin-top: 16px;
        margin-bottom: 12px;
      `;
    }
  }}
`;
export const Info = styled.div`
  margin-right: 24px;
  flex: 1;
  white-space: normal;
  overflow: hidden;
  word-wrap: break-word;
`;
export const ForgotPassword = styled.div`
  margin-top: 12px;
  a {
    font-size: 12px;
    line-height: 16px;
    display: block;
    color: ${props => props.theme.colors.text40};
    &:hover {
      color: ${props => props.theme.colors.primary};
    }
  }
`;
export const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0px 8px 0px;
`;

export const PwdError = styled.div`
  padding-top: 12px;
  text-align: left;
  color: ${(props) => props.theme.colors.secondary};
`;
