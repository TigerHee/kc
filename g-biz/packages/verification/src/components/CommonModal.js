/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled, Dialog, Drawer, useResponsive } from '@kux/mui';
import { forwardRef } from 'react';

// Ex前缀的是需求设计的样式
const ExDialog = styled(Dialog)`
  .KuxDialog-content {
    padding-bottom: ${({ smallMarginBottom }) => (smallMarginBottom ? '16px' : '32px')};
  }
`;

const ExDrawer = styled(Drawer)`
  border-radius: 16px 16px 0 0;
  max-height: calc(100vh - 55px);
  .KuxDrawer-content {
    padding-bottom: 32px !important;
  }
`;

// Compatible前缀的是因kux版本落后的兼容层
// 理论上，将kux更新后可以直接移除
const CompatibleDrawer = styled(ExDrawer)`
  .KuxModalHeader-root {
    ${({ theme }) => theme.breakpoints.down('sm')} {
      height: 56px;
      padding: 0 16px;
    }
    .KuxModalHeader-title {
      font-size: 18px;
      line-height: 130%;
    }
    .KuxModalHeader-close {
      width: 24px;
      height: 24px;
      right: 16px;
      top: 16px;
      border-color: ${({ theme }) => theme.colors.icon20};
      svg {
        width: 8px;
        height: 8px;
        fill: ${({ theme }) => theme.colors.icon60};
      }
    }
  }
  .KuxDrawer-content {
    padding: 24px 16px;
  }
`;

const CommonModal = forwardRef((props, ref) => {
  const { open, onCancel, size, maskClosable, ...restProps } = props;
  const rv = useResponsive();
  const isH5 = !rv?.sm;

  return isH5 ? (
    <CompatibleDrawer
      ref={ref}
      show={open}
      anchor="bottom"
      back={false}
      onClose={onCancel}
      maskClosable={maskClosable ?? true}
      {...restProps}
    >
      {props.children}
    </CompatibleDrawer>
  ) : (
    <ExDialog
      ref={ref}
      open={open}
      size={size}
      footer={null}
      maskClosable={maskClosable ?? false}
      onCancel={onCancel}
      {...restProps}
    >
      {props.children}
    </ExDialog>
  );
});

export default CommonModal;
