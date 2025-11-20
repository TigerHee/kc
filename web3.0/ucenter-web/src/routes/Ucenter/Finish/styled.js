/**
 * Owner: willen@kupotech.com
 */
import { styled } from '@kux/mui';

export const FinishWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 12px;
  margin-bottom: 64px;

  a {
    text-decoration: underline;
  }

  img {
    width: 180px;
    height: 180px;

    ${({ theme }) => theme.breakpoints.down('md')} {
      width: 120px;
      height: 120px;
      margin-top: 64px;
    }
  }
`;

export const WarnWrapper = styled.div`
  max-width: 588px;
`;

export const Warning = styled.div`
  padding: 8px 0;
  font-size: 14px;
  opacity: 0.6;
  color: ${({ theme }) => theme.colors.text60};
`;

export const StatusTitle = styled.div`
  padding: 24px 0 4px 0;
  font-weight: 500;
  font-size: 28px;
  line-height: 40px;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};

  ${({ theme }) => theme.breakpoints.down('md')} {
    font-size: 24px;
  }
`;

export const CenterText = styled(Warning)`
  text-align: center;
  margin-bottom: 12px;
`;
