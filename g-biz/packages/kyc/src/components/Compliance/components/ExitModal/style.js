/**
 * Owner: tiger@kupotech.com
 * 退出弹窗
 */
import { Dialog, styled } from '@kux/mui';

export const StyledDialog = styled(Dialog)`
  .KuxModalHeader-root {
    padding: 24px 16px 12px !important;
    display: flex;
    justify-content: flex-end;
    min-height: 20px !important;
    .KuxModalHeader-close {
      width: 24px;
      height: 24px;
      position: static;
    }
  }
  & .KuxDialog-content {
    padding: 24px 32px 0;
  }
  & .KuxModalFooter-root {
    padding: 32px 32px 16px;
    .KuxModalFooter-buttonWrapper {
      flex-direction: column;
      gap: 12px;
      .KuxButton-root {
        margin-right: 0;
        flex: auto;
      }
    }
  }
  &.isSmStyle {
    .KuxDialog-body {
      margin: 0 !important;
      width: 100vw;
      max-width: 100vw;
      position: absolute;
      bottom: 0;
      left: 0;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      padding-bottom: constant(safe-area-inset-bottom);
      padding-bottom: env(safe-area-inset-bottom);
    }

    .KuxDialog-content {
      padding: 16px 16px 0;
    }
    .KuxModalFooter-root {
      padding: 32px 32px 16px;
      .KuxModalFooter-buttonWrapper {
        .KuxButton-root {
          margin-right: 0;
          flex: auto;
        }
      }
    }
  }
`;
export const DialogContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  .icon {
    width: 137px;
    height: 110px;
    margin-bottom: 10px;
  }
  .title {
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%;
    margin-bottom: 8px;
    color: ${({ theme }) => theme.colors.text};
  }
  .desc {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    color: ${({ theme }) => theme.colors.text60};
  }
  &.isSmStyle {
    .icon {
      width: 101px;
      height: 80px;
    }
  }
`;
