/**
 * Owner: tiger@kupotech.com
 */
import { ICSecurityOutlined } from '@kux/icons';
import { styled } from '@kux/mui';
import { _t } from 'tools/i18n';

const Wrapper = styled.div`
  padding: 16px 0;
  display: flex;
  align-items: center;
  border-top: 1px solid ${(props) => props.theme.colors.divider8};
  ${(props) => props.theme.breakpoints.down('sm')} {
    justify-content: center;
    margin-top: 24px;
  }
`;
const SecurityIcon = styled(ICSecurityOutlined)`
  font-size: 16px;
  margin-right: 4px;
  color: ${({ theme }) => theme.colors.icon60};
`;
const WrapperText = styled.span`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: ${(props) => props.theme.colors.text40};
`;

export default () => {
  return (
    <Wrapper className="kyb_privacy_protect">
      <SecurityIcon />
      <WrapperText>{_t('1qu2jwMiwQvMN9wo6gyP1n')}</WrapperText>
    </Wrapper>
  );
};
