/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import { styled } from '@kux/mui/emotion';

import { _t } from 'utils/lang';

import { ICEdit2Outlined } from '@kux/icons';

import { useMCustomer } from '../hook';

const MobileEdit = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  padding: 7px 20px 7px 16px;
  border-radius: 24px;
  background-color: #1d1d1d;
  margin: 12px 0;
  .edit-icon {
    color: #fff;
    margin-right: 4px;
  }
  .edit-text {
    font-size: 14px;
    font-weight: 600;
    line-height: 130%;
    color: #fff;
  }
`;

const MobileDisplay = () => {
  const { openModal } = useMCustomer();

  return (
    <MobileEdit onClick={openModal}>
      <ICEdit2Outlined className="edit-icon" />
      <span className="edit-text">{_t('futures.customerDisplay')}</span>
    </MobileEdit>
  );
};

export default React.memo(MobileDisplay);
