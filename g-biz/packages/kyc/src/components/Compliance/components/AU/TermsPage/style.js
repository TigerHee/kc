/**
 * Owner: tiger@kupotech.com
 */
import { styled } from '@kux/mui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-bottom: 16px;
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .title {
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%;
    margin-bottom: 8px;
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.text};
  }
  .desc {
    flex: 1;
    overflow-y: auto;
    padding: 12px 16px;
    font-size: 15px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    margin-bottom: 12px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.cover4};
    b {
      font-weight: 700;
    }
    b[data-link]:not([data-link='']) {
      text-decoration: underline;
    }
    &::-webkit-scrollbar {
      width: 8px;
      background-color: ${({ theme }) => theme.colors.background};
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${({ theme }) => theme.colors.icon40};
      border-radius: 4px;
    }

    &::-webkit-scrollbar-track {
      background-color: ${({ theme }) => theme.colors.background};
      border-radius: 4px;
    }
  }
  .agreeDesc {
    font-size: 15px;
    font-style: normal;
    font-weight: 500;
    line-height: 140%;
    margin-bottom: 12px;
    color: ${({ theme }) => theme.colors.text};
  }
  .checkList {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    .KuxCheckbox-wrapper {
      display: flex;
    }
    .KuxCheckbox-wrapper > span {
      line-height: 140%;
    }
  }
  &.isSmStyle {
    padding-bottom: 0;
    .desc {
      font-size: 13px;
    }
    .agreeDesc {
      font-size: 13px;
    }
    .checkList {
      .KuxCheckbox-checkbox {
        padding-top: 2px;
      }
    }
  }
`;

export const CheckboxDesc = styled.span`
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  color: ${({ theme }) => theme.colors.text};
  b {
    font-weight: 700;
    flex-shrink: 0;
  }
  b[data-link]:not([data-link='']) {
    text-decoration: underline;
  }
  &.isSmStyle {
    font-size: 13px;
  }
`;
