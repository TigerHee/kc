/**
 * Owner: jessie@kupotech.com
 */
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import { locateToUrl } from 'TradeActivity/utils';
import StatusModal, { EnumStatus } from 'TradeActivityCommon/StatusModal';

export default () => {
  const dispatch = useDispatch();

  const statusModalVisible = useSelector((state) => state.gempool.statusModalVisible);
  const statusModalJumpLink = useSelector((state) => state.gempool.statusModalJumpLink);

  const handleStatusSubmit = useCallback(() => {
    if (statusModalJumpLink) {
      locateToUrl(statusModalJumpLink);
    }
  }, [statusModalJumpLink]);

  const handleVisible = useCallback(() => {
    dispatch({
      type: 'gempool/update',
      payload: {
        statusModalVisible: false,
      },
    });
  }, [dispatch]);

  return (
    <StatusModal
      visible={statusModalVisible}
      setDialogVisible={handleVisible}
      resultStatus={EnumStatus.Warning}
      contentTitle={_t('e8d40930604f4000ad7e')}
      contentText={statusModalJumpLink ? _t('8f11ed838f484000afa9') : ''}
      handleSubmit={handleStatusSubmit}
      okText={statusModalJumpLink ? _t('view') : _t('2e7e916fa6934000a923')}
      cancelText={statusModalJumpLink ? _t('back') : null}
    />
  );
};
