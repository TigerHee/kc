/**
 * Owner: lori@kupotech.com
 */
import { Form, Spin, Upload, useResponsive, useSnackbar } from '@kux/mui';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import backBg from 'static/account/auth/back_pic.png';
import frontBg from 'static/account/auth/front_pic.png';
import handlephoneBg from 'static/account/auth/handlephoto_pic.png';
import camera from 'static/account/auth/kyc-upload.svg';
import { _t } from 'tools/i18n';
import compress from 'utils/imageCompressor';
import { FormItemTitle } from '../styled';
import { UploadAre, UploadIcon, UploadIconWrap, UploadImg, UploadTipText } from './styled';

const { FormItem } = Form;

const fileTypes = ['.png', '.jpg', '.jpeg'];
const MAX_SIZE = 4;
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
  const responsive = useResponsive();
  const isH5 = !responsive.sm;
  const { message } = useSnackbar();
  const { namespace, id } = props;
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
        },
        callBack: (msg) => message.error(msg),
      });
    }
  };

  return (
    <FormItem name={data.id} rules={[{ required: !fields[data.id], message: '' }]}>
      <Upload images={[]} max={1} customRequest={(cfg) => handleUpload(cfg, data.id)}>
        <Spin spinning={Boolean(fieldLoading[data.id])} type="normal">
          {fields[data.id] ? (
            <UploadAre style={{ padding: '0' }}>
              <UploadImg src={fields[data.id]?.imgUrl} alt={data.id} />
            </UploadAre>
          ) : (
            <UploadAre
            // style={{
            //   backgroundImage: `url(${data.uploadBg})`,
            //   backgroundColor: 'rgba(0, 0, 0, 0.02)',
            // }}
            >
              <UploadIconWrap>
                <UploadIcon src={camera} alt="camera-icon" />
              </UploadIconWrap>
              <FormItemTitle style={{ margin: !isH5 ? '15px 0 0 0' : '8px 0 4px 0' }}>
                {_t('c8img9ugcig8tbwxQb6wj3')}
              </FormItemTitle>
              <UploadTipText>{_t('biz.tips.front')}</UploadTipText>
            </UploadAre>
          )}
        </Spin>
      </Upload>
    </FormItem>
  );
};
