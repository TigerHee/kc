/**
 * Owner: roger@kupotech.com
 */
import { styled, Input } from '@kux/mui';

const SearchWrapper = styled.div`
  margin-left: 20px;
  [dir='rtl'] & {
    margin-right: 20px;
  }
`;

const H5Wrapper = styled.div`
  margin: 0 12px;
  padding: 0 16px;
  height: 48px;
  display: flex;
  align-items: center;
  z-index: 1;
  border-radius: 24px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 16px;
    margin: 0 6px;
  }
  border: ${(props) => (props.inSearch ? 'unset' : `1px solid ${props.theme.colors.divider8}`)};
  ${(props) =>
    props.inSearch &&
    `
      height: calc(100% - 80px);
      width: calc(100% - 24px);
      position: absolute;
      flex-direction: column;
      padding: 0 20px;
      border: 0;
      top: 80px;
      left: 0;
      background-color: ${props.theme.colors.layer};
  `}
`;

const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: unset;
  .KuxInput-root {
    flex: 1;
    padding: 0px;
    background: transparent;
    input {
      font-size: 16px;
      line-height: 130%;
    }
  }
`;

const HeaderCloseWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border: 2px solid ${(props) => props.theme.colors.cover8};
  border-radius: 100%;
  cursor: pointer;
`;

const CusInput = styled(Input)`
  width: 150px;
  border-radius: 24px;
  background: ${(props) => props.theme.colors.cover4};
  border: ${(props) => (props.inSearch ? `1px solid ${props.theme.colors.divider8}` : 'unset')};
  margin-right: ${(props) => props.inSearch && '16px'};
  padding: ${(props) => props.inSearch && '0 16px !important'};
  height: ${(props) => props.inSearch && '48px !important'};
  .KuxInput-prefix {
    margin-right: 6px !important;
    [dir='rtl'] & {
      margin-right: unset !important;
      margin-left: 6px !important;
    }
  }
  fieldset {
    border: none;
  }
`;

const Divider = styled.span`
  width: 1px;
  height: 20px;
  background-color: ${(props) => props.theme.colors.divider8};
  margin: 0 16px;
`;

const CancelSpan = styled.span`
  font-weight: 500;
  font-size: 16px;
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
  flex-shrink: 0;
`;
const Content = styled.div`
  width: 100%;
  flex: 1;
  padding-bottom: 20px;
  z-index: 1;
  background-color: ${(props) => props.theme.colors.layer};
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const InSearchWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export {
  SearchWrapper,
  H5Wrapper,
  Divider,
  CancelSpan,
  Content,
  CusInput,
  InputWrapper,
  HeaderCloseWrapper,
  InSearchWrapper,
};
