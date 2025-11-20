/**
 * Owner: willen@kupotech.com
 */
import { styled } from '@kux/mui';
import errorIcon from 'static/account/kyc/kyc3/alert_error.svg';
import warningIcon from 'static/account/kyc/kyc3/alert_warning.svg';

const AlertWrapper = styled.div`
  display: flex;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    text-align: left;
  }
  & > div {
    font-weight: 500;
    font-size: 16px;
    ${({ theme }) => theme.breakpoints.down('sm')} {
      font-size: 14px;
    }
    ${({ type, theme }) => {
      if (type === 'warning') {
        return `color: ${theme.colors.complementary};`;
      } else if (type === 'error') {
        return `color: ${theme.colors.secondary};`;
      }
    }}
  }
`;

const ExtendIcon = styled.img`
  width: 18px;
  height: 18px;
  margin-right: 4px;
`;

const BaseAlert = ({ children, className, type = 'warning' }) => {
  return (
    <AlertWrapper className={className} type={type}>
      <ExtendIcon src={type === 'warning' ? warningIcon : errorIcon} />
      <div>{children}</div>
    </AlertWrapper>
  );
};

export default BaseAlert;
