/**
 * Owner: jessie@kupotech.com
 */
import SignedModal from 'components/Spotlight/SpotlightR6/SignedModal';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import { useMemo } from 'react';
import { trackClick } from 'utils/ga';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';

const BlackListModal = () => {
  const pageData = useSelector((state) => state.spotlight8.pageData, shallowEqual);
  const qualification = useSelector((state) => state.spotlight8.qualification, shallowEqual);
  const showBlackListDrawer = useSelector((state) => state.spotlight8.showBlackListDrawer);
  const isLogin = useSelector((state) => state.user.isLogin);

  const { signedCountryAgreement } = qualification || {};
  const agreement = get(pageData, 'activity[0].country_agreement');

  const dispatch = useDispatch();

  const handleOk = debounce(
    () => {
      trackClick(['Agree', 'BlackList']);
      dispatch({
        type: 'spotlight8/signCountryAgreement',
      });
    },
    1000,
    { trailing: false, leading: true },
  );

  const handleClose = () => {
    dispatch({
      type: 'spotlight8/update',
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
