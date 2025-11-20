/**
 * Owner: tiger@kupotech.com
 */
import React, { useState, useCallback, ChangeEvent } from 'react';
import { Dialog, Input, Box, useSnackbar } from '@kux/mui-next';
import noop from 'lodash-es/noop';
import useLang from '../../hooks/useLang';
import styles from './styles.module.scss';

interface ImageCaptchaProps {
  visible?: boolean;
  imgSrc?: string;
  loading?: boolean;
  imgRefresh?: () => void;
  onSuccess?: (value: string) => void;
  onClose?: () => void;
}

const ImageCaptcha: React.FC<ImageCaptchaProps> = ({
  visible = false,
  imgSrc = 'https://pic002.cnblogs.com/images/2012/116671/2012100516070577.png',
  loading = false,
  imgRefresh = () => {},
  onSuccess = noop,
  onClose = () => {},
}) => {
  const { message } = useSnackbar();
  const { t } = useLang();
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const onOk = useCallback(() => {
    if (!inputValue) {
      message.error(t('verify_img_tip'));
    } else {
      onSuccess(inputValue);
    }
  }, [inputValue, onSuccess, t, message]);

  return (
    <Dialog
      title={t('verify_img_title')}
      open={visible}
      cancelButtonProps={{ size: 'basic' }}
      okButtonProps={{ size: 'basic', loading, disabled: loading }}
      cancelText={t('cancel')}
      okText={t('gfa_btn')}
      onCancel={onClose}
      onOk={onOk}
    >
      <div className={styles.RowBox}>
        <div className={styles.ImgBox} onClick={imgRefresh}>
          <img src={imgSrc} alt="verify img" />
        </div>
        <Box style={{ flex: 1 }} ml={8}>
          <Input
            type="text"
            placeholder={t('verify.img.tip')}
            value={inputValue}
            onChange={handleInputChange}
          />
        </Box>
      </div>
    </Dialog>
  );
};

export default ImageCaptcha;
