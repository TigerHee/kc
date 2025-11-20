/**
 * Owner: garuda@kupotech.com
 */
import { styled } from '@/style/emotion';
import Button from '@mui/Button';
import Form from '@mui/Form';

export const FormWrapper = styled(Form)`
  .KuxForm-itemHelp {
    min-height: initial;
  }
`;

export const SliderWrapper = styled.div`
  .rc-slider {
    height: 30px !important;
    margin-bottom: 40px !important;
    margin-top: -6px;
  }
  .rc-slider-mark {
    top: 38px !important;
  }
`;

export const FooterInfo = styled.div`
  font-size: 13px;
  font-weight: 400;
  line-height: 1.3;
  .lean-more {
    font-size: 13px;
    color: ${(props) => props.theme.colors.text};
    text-decoration: underline;
    cursor: help;
  }
`;

export const UnitSpan = styled.span`
  font-weight: 500;
  font-size: 16px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text30};
`;

export const MaxButton = styled(Button)`
  color: ${(props) => props.theme.colors.primary}!important;
  font-size: 16px;
  line-height: 1.3;
`;

export const DividerLine = styled.div`
  width: 1px;
  height: 12px;
  margin: 0 12px;
  background-color: ${(props) => props.theme.colors.divider8};
`;
