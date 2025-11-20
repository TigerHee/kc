/**
 * Owner: solar.xia@kupotech.com
 */
import { Dialog, styled } from '@kux/mui';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';

export default function PublicDialog() {
  const dispatch = useDispatch();
  const {
    content,
    title,
    buttonText,
    buttonAction,
    open,
    hideCancel = false,
  } = useSelector((state) => state.aptp.confirmInfo, shallowEqual);
  function handleCancel() {
    dispatch({
      type: 'aptp/changeConfirmVisible',
      payload: {
        open: false,
      },
    });
  }
  const StyledDialog = styled(Dialog)`
    .KuxDialog-body {
      margin: 0 20px !important;
    }
  `;
  return (
    <StyledDialog
      open={open}
      onOk={() => {
        buttonAction(handleCancel);
      }}
      onCancel={handleCancel}
      okText={buttonText}
      cancelText={hideCancel ? '' : _t('2tZpffHG63KjtUMj246ry5')}
      title={title}
      destroyOnClose
    >
      {content}
    </StyledDialog>
  );
}
