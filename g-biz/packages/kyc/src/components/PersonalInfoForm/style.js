/**
 * Owner: tiger@kupotech.com
 */
import { styled, Button } from '@kux/mui';

export const Wrapper = styled.div`
  width: 100%;
`;
export const NameWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  @media screen and (max-width: 767px) {
    display: block;
  }
`;
export const Name = styled.div`
  width: calc((100% - 16px) / 2);

  @media screen and (max-width: 767px) {
    width: 100%;
  }
`;
export const FormWrapper = styled.div`
  height: 500px;
  overflow-x: hidden;
  overflow-y: auto;
  &.needPadding {
    padding-top: 24px;
  }
  .KuxDatePicker-wrapper {
    width: 100%;
  }
  &::-webkit-scrollbar {
    width: 6px;
    background-color: ${({ theme }) => theme.colors.background};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.icon40};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: ${({ theme }) => theme.colors.background};
    border-radius: 4px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    max-height: calc(100% - 80px);
    height: auto;
    margin-bottom: 50px;
    margin-right: 0px;
    & > form {
      margin-right: 0px;
    }
    &::-webkit-scrollbar {
      width: 0 !important;
    }
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
  }
`;
export const FormTitle = styled.h3`
  font-weight: 600;
  font-size: 16px;
  line-height: 130%;
  margin-bottom: 24px;
  color: ${(props) => props.theme.colors.text};
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 8px;
  }
`;
export const FormTitle2 = styled.h3`
  font-weight: 700;
  font-size: 24px;
  line-height: 130%;
  margin-bottom: 32px;
  color: ${(props) => props.theme.colors.text};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 16px;
    margin-bottom: 24px;
  }
`;
export const FormItemWrapper = styled.div`
  margin-bottom: 8px;
`;
export const BtnWrapper = styled.div`
  padding: 20px 32px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  background-color: ${(props) => props.theme.colors.overlay};
  border-top: 1px solid ${(props) => props.theme.colors.divider8};
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 20px 16px;
  }
`;
export const PreButton = styled(Button)`
  color: ${(props) => props.theme.colors.text60};
  margin-right: 24px;
`;
export const StateLabel = styled.div`
  display: inline-flex;
  align-items: center;
  width: 100%;
  direction: ltr;
`;
export const StateLabelText = styled.span``;
export const Restricted = styled.p`
  color: ${(props) => props.theme.colors.text60};
  background: ${(props) => props.theme.colors.cover4};
  border-radius: 4px;
  margin-left: 8px;
  padding: 2px 6px;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
`;
