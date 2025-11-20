/**
 * Owner: willen@kupotech.com
 */
import { Dialog, Select, styled, useSnackbar } from '@kux/mui';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { _t } from 'tools/i18n';

const ExtendDialog = styled(Dialog)`
  .KuxSelect-itemLabel {
    font-weight: 600;
  }
  .KuxSelect-dropdownIcon svg {
    fill: ${({ theme }) => theme.colors.text};
  }
  & .KuxDialog-content {
    padding-top: 5px;
  }
`;

const ModifyTimeZoneModal = ({ open, onCancel }) => {
  const [value, setValue] = useState(1);
  const user = useSelector((state) => state.user.user);
  const timeZones = useSelector((s) => s.user.timeZones);
  const loading = useSelector((s) => s.loading);
  const dispatch = useDispatch();
  const { message } = useSnackbar();

  useEffect(() => {
    if (user?.timeZone && open) {
      setValue(user.timeZone);
    }
  }, [user, open]);

  const onOk = async () => {
    await dispatch({ type: 'user/setLocal', payload: { params: { timeZone: value } } });
    message.success(_t('operation.succeed'));
    onCancel && onCancel();
  };

  return (
    <ExtendDialog
      cancelText={null}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      title={_t('s6A9WL4t6rPEcTMXt8tMPr')}
      okText={_t('save')}
      okButtonProps={{
        loading: loading.effects['user/setLocal'],
      }}
    >
      <Select
        label={_t('time.zone')}
        value={value}
        onChange={(e) => setValue(e)}
        size="xlarge"
        options={timeZones.map((i) => ({
          label: () => i[1],
          value: i[0],
        }))}
      />
    </ExtendDialog>
  );
};

export default ModifyTimeZoneModal;
