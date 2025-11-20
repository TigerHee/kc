/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Input, styled } from '@kux/mui';

export const FormItemLabel = styled.div`
  [dir='rtl'] & {
    text-align: left;
  }
`;

export const FormItemTipWrapper = styled.div`
  display: inline-block;
  height: 16px;
  margin-top: 4px;
  line-height: 130%;
  width: 100%;
  /* padding-left: 16px; */
  ${(props) => props.theme.breakpoints.down('sm')} {
    display: inline-block;
    width: 100%;
    height: auto;
  }
  .voiceCodeText {
    color: ${({ theme }) => theme.colors.text};
    font-size: 12px !important;
  }
  .voiceCodeBox {
    display: inline;
  }
`;

export const FormItemTipText = styled.span`
  display: inline;
  color: ${(props) => props.theme.colors.text60};
  font-size: 12px;
  width: auto;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  b {
    color: ${(props) => props.theme.colors.text};
  }
`;

export const SuffixButton = styled.span`
  color: ${(props) => props.theme.colors.primary};
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  column-gap: 4px;
  cursor: pointer;
`;

const CompatibleInput = styled(Input)`
  .KuxInput-suffix {
    margin-left: 10px !important;
    margin-right: 0;
  }
`;

export const FormInput = styled(CompatibleInput)`
  .KuxInput-prefix {
    display: none;
  }
`;
