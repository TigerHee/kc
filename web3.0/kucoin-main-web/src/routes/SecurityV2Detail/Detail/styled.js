/**
 * Owner: larvide.peng@kupotech.com
 */
import { styled, Spin } from '@kux/mui';

export const Article = styled.article`
  margin-bottom: 40px;
  padding-top: ${({ isInApp }) => (isInApp ? '24px' : '0px')};
  .article-title {
    margin-bottom: 32px;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
    font-size: 28px;
    font-style: normal;
    ${({ theme }) => theme.breakpoints.down('sm')} {
      margin-bottom: 24px;
    }
  }
  .article-content {
    color: ${({ theme }) => theme.colors.text};
    ${({ theme }) => theme.breakpoints.down('lg')} {
      font-size: 16px;
    }
    ${({ theme }) => theme.breakpoints.down('sm')} {
      font-size: 14px;
    }

    h2 {
      margin-bottom: 24px;
      color: ${({ theme }) => theme.colors.text};
      font-weight: 600;
      font-size: 24px;
      font-family: 'Roboto';
      font-style: normal;
      ${({ theme }) => theme.breakpoints.down('lg')} {
        font-size: 20px;
      }
      ${({ theme }) => theme.breakpoints.down('sm')} {
        margin-bottom: 12px;
        font-size: 20px;
      }
    }

    p {
      margin-bottom: 40px;
      color: ${({ theme }) => theme.colors.text60};
      font-weight: 400;
      font-family: 'Roboto';
      font-style: normal;
      ${({ theme }) => theme.breakpoints.down('sm')} {
        margin-bottom: 24px;
        font-size: 12px;
      }
    }
  }

  .article-section {
    margin-bottom: 60px;
    ${({ theme }) => theme.breakpoints.down('sm')} {
      margin-bottom: 40px;
    }
  }
`;

export const StyledSpin = styled(Spin)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
`;
