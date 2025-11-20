/**
 * Owner: tiger@kupotech.com
 */
import { styled } from '@kux/mui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  .icon {
    width: 136px;
    height: 136px;
    margin-bottom: 8px;
  }
  .title {
    font-size: 28px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%;
    margin-bottom: 4px;
    color: ${({ theme }) => theme.colors.text};
  }
  .subTitle {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    margin-bottom: 24px;
    color: ${({ theme }) => theme.colors.text40};
  }
  .desc {
    width: 100%;
    padding: 16px;
    border-radius: 12px;
    margin-bottom: 24px;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 180%;
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.cover2};
    ul {
      list-style: disc;
      padding-left: 8px;
      margin-left: 16px;
    }
  }
  .checkList {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    .KuxCheckbox-inner {
      margin-top: 1px;
    }
    .KuxCheckbox-wrapper {
      display: flex;
    }
    .KuxCheckbox-wrapper > span {
      line-height: 140%;
    }
  }
  &.isSmStyle {
    .title {
      font-size: 24px;
      margin-bottom: 8px;
    }
    .desc {
      padding: 12px;
      line-height: 160%;
    }
  }
`;

export const CheckboxDesc = styled.span`
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  color: ${({ theme }) => theme.colors.text60};
  b {
    flex-shrink: 0;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.text};
  }
  b[data-link]:not([data-link='']) {
    text-decoration: underline;
  }
  &.isSmStyle {
  }
`;
