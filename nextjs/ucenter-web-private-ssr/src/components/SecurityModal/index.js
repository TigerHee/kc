/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from 'hooks/useLocale';
import { Checkbox, Dialog, styled, useTheme } from '@kux/mui';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { _t } from 'tools/i18n';

const DesStyled = styled.p`
  font-size: 14px;
  line-height: 22px;
  color: ${(props) => props.theme.colors.text60};
`;

export default () => {
  useLocale();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { needNotice, balance, currency } = useSelector(
    (state) => state.account_security.noticeStatus,
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(needNotice);
    return () => {};
  }, [needNotice]);
  const [checked, setChecked] = useState(false);
  return (
    <Dialog
      open={open}
      title={_t('account.security.ip.modal.title')}
      cancelText={null}
      okText={_t('i.know')}
      onOk={() => {
        if (checked) {
          dispatch({
            type: 'account_security/closeNotice',
          }).then(() => {
            setOpen(false);
          });
        } else {
          setOpen(false);
        }
      }}
      onCancel={() => {
        if (checked) {
          dispatch({
            type: 'account_security/closeNotice',
          }).then(() => {
            setOpen(false);
          });
        } else {
          setOpen(false);
        }
      }}
    >
      <DesStyled theme={theme}>
        {_t('44yoyJ9A6wKbxXnAriSyjo', {
          amount: balance,
          currency,
        })}
      </DesStyled>
      <Checkbox onChange={(e) => setChecked(e.target.checked)} size="small">
        {_t('account.security.ip.modal.checked')}
      </Checkbox>
    </Dialog>
  );
};
