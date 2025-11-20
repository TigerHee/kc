/**
 * Owner: jessie@kupotech.com
 */
import get from 'lodash/get';
import { useMemo } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import SignedModal from './SignedModal';

const AgreeModal = () => {
  const isLogin = useSelector((state) => state.user.isLogin);
  const showAgreementDrawer = useSelector((state) => state.spotlight.showAgreementDrawer);
  const qualification = useSelector((state) => state.spotlight.qualification, shallowEqual);
  const pageData = useSelector((state) => state.spotlight.pageData, shallowEqual);
  const agreement = get(pageData, 'activity[0].agreement');
  const { signedAgreement } = qualification || {};

  const dispatch = useDispatch();

  const handleOk = () => {
    dispatch({
      type: 'spotlight/signAgreement',
    });
  };

  const handleClose = () => {
    dispatch({
      type: 'spotlight/update',
      payload: {
        showAgreementDrawer: false,
      },
    });
  };

  const status = useMemo(() => {
    return signedAgreement || !isLogin;
  }, [signedAgreement, isLogin]);

  return (
    <SignedModal
      title={_t('584aDq5v1gApdLcKRbRw1g')}
      open={showAgreementDrawer}
      status={status}
      okText={status ? _t('wcL4TJm6SN9PoaUoSkKEfd') : _t('3Gg8gMvQPxBbfcFMhpu3be')}
      onOk={status ? handleClose : handleOk}
      onCancel={handleClose}
    >
      {agreement}
    </SignedModal>
  );
};

export default AgreeModal;
