/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import { styled } from '@kux/mui/emotion';

import ShareHeader from './ShareHeader';
import ShareInfo from './ShareInfo';
import ShareUserInfo from './ShareUserInfo';

const ShareWrapper = styled.div`
  padding: 22px 16px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    > img {
      width: 72px;
    }
  }
  .user-info {
    margin: 30px 0 20px;
    display: flex;
    align-items: center;
    // height: 40px;
    width: 100%;
    .avatar {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: rgba(243, 243, 243, 0.08);
      color: #f3f3f3;
    }
    .vip-info {
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      .name {
        font-size: 16px;
        font-weight: 500;
        line-height: 1.3;
        color: #f3f3f3;
      }
      .vip {
        display: flex;
        align-items: center;
        > img {
          width: 16px;
          margin-right: 3px;
        }
        .text {
          font-size: 10px;
          font-weight: 500;
          line-height: 1.3;
          color: #f3f3f3;
        }
      }
    }
  }
  .share-info {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    flex: 1;
    max-height: 60%;

    .share-info-symbol {
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: 700;
      color: #f3f3f3;
      .currencyText {
        color: #f3f3f3;
      }
    }
    .side-long {
      margin-left: 6px;
      color: ${(props) => props.theme.colors.primary};
    }
    .side-short {
      margin-left: 6px;
      color: ${(props) => props.theme.colors.secondary};
    }
    .profit-roe {
      height: 40px;
      display: flex;
      align-items: center;
      line-height: 1.3;
      font-size: 30px;
      font-weight: 700;
      color: #fff;
    }
    .profit-value {
      height: 17px;
      display: flex;
      align-items: center;
    }
    .prettyCurrency {
      font-size: 14px;
      font-weight: 700;
      line-height: 1.3;
    }
    .profit-win {
      color: ${(props) => props.theme.colors.primary};
    }
    .profit-loss {
      color: ${(props) => props.theme.colors.secondary};
    }
    .share-info-price {
      display: flex;
      align-items: center;
      .price-item {
        display: flex;
        flex-direction: column;
        max-width: 45%;
        margin-right: 10px;
      }
      .item-title {
        white-space: normal;
        word-wrap: break-word;
        font-size: 10px;
        line-height: 1.3;
        color: rgba(243, 243, 243, 0.6);
        margin-bottom: 2px;
      }
      .item-value {
        font-size: 12px;
        font-weight: 600;
        color: #f3f3f3;
      }
    }
  }
`;

const ShareContent = () => {
  return (
    <ShareWrapper>
      <ShareHeader />
      <ShareUserInfo />
      <ShareInfo />
    </ShareWrapper>
  );
};

export default React.memo(ShareContent);
