/**
 * Owner: charles.yang@kupotech.com
 */
import React, { useState, useImperativeHandle, memo, forwardRef } from 'react';
import modalSuccess from '@/assets/openFutures/modalSuccess.png';
import { styled } from '@kux/mui/emotion';
import { Dialog, Button } from '@kux/mui';

import { _t, _tHTML } from 'utils/lang';

const ContentBox = styled.div`
  width: 100%;
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  /* or 24px */
  text-align: center;
  color: ${(props) => props.theme.colors.text60};
  padding: 0 48px;
`;

const DialogContent = styled(Dialog)`
  .KuxModalHeader-root {
    display: none;
  }
`;

const TitleContent = styled.div`
  font-weight: 700;
  font-size: 28px;
  line-height: 130%;
  /* or 36px */

  text-align: center;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 16px;
  text-align: center;
`;

const StatusImg = styled.div`
  width: 100%;
  height: 188px;
  margin-bottom: 16px;
  padding-top: 48px;
  text-align: center;
`;

const FooterContent = styled.div`
  text-align: center;
  color: ${(props) => props.theme.colors.text60};
  padding: 40px 80px 48px;
`;

const OpenSuccessDialog = (__, ref) => {
  const [open, setOpen] = useState(false);
  const [isBonus, setIsBons] = useState(false);

  const text = React.useMemo(() => {
    let type = _t('open.futures.body.default');
    if (isBonus) {
      type = _t('open.futures.body.no.bonus');
    }
    return type;
  }, [isBonus]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOk = () => {
    handleClose();
  };

  useImperativeHandle(ref, () => ({
    open: (data) => {
      setOpen(true);
      setIsBons(data);
    },
    close: () => {
      handleClose();
    },
  }));

  return (
    <DialogContent
      open={open}
      onCancel={handleClose}
      onOk={handleOk}
      okText={_t('confirm')}
      cancelText={null}
      showCloseX={false}
      maxWidth={false}
      footer={
        <FooterContent>
          <Button size={'large'} fullWidth onClick={handleOk}>
            {_t('confirm')}
          </Button>
        </FooterContent>
      }
    >
      <StatusImg>
        <img width={140} height={140} src={modalSuccess} alt="" />
      </StatusImg>
      <TitleContent>{_t('open.futures.success')}</TitleContent>
      <ContentBox>{text}</ContentBox>
    </DialogContent>
  );
};

export default memo(forwardRef(OpenSuccessDialog));
