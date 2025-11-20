/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';
import Modal from '../../../components/Modal';

export const DialogWrapper = styled(Modal)`
  .KuxModalHeader-root {
    height: 72px !important;
    .KuxModalHeader-close {
      top: 50% !important;
      transform: translateY(-50%) !important;
    }
    ${(props) => props.theme.breakpoints.up('sm')} {
      height: 130px !important;
    }
  }
`;

export const ContentWrapper = styled.div`
  padding: 20px 16px 34px;
  .projectInfo {
    margin: 0 0 16px 0;
    h2 {
      margin: 0 0 8px 0;
      color: ${(props) => props.theme.colors.text};
      font-weight: 700;
      font-size: 16px;
      font-style: normal;
      line-height: 130%;
    }

    p {
      margin: 0;
      color: ${(props) => props.theme.colors.text60};
      font-weight: 400;
      font-size: 14px;
      font-style: normal;
      line-height: 150%;
    }
  }
  .chainInfo {
    color: ${(props) => props.theme.colors.text60};
    font-weight: 400;
    font-size: 14px;
    font-style: normal;
    line-height: 150%;
    .name {
      display: block;
      margin-right: 0;
      margin-bottom: 4px;
      color: ${(props) => props.theme.colors.text};
      font-weight: 600;
      font-size: 16px;
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 0 0 60px;
    .projectInfo {
      margin: 0 0 12px 0;
      h2 {
        margin: 0 0 12px 0;
        font-size: 20px;
      }

      p {
        font-size: 16px;
      }
    }
    .chainInfo {
      font-size: 16px;
      .name {
        display: inline;
        margin-right: 12px;
        margin-bottom: 0;
        font-size: 16px;
      }
    }
  }
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 36px;
    height: 36px;
    margin-right: 12px;
    border-radius: 64px;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    img {
      width: 64px;
      height: 64px;
      margin-right: 24px;
    }
  }
`;

export const TitleInfo = styled.div`
  .nameWrapper {
    display: flex;
    align-items: flex-end;

    .name {
      margin-right: 6px;
      color: ${(props) => props.theme.colors.text};
      font-weight: 700;
      font-size: 18px;
      font-style: normal;
      line-height: 18px;
    }

    .subName {
      color: ${(props) => props.theme.colors.text};
      font-weight: 400;
      font-size: 13px;
      font-style: normal;
      line-height: 16px;
    }
  }
  .hotWrapper {
    display: flex;
    align-items: center;

    img {
      width: 14px;
      height: 14px;
      margin-right: 4px;
    }

    .num {
      color: ${(props) => props.theme.colors.text};
      font-weight: 400;
      font-size: 14px;
      font-style: normal;
      line-height: 130%;
    }
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    .nameWrapper {
      .name {
        margin-right: 12px;
        font-size: 28px;
        line-height: 130%;
      }

      .subName {
        font-size: 16px;
        line-height: 30px;
      }
    }
    .hotWrapper {
      margin-top: 6px;

      img {
        width: 24px;
        height: 24px;
      }

      .num {
        font-weight: 600;
        font-size: 18px;
      }
    }
  }
`;
