/**
 * Owner: tiger@kupotech.com
 */
import { styled } from '@kux/mui';

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 0 16px;
  }
  .icon {
    width: 148px;
    height: 148px;
    margin-bottom: 8px;
  }
  .title {
    margin-bottom: 8px;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
    font-size: 20px;
    font-style: normal;
    line-height: 130%;
  }
  .desc {
    max-width: 460px;
    color: ${({ theme }) => theme.colors.text60};
    font-weight: 400;
    font-size: 16px;
    font-style: normal;
    line-height: 150%;
  }
  .descError {
    color: ${({ theme }) => theme.colors.secondary};
  }
  .KuxButton-root {
    max-width: 240px;
    margin-top: 24px;
  }
`;
