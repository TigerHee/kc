import { Button, Divider, Form, ImageOverlay, Preview, toast, Upload, useTheme } from '@kux/design';
import { HookIcon } from '@kux/iconpack';
import { useMemo, useState } from 'react';
import { getBase64 } from 'src/helper';
import { uploadImg } from 'src/services/authentication';
import { _t } from 'src/tools/i18n';
import handheldIdcard from 'static/ucenter/reset-security/handheld_idcard.svg';
import idTypeIcon from 'static/ucenter/reset-security/idcard_correct.svg';
import error1 from 'static/ucenter/reset-security/idcard_wrong_1.svg';
import error2 from 'static/ucenter/reset-security/idcard_wrong_2.svg';
import error3 from 'static/ucenter/reset-security/idcard_wrong_3.svg';
import { UPLOAD_ACCEPT, UPLOAD_SIZE } from '../../constants';
import * as commonStyles from '../styles.module.scss';
import * as styles from './styles.module.scss';

const { FormItem } = Form;

/** @todo 缺少黑夜模式 */
const CERT_REMIND_LIST = [
  {
    title: () => _t('account.kyc.kyc2.imgGuide1'),
    icon: idTypeIcon,
    iconDark: idTypeIcon,
    isWrong: false,
  },
  {
    title: () => _t('account.kyc.kyc2.imgGuide2'),
    icon: error1,
    iconDark: error1,
    isWrong: true,
  },
  {
    title: () => _t('account.kyc.kyc2.imgGuide3'),
    icon: error2,
    iconDark: error2,
    isWrong: true,
  },
  {
    title: () => _t('account.kyc.kyc2.imgGuide4'),
    icon: error3,
    iconDark: error3,
    isWrong: true,
  },
];

export default function KycCertVerification({ token, onNext }) {
  const [form] = Form.useForm();
  const theme = useTheme();
  const isDark = theme.currentTheme === 'dark';
  const frontPhoto = Form.useWatch('frontPhoto', form);
  const backPhoto = Form.useWatch('backPhoto', form);
  const handlePhoto = Form.useWatch('handlePhoto', form);
  const [previewUrl, setPreviewUrl] = useState('');

  const rules = useMemo(() => [{ required: true, message: _t('kyc.form.required') }], []);

  const canSubmit = Boolean(frontPhoto && backPhoto && handlePhoto);

  const beforeUpload = (file) => {
    if (file.size <= UPLOAD_SIZE) {
      return true;
    }
    toast.info(_t('e3149ca1553c4000a4fd', { size: 5 }));
    return false;
  };

  const customRequest = async (name, options) => {
    try {
      const file = options.file.originalFile;
      const res = await uploadImg({ file, token });
      form.setFieldsValue({ [name]: { ...res.data, url: await getBase64(file) } });
      options.onSuccess();
    } catch (error) {
      toast.error(error?.msg || error?.message);
      options.onError(error);
    }
  };

  const handleDelete = (name) => {
    form.setFieldsValue({ [name]: undefined });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onNext({
        backPic: values.backPhoto?.original,
        backPicMini: values.backPhoto?.mini,
        handPic: values.handlePhoto?.original,
        handPicMini: values.handlePhoto?.mini,
        frontPic: values.frontPhoto?.original,
        frontPicMini: values.frontPhoto?.mini,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={commonStyles.container}>
      <div className={commonStyles.header}>{_t('01ec7d2744564000abad')}</div>
      <Form form={form} className={styles.content}>
        <section className={styles.firstSection}>
          <span className={styles.title}>{_t('cd9685f48cbb4800a657')}</span>
          <div className={styles.subContent}>
            <div className={styles.subItem}>
              <span>{_t('efec9e9631c84800a57c')}</span>
              <div className={styles.certRemind}>
                {CERT_REMIND_LIST.map((item) => {
                  const title = item.title();
                  return (
                    <div className={styles.certRemindItem} key={title}>
                      <img src={isDark ? item.iconDark : item.icon} alt="remind" />
                      <span>{title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <Divider />
            <div className={styles.subItem}>
              <span>{_t('5738d204e1064000aa47')}</span>
              <FormItem name="frontPhoto" rules={rules}>
                <Upload
                  accept={UPLOAD_ACCEPT}
                  beforeUpload={beforeUpload}
                  customRequest={(options) => customRequest('frontPhoto', options)}
                  description={_t('d0411550484b4800a2a0')}
                >
                  {frontPhoto ? (
                    <ImageOverlay
                      url={frontPhoto.url}
                      onPreview={() => setPreviewUrl(frontPhoto.url)}
                      onDelete={() => handleDelete('frontPhoto')}
                    />
                  ) : null}
                </Upload>
              </FormItem>
            </div>
            <div className={styles.subItem}>
              <span>{_t('af62bcf846084000a9fe')}</span>
              <FormItem name="backPhoto" rules={rules}>
                <Upload
                  accept={UPLOAD_ACCEPT}
                  beforeUpload={beforeUpload}
                  customRequest={(options) => customRequest('backPhoto', options)}
                  description={_t('d0411550484b4800a2a0')}
                >
                  {backPhoto ? (
                    <ImageOverlay
                      url={backPhoto.url}
                      onPreview={() => setPreviewUrl(backPhoto.url)}
                      onDelete={() => handleDelete('backPhoto')}
                    />
                  ) : null}
                </Upload>
              </FormItem>
            </div>
          </div>
        </section>
        <section className={styles.secondSection}>
          <span className={styles.title}>{_t('5dd2cc4a95734000a0ae')}</span>
          <div className={styles.subContent}>
            <div className={styles.subItem}>
              <span>{_t('efec9e9631c84800a57c')}</span>
              <div className={styles.handheldIdcardWrapper}>
                <img src={handheldIdcard} alt="remind" />
                <div>
                  <div>
                    <HookIcon size="small" color="var(--kux-brandGreen)" />
                    <span>{_t('01a6a7b173504000a73f')}</span>
                  </div>
                  <div>
                    <HookIcon size="small" color="var(--kux-brandGreen)" />
                    <span>{_t('84b985213a1e4000a41a')}</span>
                  </div>
                </div>
              </div>
            </div>
            <Divider />
            <div className={styles.subItem}>
              <span>{_t('208bb2765c834800a0b5')}</span>
              <FormItem name="handlePhoto" rules={rules}>
                <Upload
                  accept={UPLOAD_ACCEPT}
                  beforeUpload={beforeUpload}
                  customRequest={(options) => customRequest('handlePhoto', options)}
                  description={_t('d0411550484b4800a2a0')}
                >
                  {handlePhoto ? (
                    <ImageOverlay
                      url={handlePhoto.url}
                      onPreview={() => setPreviewUrl(handlePhoto.url)}
                      onDelete={() => handleDelete('handlePhoto')}
                    />
                  ) : null}
                </Upload>
              </FormItem>
            </div>
            <div className={styles.handheldIdcardTips}>{_t('1df3befb6b354800a50c')}</div>
          </div>
        </section>
        <div className={styles.submitBtnWrapper}>
          <Button
            type="primary"
            size="large"
            fullWidth
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {_t('next')}
          </Button>
        </div>
      </Form>
      <Preview
        images={[{ src: previewUrl }]}
        isOpen={Boolean(previewUrl)}
        onClose={() => setPreviewUrl('')}
      />
    </div>
  );
}
