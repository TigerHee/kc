/**
 * Owner: lori@kupotech.com
 */
import { Form, Spin, Upload, useSnackbar } from '@kux/mui';
import { useDispatch, useSelector } from 'react-redux';
import backBg from 'static/account/auth/back_pic.png';
// import camera from 'static/account/auth/camera.svg';
import frontBg from 'static/account/auth/front_pic.png';
import handlephoneBg from 'static/account/auth/handlephoto_pic.png';
import camera from 'static/account/auth/kyc-upload.svg';
import { _t } from 'tools/i18n';
import compress from 'utils/imageCompressor';
import { FormItemTitle } from '../styled';
import { UploadAre, UploadIcon, UploadIconWrap, UploadImg, UploadTipText } from './styled';

import useResponsiveSSR from '@/hooks/useResponsiveSSR';

const { FormItem } = Form;
const fileTypes = ['.png', '.jpg', '.jpeg'];
const MAX_SIZE = 3;
const imgCompress = true; // 上传图片启用压缩

const defaultLabels = [
  {
    id: 'frontPic',
    label: _t('kyc.form.frontPhoto'),
    uploadBg: frontBg,
  },
  {
    id: 'backPic',
    label: _t('kyc.form.backPhoto'),
    uploadBg: backBg,
  },
  {
    id: 'handPic',
    label: _t('kyc.form.uploadHandlePhotos'),
    uploadBg: handlephoneBg,
  },
];

export default (props) => {
  const dispatch = useDispatch();
  const { message } = useSnackbar();
  const responsive = useResponsiveSSR();
  const isH5 = !responsive.sm;
  const { namespace, id, uploadParams } = props;
  const data = defaultLabels.find((i) => i.id === id);
  const { fields, fieldLoading } = useSelector((state) => state[namespace]);

  const handleBeforeUpload = (file) => {
    const { name, size } = file;
    const dotIndex = name.lastIndexOf('.');
    const fileType = name.slice(dotIndex);
    if (!fileTypes.includes((fileType || '').toLowerCase())) {
      message.error(`Format: ${fileTypes.join(', ')}`);
      return false;
    }
    const sizeMb = size / (1024 * 1024);
    if (sizeMb >= MAX_SIZE) {
      message.error(_t('max.file.size', { size: MAX_SIZE }));
      return false;
    }
    return true;
  };

  const handleUpload = async ({ file }, id) => {
    if (handleBeforeUpload(file)) {
      let uploadFile = file;
      const { size } = file;
      const sizeMb = size / (1024 * 1024);
      if (imgCompress && sizeMb > 1) {
        try {
          uploadFile = await compress(file);
        } catch (e) {
          console.error('图片压缩上传失败', e);
          uploadFile = file;
        }
      }
      dispatch({
        type: `${namespace}/upload`,
        payload: {
          file: uploadFile,
          id,
          uploadParams,
        },
        callBack: (msg) => message.error(msg),
      });
    }
  };

  console.log('data', data);

  return (
    <FormItem name={data.id} label={''} rules={[{ required: !fields?.[data.id], message: '' }]}>
      <Upload
        data-testid={data.id}
        images={[]}
        max={1}
        customRequest={(cfg) => handleUpload(cfg, data.id)}
      >
        <Spin spinning={Boolean(fieldLoading[data.id])} type="normal">
          {fields[data.id] ? (
            <UploadAre style={{ padding: '0' }}>
              <UploadImg src={fields[data.id]?.imgUrl} alt={data.id} />
            </UploadAre>
          ) : (
            <UploadAre>
              <UploadIconWrap>
                <UploadIcon src={camera} alt="camera-icon" />
              </UploadIconWrap>
              <FormItemTitle style={{ margin: !isH5 ? '15px 0 0 0' : '8px 0 4px 0' }}>
                {_t('c8img9ugcig8tbwxQb6wj3')}
              </FormItemTitle>
              <UploadTipText>{data.label}</UploadTipText>
            </UploadAre>
          )}
        </Spin>
      </Upload>
    </FormItem>
  );
};
