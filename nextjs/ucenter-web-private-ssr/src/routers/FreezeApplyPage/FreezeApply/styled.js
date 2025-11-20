/**
 * Owner: willen@kupotech.com
 */

import { css, styled } from '@kux/mui';

export const SpanTitle = styled.span`
  text-align: left;
  ${(props) => props.theme.breakpoints.down('sm')} {
    line-height: 150%;
  }
`;

export const Title = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
  font-size: 36px;
  line-height: 44px;
  margin-bottom: 16px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 24px;
  }
`;

export const Confirm = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
  font-size: 20px;
  line-height: 32px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 16px;
    line-height: 130%;
  }
`;

export const Remind = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
  font-size: 14px;
  padding: 32px 36px;
  margin-top: 40px;
  border-radius: 16px;
  border: 1px solid;
  border-color: ${(props) => props.theme.colors.cover8};
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 16px;
    padding: 24px 20px;
  }
`;

export const checkStyle = css`
  margin-top: 40px;
  padding-left: 3px;
`;

export const CodeError = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  .icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    color: red;
  }
`;

export const ContainerWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  background: ${(props) => props.theme.colors.overlay};
  transition: padding 0.3s;
  [dir='rtl'] & {
    .KuxAlert-icon {
      padding-right: unset;
      padding-left: 8px;
    }
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 580px;
  margin: 26px auto 88px auto;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0px 16px 88px 16px;
  }
`;

export const Tiplist = styled.ul`
  margin-top: 20px;
  color: ${(props) => props.theme.colors.text60};
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  list-style-type: disc;
  padding-left: 14px;
  li {
    margin-bottom: 14px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export const FailedIcon = styled.img`
  width: 180px;
  height: 180px;
`;

export const FailedText = styled.div`
  margin-top: 24px;
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
  font-size: 18px;
  line-height: 30px;
`;

export const AlertWrapper = styled.div`
  margin-top: 12px;
`;

export const freezeSubStyle = css`
  padding: 4px 0 8px;
  & > label {
    margin-bottom: 8px;
    line-height: 0;
  }
`;

export const Desc = styled.div`
  color: ${(props) => props.theme.colors.text60};
  font-size: 14px;
  line-height: 150%;
`;

export const PositionCont = styled.div`
  width: 100%;
  padding: 4px 0;
  border: 0.6px solid;
  border-color: ${(props) => props.theme.colors.cover8};
  border-radius: 16px;
  margin-top: 24px;
`;

export const PositionItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 20px;
  padding: 20px 0;
  border-bottom: 1px solid;
  border-color: ${(props) => props.theme.colors.cover8};
  &:last-of-type {
    border-bottom: none;
  }
`;

export const PositionTitle = styled.div`
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 16px;
  line-height: 21px;
`;

export const PositionRow = styled.div`
  color: ${(props) => props.theme.colors.text60};
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  span {
    margin-right: 20px;
  }
`;

export const RemindTitle = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
  font-size: 12px;
  line-height: 22px;
  border-radius: 2px;
`;

export const Btn = styled.span`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.text60};
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  cursor: pointer;
  img {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
`;

export const FlexBox = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
