/**
 * Owner: terry@kupotech.com
 */
import { styled } from '@kux/mui/emotion';
import isIOS from 'utils/isIOS';
import { _t } from 'src/tools/i18n';

const Wrapper = styled.p`
  padding: 40px 16px 0;
  text-align: center;
  color: ${(props) => props.withTheme ? props.theme.colors.text40 : 'rgba(243, 243, 243, 0.60)'};
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 60px 24px 0;
  }
`;

export function AppleDisclaim({ withTheme = true, ...rest }) {
  if (!isIOS()) return null;
  return (
    <Wrapper withTheme={withTheme} {...rest}>
      {_t('8fe6fe99cef24000a0dd')}
    </Wrapper>
  )
}