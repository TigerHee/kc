/**
 * Owner: jessie@kupotech.com
 */
import { Dialog, MDrawer, styled, useResponsive } from '@kux/mui';
import clsx from 'clsx';

// modal中黑夜主题tabs样式要复写，在此统一处理
const StyledMDrawer = styled(MDrawer)`
  min-height: 260px;
  min-width: 100%;
  .KuxDrawer-content {
    position: relative;
    padding: 0 16px 34px;
  }
  .KuxTabs-rightScrollButtonBg {
    background-image: linear-gradient(
      to right,
      rgba(18, 18, 18, 0) 0%,
      ${(props) => props.theme.colors.layer} 70%
    );
  }
  .KuxTabs-leftScrollButtonBg {
    background-image: linear-gradient(
      to left,
      rgba(18, 18, 18, 0) 0%,
      ${(props) => props.theme.colors.layer} 70%
    );
  }

  &.restrict-height {
    max-height: calc(100vh - 40px);
    .KuxModalHeader-root {
      flex-shrink: 0;
    }

    .KuxDrawer-content {
      display: flex;
      flex-direction: column;
    }

    &.fixed-footer {
      .KuxDrawer-content {
        overflow: hidden;
        padding-bottom: 8px;

        > div:first-child {
          flex: 1;
          overflow: auto;
          &::-webkit-scrollbar {
            display: none;
          }
        }

      }
    }

    .modal-task-content {
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
`;

const StyledDialog = styled(Dialog)`
  .KuxModalHeader-root .KuxModalHeader-title {
    font-size: 24px !important;
  }
  .KuxTabs-rightScrollButtonBg {
    background-image: linear-gradient(
      to right,
      rgba(18, 18, 18, 0) 0%,
      ${(props) => props.theme.colors.layer} 70%
    );
  }
  .KuxTabs-leftScrollButtonBg {
    background-image: linear-gradient(
      to left,
      rgba(18, 18, 18, 0) 0%,
      ${(props) => props.theme.colors.layer} 70%
    );
  }
  &.restrict-height {
    .KuxDialog-body {
      max-height: 720px;
    }

    .KuxDialog-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    &.fixed-footer {
      .KuxDialog-content {
        overflow: hidden;

        > div:first-child {
          flex: 1;
          overflow: auto;

          &::-webkit-scrollbar {
            display: none;
          }
        }
      }
    }
  }
`;

/**
 *
 * @param {boolean} restrictHeight 修正kux 对话框无最小高度, 内容区超长时内容溢出不可见的问题(改为内容区滚动)
 * @param {boolean} fixedFooter 是否固定底部, 内容溢出时保证底部固定可见, 需配合 restrictHeight使用
 * @returns
 */
export default function Modal({ children, open, fixedFooter, restrictHeight, onClose = () => {}, title, showDialog = false, ...others }) {
  const { sm } = useResponsive();

  const className = clsx(others.className, {'restrict-height': restrictHeight, 'fixed-footer': fixedFooter});

  if (!sm && !showDialog) {
    return (
      <StyledMDrawer
        show={open}
        anchor="bottom"
        title={title}
        onClose={() => {
          onClose();
        }}
        headerProps={{
          back: false,
        }}
        {...others}
        className={className}
      >
        {children}
      </StyledMDrawer>
    );
  }

  return (
    <StyledDialog
      open={open}
      title={title}
      size="medium"
      footer={null}
      onCancel={() => {
        onClose();
      }}
      {...others}
      className={className}
    >
      {children}
    </StyledDialog>
  );
}
