/**
 * Owner: ella@kupotech.com
 */
import { styled, css } from '@kux/mui';

export const ellipsis = ({ theme }) => css`
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;

const nonFeaturedStyle = (props) =>
  !props.featured &&
  css`
    ${props.theme.breakpoints.up('lg')} {
      max-height: 220px;
    }
  `;

export const Card = styled.div`
  width: 100%;
  .wrapper {
    position: relative;
    height: 100%;
    overflow: hidden;
    border-radius: 8px;

    ${nonFeaturedStyle}

    .tags {
      z-index: 1;
      display: flex;
      padding: 12px;
      .tag {
        height: 24px;
        color: #fff;
        font-weight: 400;
        font-size: 12px;
        font-style: normal;
        line-height: 130%;
        text-align: center;
      }
      .is-info {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: 4px 6px;
        background: rgba(37, 44, 52, 0.4);
        border-radius: 2px;

        &:not(:first-of-type) {
          margin-left: 8px;
          [dir='rtl'] & {
            margin-right: 8px;
            margin-left: 0;
          }
        }
      }
      .customized-tutorial {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: 4px 10px;
        background: #01bc8d;
        ::before {
          position: absolute;
          left: -8px;
          width: 0;
          height: 0;
          border-top: 12px solid #01bc8d;
          border-bottom: 12px solid #01bc8d;
          border-left: 9px solid transparent;
          content: '';
        }
      }
    }
    .is-right {
      right: 0;
      padding-right: 0;
    }
    .is-overlay {
      position: absolute;
    }
    .card-image {
      img {
        width: 100%;
        height: 100%;
        object-fit: inherit;
        border-radius: 8px;
        transition: all 0.2s;
      }
      img:hover {
        transform: scale(1.1);
      }
    }
    .progress {
      position: absolute;
      bottom: 0;
      width: 100%;
      border: none;
      block-size: 4px;
      ::-webkit-progress-bar {
        background-color: rgba(37, 44, 52, 0.4);
      }
      ::-webkit-progress-value {
        background-color: #01bc8d;
      }
    }
  }
  .content {
    margin-top: 12px;
    margin-bottom: 24px;
    ${({ theme }) => theme.breakpoints.down('sm')} {
      margin-top: 8px;
      margin-bottom: 16px;
    }
    .modal-card-title {
      ${ellipsis}
      color: #F3F3F3;
      font-weight: 700;
      font-size: 20px;
      line-height: 130%;
      ${({ theme }) => theme.breakpoints.down('lg')} {
        font-size: 16px;
      }
    }
    .tag {
      height: 24px;
      padding: 4px 6px;
      background: rgba(45, 189, 150, 0.08);
      border-radius: 2px;
    }
    .is-success {
      color: #2dbd96;
      font-weight: 400;
      font-size: 12px;
      font-style: normal;
      line-height: 130%;
      text-align: center;
    }
    .content-tag {
      margin-top: 8px;
    }
    time {
      margin-left: 12px;
      color: rgba(243, 243, 243, 0.6);
      font-size: 12px;
      line-height: 130%;

      text-align: left;
      mix-blend-mode: normal;

      [dir='rtl'] & {
        margin-right: 12px;
        margin-left: unset;
      }
    }
  }
`;
