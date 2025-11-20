/**
 * Owner: willen@kupotech.com
 */
import { styled } from '@kux/mui';

const TitleWrapper = styled.h4`
  font-size: 20px;
  font-weight: 600;
  line-height: 130%;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.text};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 18px;
    text-align: center;
  }
`;

const BaseTitle = ({ children, className }) => {
  return children ? <TitleWrapper className={className}>{children}</TitleWrapper> : null;
};

export default BaseTitle;
