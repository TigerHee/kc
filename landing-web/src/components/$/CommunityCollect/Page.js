import { styled } from '@kux/mui/emotion';

/**
 * Owner: lucas.l.lu@kupotech.com
 */
export function Page(props) {
  const { className, children } = props;

  return (
    <div className={className}>
      {children}
    </div>
  );
}

export const StyledPage = styled(Page)`
  ${({ theme }) => theme.breakpoints.down('sm')} {
    // ios safe-bottom
    padding-bottom: 34px;
  }
`;
