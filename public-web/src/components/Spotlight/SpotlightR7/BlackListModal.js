/**
 * Owner: jessie@kupotech.com
 */
import SignedModal from 'components/Spotlight/SpotlightR6/SignedModal';
import get from 'lodash/get';
import { useMemo } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';

const BlackListModal = () => {
  const pageData = useSelector((state) => state.spotlight7.pageData, shallowEqual);
  const qualification = useSelector((state) => state.spotlight7.qualification, shallowEqual);
  const showBlackListDrawer = useSelector((state) => state.spotlight7.showBlackListDrawer);
  const isLogin = useSelector((state) => state.user.isLogin);

  const { signedCountryAgreement } = qualification || {};
  const agreement = get(pageData, 'activity[0].country_agreement');

  const dispatch = useDispatch();

  const handleOk = () => {
    dispatch({
      type: 'spotlight7/signCountryAgreement',
    });
  };

  const handleClose = () => {
    dispatch({
      type: 'spotlight7/update',
      payload: {
        showBlackListDrawer: false,
      },
    });
  };

  const status = useMemo(() => {
    return signedCountryAgreement || !isLogin;
  }, [signedCountryAgreement, isLogin]);

  return (
    <SignedModal
      open={showBlackListDrawer}
      title={_t('quADUKZeLduy86eHpvEKwB')}
      status={status}
      okText={status ? _t('wcL4TJm6SN9PoaUoSkKEfd') : _t('3Gg8gMvQPxBbfcFMhpu3be')}
      onOk={status ? handleClose : handleOk}
      onCancel={handleClose}
    >
      {agreement}
    </SignedModal>
  );
};

export default BlackListModal;
