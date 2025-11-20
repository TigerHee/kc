/**
 * Owner: willen@kupotech.com
 */
import { styled } from '@kux/mui';
import useHtmlToReact from 'hooks/useHtmlToReact';

const DescriptionWrapper = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text40};
  font-weight: 400;
  line-height: 130%;
  margin-bottom: 0;
  span {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 14px;
    text-align: center;
  }
`;

const BaseDescription = ({ children, className, onClick }) => {
  const { eles: richHTML } = useHtmlToReact({
    html: children || '',
  });
  return richHTML ? (
    <DescriptionWrapper className={className} onClick={onClick}>
      {richHTML}
    </DescriptionWrapper>
  ) : null;
};

export default BaseDescription;
