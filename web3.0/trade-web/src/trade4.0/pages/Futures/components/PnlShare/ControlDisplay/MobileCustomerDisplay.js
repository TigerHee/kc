/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import { styled } from '@kux/mui/emotion';

import { _t } from 'utils/lang';

import { MDialog, Checkbox } from '@kux/mui';

import { useMCustomer, useGetControlDisplay, useSetControlDisplay } from '../hook';

const Dialog = styled(MDialog)`
  &.KuxMDialog-root {
    min-height: 200px;
    max-height: 220px;
  }
  .KuxDrawer-content {
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
  }
  .KuxModalFooter-root {
    padding: 0;
    margin: 16px 0;
  }
  .checkbox-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 48px;
    >span{
      color: ${(props) => props.theme.colors.text};
    }
  }
`;

const MobileCustomerDisplay = () => {
  const { visible, closeModal } = useMCustomer();
  const { shareDisplayProfit, shareDisplayName } = useGetControlDisplay();
  const { changeDisplayName, changeDisplayRoe } = useSetControlDisplay();

  return (
    <Dialog
      okButtonProps={{ fullWidth: true }}
      okText={_t('confirm')}
      cancelText=""
      show={visible}
      onOk={closeModal}
      onClose={closeModal}
      back={false}
      header={null}
    >
      <div className="checkbox-wrapper">
        <span>{_t('futures.pnlShare.displayName')}</span>
        <Checkbox
          size="small"
          onChange={(e) => {
            const { checked } = e.target;
            changeDisplayName(checked, true);
          }}
          checked={shareDisplayName}
        />
      </div>
      <div className="checkbox-wrapper">
        <span>{_t('futures.pnlShare.displayRoe')}</span>
        <Checkbox
          size="small"
          onChange={(e) => {
            const { checked } = e.target;
            changeDisplayRoe(checked, true);
          }}
          checked={shareDisplayProfit}
        />
      </div>
    </Dialog>
  );
};

export default React.memo(MobileCustomerDisplay);
