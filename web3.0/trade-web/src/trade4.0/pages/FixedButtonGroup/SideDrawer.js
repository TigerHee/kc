/*
 * owner: borden@kupotech.com
 */
import React, { useEffect, Fragment } from 'react';
import styled from '@emotion/styled';
import { useResponsive } from '@kux/mui';
import { useDispatch } from 'dva';
import Drawer from '@mui/Drawer';
import Divider from '@mui/Divider';
import ModalFooter from '@mui/ModalFooter';
import { renderModule } from '@/layouts/moduleConfig';
import { _t } from 'src/utils/lang';
import { useIsTradingBot } from '@/hooks/common/useTradeMode';

const StyledDrawer = styled(Drawer)`
  .KuxDrawer-content {
    width: 400px;
    display: flex;
    flex-direction: column;
    ${(props) => props.theme.breakpoints.down('sm')} {
      width: 100vw;
    }
  }
  .KuxModalFooter-root {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 20px 24px;
    background-color: ${(props) => props.theme.colors.layer};
  }
`;
const Content = styled.div`
  overflow-y: auto;
  display: unset;
  padding-bottom: ${(props) => (props.sideSM ? '90px' : 'unset')};
`;
const Module = styled.div`
  & [data-inspector='tradeV4_assets'] {
    position: unset;
    .KuxSpin-container {
      &::after {
        background: transparent;
      }
    }
  }
`;
const OrderFormBox = styled(Module)`
  display: flex;
  ${(props) => props.theme.breakpoints.down('sm')} {
    flex: 1;
    height: 100vh;
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    min-height: 480px;
    margin-bottom: 24px;
  }
  .sm {
    display: unset;
    height: unset;
    position: unset;
  }
`;

const SideDrawer = React.memo(({ onClose, side, show, ...otherProps }) => {
  const dispatch = useDispatch();
  const { sm, lg } = useResponsive();
  const isSm = sm && !lg;

  useEffect(() => {
    const visible = show ? 1 : undefined;
    dispatch({
      type: 'setting/updateInLayoutIdMap',
      payload: isSm
        ? {
            orderForm: visible,
            assets: visible,
          }
        : {
            orderForm: visible,
          },
    });
  }, [show, isSm]);
  const isBot = useIsTradingBot();
  return (
    <StyledDrawer
      show={show}
      back={false}
      anchor="right"
      onClose={onClose}
      contentPadding="8px 0"
      {...(sm ? { header: null } : null)}
      title={sm ? null : _t(isBot ? 'iN5fZvFDfnejp2B8bESUko' : 'kFFx5HbwU7nfCBHfuhnbQu')}
      {...otherProps}
    >
      <Content sideSM={sm}>
        <OrderFormBox className="side-drawer-order-form-box">
          {renderModule('orderForm', { side })}
        </OrderFormBox>
        {isSm && !isBot && (
          <Fragment>
            <Divider />
            <Module>{renderModule('assets')}</Module>
          </Fragment>
        )}
      </Content>
      {sm ? (
        <ModalFooter
          okText={null}
          onCancel={onClose}
          cancelText={_t('cancel')}
          cancelButtonProps={{
            fullWidth: true,
            variant: 'contained',
          }}
        />
      ) : null}
    </StyledDrawer>
  );
});

export default SideDrawer;
