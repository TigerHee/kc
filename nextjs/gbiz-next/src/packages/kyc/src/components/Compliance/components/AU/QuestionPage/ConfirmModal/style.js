/**
 * Owner: tiger@kupotech.com
 */
import { Dialog, styled } from '@kux/mui';

export const StyledDialog = styled(Dialog)`
  .KuxDialog-body {
    max-width: 520px;
  }
  .KuxButton-text {
    padding: 0 12px;
  }

  &.isSmStyle {
    .KuxDialog-body {
      max-width: 320px;
    }
  }
`;
export const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding-top: 32px;
  }
  img {
    width: 136px;
    height: 136px;
  }
  .title {
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 130%;
    margin-bottom: 16px;
    color: var(--color-text);
  }
  .desc {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    text-align: center;
    margin-bottom: 16px;
    padding: 12px 10px;
    border-radius: 12px;
    color: var(--color-text60);
    background-color: var(--color-cover4);
    b {
      font-weight: 500;
      color: var(--color-text);
    }
  }
  .tip {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    color: var(--color-text60);
    b {
      font-weight: 500;
      color: var(--color-text);
    }
  }
  &.isSmStyle {
    padding-top: 32px;
    img {
      width: 136px;
      height: 136px;
      margin-bottom: 0;
    }
    .title {
      font-size: 20px;
      margin-bottom: 12px;
    }
    .desc {
      font-size: 14px;
    }
    .tip {
      font-size: 14px;
    }
  }
`;
