/**
 * Owner: jessie@kupotech.com
 */
import SignedModal from 'components/Spotlight/SpotlightR6/SignedModal';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import { trackClick } from 'utils/ga';
import { useMemo } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';

const AgreeModal = () => {
  const isLogin = useSelector((state) => state.user.isLogin);
  const showAgreementDrawer = useSelector((state) => state.spotlight8.showAgreementDrawer);
  const qualification = useSelector((state) => state.spotlight8.qualification, shallowEqual);
  const pageData = useSelector((state) => state.spotlight8.pageData, shallowEqual);
  const agreement = get(pageData, 'activity[0].agreement');
  const { signedAgreement } = qualification || {};

  const dispatch = useDispatch();

  const handleOk = debounce(
    () => {
      trackClick(['Agree', 'Agreement']);
      dispatch({
        type: 'spotlight8/signAgreement',
      });
    },
    1000,
    { trailing: false, leading: true },
  );

  const handleClose = () => {
    dispatch({
      type: 'spotlight8/update',
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
      // TOKEN Sale Agreement
      title={_t('c2367b07117b4000af2d')}
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
