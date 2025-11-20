/*
 * owner: borden@kupotech.com
 */
import React from 'react';
import { styled } from '@kux/mui';
import classnames from 'classnames';
import { useSelector } from 'react-redux';
import useInit from './hooks/form/useInit';
import OrderTypeTabs from './modules/OrderTypeTabs';
import { NAMESPACE, ORDER_TYPE_MAP } from './config';
import Dialog from './components/common/Dialog';
import withWrapper from './hocs/withWrapper';
import { ConvertForm } from './Convert';
import useContextSelector from './hooks/common/useContextSelector';
import AgreeDialogRender from './modules/AgreeDialogRender';

const StyledDialog = styled(Dialog)`
  .KuxModalHeader-root {
    height: unset !important;
    padding: 32px 32px 16px;
    ${(props) => props.theme.breakpoints.down('sm')} {
      padding: 18px;
    }
    [role='tab'] {
      font-size: 18px;
    }
  }
  .KuxDialog-content {
    position: relative;
    padding-bottom: 32px;
    overflow-y: unset;
  }
`;

const ConvertDialog = React.memo(
  ({
    open,
    onCancel,
    className,
    defaultOrderType,
    defaultToCurrency,
    disabledOrderTypes,
    defaultFromCurrency,
    ...otherProps
  }) => {
    const isLogin = useContextSelector((state) => Boolean(state.user));
    const orderType = useSelector((state) => state[NAMESPACE].orderType);

    useInit({ defaultOrderType, defaultToCurrency, defaultFromCurrency });

    return (
      <>
        <StyledDialog
          keyboard
          open={open}
          footer={null}
          size="medium"
          onCancel={onCancel}
          className={classnames(NAMESPACE, { [className]: !!className })}
          title={<OrderTypeTabs disabledOrderTypes={disabledOrderTypes} />}
          {...otherProps}
        >
          {Boolean(ORDER_TYPE_MAP[orderType]) && (
            <ConvertForm inDialog visible={open} onCancel={onCancel} />
          )}
        </StyledDialog>
        {isLogin && <AgreeDialogRender />}
      </>
    );
  },
);

export default withWrapper(ConvertDialog);
