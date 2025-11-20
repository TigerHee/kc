/**
 * Owner: tiger@kupotech.com
 */
import React, { useState, useCallback } from 'react';
import { Dialog, Input, Box, useSnackbar, styled, isPropValid } from '@kux/mui';
import noop from 'lodash/noop';
import useLang from '../../hooks/useLang';

const RowBox = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(() => {
  return {
    width: '100%',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
  };
});

const ImgBox = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(() => {
  return {
    width: 'auto',
    height: '40px',
    background: 'rgba(1,8,30,0.04)',
    borderRadius: '4px',
    '& img': {
      width: 'auto',
      height: '100%',
    },
  };
});

const ExtendDialog = styled(Dialog)`
  .KuxModalFooter-buttonWrapper .KuxButton-root {
    margin-right: 12px;
  }
  .KuxModalFooter-buttonWrapper .KuxButton-root:last-of-type {
    margin-right: 0;
  }
`;

export default function ImageCaptcha(props = {}) {
  const {
    visible = false,
    imgSrc = 'https://pic002.cnblogs.com/images/2012/116671/2012100516070577.png',
    loading = false,
    imgRefresh = () => {},
    onSuccess = noop,
    onClose = () => {},
  } = props;

  const { message } = useSnackbar();

  const { t } = useLang();

  const [inputValue, setInputValue] = useState('');

  const InputChange = (e) => {
    const { value } = e.target;
    setInputValue(value);
  };

  const onOk = useCallback(() => {
    if (!inputValue) {
      message.error(t('verify.img.tip'));
    } else {
      onSuccess(inputValue);
    }
  }, [inputValue, t, message, onSuccess]);

  return (
    <ExtendDialog
      title={t('verify.img.title')}
      open={visible}
      cancelButtonProps={{ size: 'basic' }}
      okButtonProps={{ size: 'basic', loading, disabled: loading }}
      cancelText={t('cancel')}
      okText={t('gfa_btn')}
      onCancel={onClose}
      onOk={onOk}
    >
      <RowBox>
        <ImgBox onClick={imgRefresh}>
          <img src={imgSrc} alt="verify img" />
        </ImgBox>
        <Box style={{ flex: 1 }} ml={8}>
          <Input
            type="text"
            placeholder={t('verify.img.tip')}
            value={inputValue}
            onChange={InputChange}
          />
        </Box>
      </RowBox>
    </ExtendDialog>
  );
}
