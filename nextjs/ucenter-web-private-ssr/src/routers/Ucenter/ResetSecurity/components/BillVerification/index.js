import { Alert, Button, ImageOverlay, Preview, toast, Upload } from '@kux/design';
import { HookIcon } from '@kux/iconpack';
import { useState } from 'react';
import { getBase64 } from 'src/helper';
import { uploadImg } from 'src/services/authentication';
import { _t } from 'src/tools/i18n';
import { UPLOAD_ACCEPT, UPLOAD_SIZE } from '../../constants';
import * as commonStyles from '../styles.module.scss';
import * as styles from './styles.module.scss';

export default function BillVerification({ token, onNext }) {
  const [target, setTarget] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);

  const beforeUpload = (file) => {
    if (file.size <= UPLOAD_SIZE) {
      return true;
    }
    toast.info(_t('e3149ca1553c4000a4fd', { size: 5 }));
    return false;
  };

  const customRequest = async (options) => {
    try {
      const file = options.file.originalFile;
      const res = await uploadImg({ file, token });
      setTarget({ ...res.data, url: await getBase64(file) });
      options.onSuccess();
    } catch (error) {
      toast.error(error?.msg || error?.message);
      options.onError(error);
    }
  };

  const handleDelete = () => {
    setTarget(null);
  };

  const handleSubmit = () => {
    onNext({ thirdPartDepositPic: target?.original });
  };

  return (
    <div className={commonStyles.container}>
      <div className={commonStyles.header}>{_t('01ec7d2744564000abad')}</div>
      <div className={styles.uploadWrapper}>
        <span className={styles.label}>{_t('4f808e968e664800a7dc')}</span>
        <Upload accept={UPLOAD_ACCEPT} beforeUpload={beforeUpload} customRequest={customRequest}>
          {target ? (
            <ImageOverlay
              url={target.url}
              onPreview={() => setOpenPreview(true)}
              onDelete={handleDelete}
            />
          ) : null}
        </Upload>
      </div>
      <div className={styles.conditionWrapper}>
        <div className={styles.label}>{_t('2f04315ed5474000ac05')}</div>
        <div className={styles.content}>
          <div className={styles.item}>
            <HookIcon size="small" color="var(--kux-brandGreen)" />
            <span>{_t('6a9ed2acf50f4800a25e')}</span>
          </div>
          <div className={styles.item}>
            <HookIcon size="small" color="var(--kux-brandGreen)" />
            <span>{_t('8dd6a0a2cc134000a8fc')}</span>
          </div>
          <div className={styles.item}>
            <HookIcon size="small" color="var(--kux-brandGreen)" />
            <span>{_t('522dec46901e4800a3a6')}</span>
          </div>
          <div className={styles.item}>
            <HookIcon size="small" color="var(--kux-brandGreen)" />
            <span>{_t('2ea38ce358544800ac3b')}</span>
          </div>
          <div className={styles.item}>
            <HookIcon size="small" color="var(--kux-brandGreen)" />
            <span>{_t('01eca8078fd24800a57b')}</span>
          </div>
        </div>
      </div>
      <div className={styles.alertWrapper}>
        <Alert type="info" duration={0} message={_t('1de58a2f44124800ad9d')} />
      </div>
      <div className={styles.btnWrapper}>
        <Button type="primary" size="large" fullWidth onClick={handleSubmit}>
          {_t('confirm')}
        </Button>
      </div>
      <Preview
        images={[{ src: target?.url }]}
        isOpen={openPreview}
        onClose={() => setOpenPreview(false)}
      />
    </div>
  );
}
