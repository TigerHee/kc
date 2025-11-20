import {useMemoizedFn} from 'ahooks';
import React, {memo} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

import ApplyTraderApprovalModal from '../ApplyTraderApprovalModal';
import AuKycRestrictModal from '../AuKycRestrictModal';
import KYCModal from '../KYCModal';
import RestrictModal from '../RestrictModal';

const MountGlobalModal = () => {
  const dispatch = useDispatch();

  const {traderApprovalModalVisible} =
    useSelector(state => state.globalModal, shallowEqual) || {};

  const toggleVisibleByActionType = useMemoizedFn(
    type => type && dispatch({type: `globalModal/${type}`}),
  );

  return (
    <>
      <KYCModal />
      <ApplyTraderApprovalModal
        visible={traderApprovalModalVisible}
        onClose={() => toggleVisibleByActionType('toggleTraderApprovalModal')}
      />

      <RestrictModal />
      <AuKycRestrictModal />
    </>
  );
};

export default memo(MountGlobalModal);
