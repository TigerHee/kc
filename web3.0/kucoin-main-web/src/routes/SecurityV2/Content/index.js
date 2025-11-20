/**
 * Owner: brick.fan@kupotech.com
 */
import { map } from 'lodash';
import { _t } from 'tools/i18n';
import { styled } from '@kux/mui';
import Section from './Section';
import { articles } from 'src/components/SecurityMenu/config';

const Container = styled.div`
  .content-item {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    margin-top: 120px;
    &:first-child {
      margin-top: 0px;
      padding-top: 80px;
    }
    .content-item-left {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      width: 540px;
      height: 540px;
      margin-right: 80px;
      background-color: ${({ theme }) => theme.colors.cover2};
      border-radius: 16px;
      img {
        width: 456px;
        height: 456px;
      }
    }
    .content-item-right {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: center;
    }
    .content-item-title {
      color: ${({ theme }) => theme.colors.text};
      font-weight: 700;
      font-size: 36px;
      line-height: 130%;
    }
    .content-item-desc {
      margin-top: 16px;
      color: ${({ theme }) => theme.colors.text60};
      font-weight: 400;
      font-size: 16px;
      line-height: 130%;
    }
    .content-item-desc-ellipsis {
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    .content-item-btns {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      margin-top: 60px;
      margin-bottom: -24px;
      .content-item-btn {
        width: calc((100% - 24px) / 2);
        margin-right: 24px;
        margin-bottom: 24px;
        &:nth-child(2n) {
          margin-right: 0;
        }
      }
      .content-item-more {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 66px;
        padding: 0 12px;
        color: ${({ theme }) => theme.colors.text};
        font-weight: 400;
        font-size: 20px;
        line-height: 130%;
        text-decoration: none;
        border: 1px solid ${({ theme }) => theme.colors.cover12};
        border-radius: 12px;
        svg {
          width: 20px;
          height: 20px;
          margin-left: 6px;
        }
        &:hover {
          border-color: ${({ theme }) => (theme.currentTheme === 'light' ? '#000' : '#FFF')};
        }
      }
    }
    .content-divier {
      width: 100%;
      height: 1px;
      margin: 32px 0;
      background-color: ${({ theme }) => theme.colors.cover8};
    }
    .content-href {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 24px;
      color: ${({ theme }) => theme.colors.text};
      text-align: left;
      text-decoration: none;
      background-color: ${({ theme }) => theme.colors.cover2};
      border: 1px solid ${({ theme }) => theme.colors.divider8};
      border-radius: 16px;
      img {
        flex-shrink: 0;
        width: 48px;
        height: 48px;
        margin-right: 24px;
      }
      span {
        flex: 1;
        font-weight: 700;
        font-size: 18px;
        line-height: 130%;
        text-align: left;
      }
      svg {
        flex-shrink: 0;
        width: 18px;
        height: 18px;
      }

      .a-arrow {
        align-items: flex-end;
        height: 32px;
        padding: 7px;
      }

      &:hover {
        border-color: ${({ theme }) => (theme.currentTheme === 'light' ? '#000' : '#FFF')};
        .a-arrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: ${({ theme }) =>
            theme.currentTheme === 'light' ? '#1D1D1D' : '#01BC8D'};
          border-radius: 50%;
          svg {
            color: #fff;
          }
        }
      }
    }
  }

  .content-item-reverse {
    flex-direction: row-reverse;
    .content-item-left {
      margin-right: 0;
      margin-left: 80px;
    }
    .content-item-right {
      align-items: flex-end;
      text-align: right;
    }
  }

  ${(props) => props.theme.breakpoints.down('lg')} {
    .content-item {
      width: 100%;
      padding: 0 24px;
      .content-item-left {
        width: 330px;
        height: 330px;
        margin-right: 40px;
        img {
          width: 278px;
          height: 278px;
        }
      }
      .content-item-right {
        .content-item-title {
          font-size: 28px;
        }
        .content-item-btns {
          margin-top: 32px;
          margin-bottom: -16px;
          .content-item-btn {
            width: calc((100% - 16px) / 2);
            margin-right: 16px;
            margin-bottom: 16px;
            &:nth-child(2n) {
              margin-right: 0;
            }
          }
        }
      }
    }

    .content-item-reverse {
      .content-item-left {
        margin-left: 40px;
      }
    }
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    .content-item {
      flex-direction: column;
      width: 100%;
      margin-top: 60px;
      padding: 0 16px;
      &:first-child {
        padding-top: 40px;
      }
      .content-item-left {
        display: flex;
        align-items: center;
        width: 100%;
        height: 146px;
        margin-right: 0;
        padding: 0 32px;
        overflow: hidden;
        img {
          width: 60%;
          height: auto;
        }
      }
      .content-item-right {
        width: 100%;
        .content-item-title {
          margin-top: 24px;
          font-size: 20px;
        }
        .content-item-desc {
          margin-top: 12px;
          font-size: 12px;
          line-height: 150%;
        }
        .content-item-btns {
          margin-top: 24px;
          .content-item-btn {
          }
          .content-item-more {
            height: 100%;
            padding: 12px 16px;
            font-size: 14px;
            border-radius: 6px;
          }
        }
      }
      .content-href {
        padding: 16px;
        border-radius: 6px;
        img {
          width: 32px;
          height: 32px;
          margin-right: 16px;
        }
        span {
          font-weight: 600;
          font-size: 14px;
          line-height: 130%;
        }
        svg {
          width: 18px;
          height: 18px;
        }
        &:hover {
          border-color: ${({ theme }) => theme.colors.divider8};
        }
      }
      .content-divier {
        margin: 20px 0;
      }
    }
    .content-item-reverse {
      .content-item-left {
        margin-left: 0;
      }
      .content-item-right {
        align-items: flex-start;
        text-align: left;
      }
    }
  }
`;

const Content = () => {
  return (
    <Container>
      {map(articles, (item, index) => (
        <Section key={index} item={item} />
      ))}
    </Container>
  );
};

export default Content;
