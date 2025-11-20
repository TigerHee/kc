/**
 * Owner: willen@kupotech.com
 */

import { css, styled } from '@kux/mui';

export const whiteRoot = css`
  background-color: #fff;
`;

export const onlyMain = (theme) => css`
  min-height: 100vh;
  background: ${theme.colors.overlay};
`;

export const BodyContainer = styled.div`
  position: relative;
  flex-grow: 1;
  flex-shrink: 0;
  min-height: 80vh;
  background: ${({ theme }) => theme.colors.overlay};
  transition: all 0.3s ease-in-out;
  .root[data-path='/trade'],
  .root[data-path^='/authorize-result'] & {
    min-height: initial;
  }

  .root[data-path='/download'] & {
    ${({ theme }) => theme.breakpoints.down('md')} {
      min-height: 60vh;
    }
    ${({ theme }) => theme.breakpoints.down('sm')} {
      min-height: 80vh;
    }
  }

  .root[data-path='/'] {
    overflow: hidden;
    background-color: transparent;
  }

  .root[data-path^='/leveraged-tokens/detail'],
  .root[data-path^='/account-sub/assets'],
  .root[data-path^='/news'],
  .root[data-path^='/blog'],
  .root[data-path^='/account-sub/api-manager'],
  .root[data-path^='/account/api'],
  .root[data-path^='/account-sub/api-manager'],
  .root[data-path^='/authorize-result'] {
    background-color: #fff;
  }

  .root[data-path^='/trade'] {
    & > div {
      height: 100vh;
      &::-webkit-scrollbar {
        width: 0px;
        height: 0px;
      }
    }
    @media screen and (max-width: 1280px) {
      & > div {
        height: calc('100vh - 15px');
      }
    }
  }

  .root[data-path='/account/sub'],
  .root[data-path='/account-sub/assets'] {
    :global {
      .ant-table {
        .ant-table-thead {
          th {
            color: rgba(1, 8, 30, 0.6);
            font-weight: 400;
            font-size: 14px;
            background-color: rgba(1, 8, 30, 0.04);
            border-bottom: 0;
            &:first-of-type {
              border-top-left-radius: 4px;
              border-bottom-left-radius: 4px;
            }
            &:last-child {
              border-top-right-radius: 4px;
              border-bottom-right-radius: 4px;
            }
          }
        }
        .ant-table-tbody {
          font-weight: 400;
          font-size: 14px;
          .ant-table-row {
            &:hover {
              td {
                background-color: rgba(1, 8, 30, 0.02);
              }
            }
            a {
              color: #24ae8f;
            }
          }
        }
      }
    }
  }
`;
