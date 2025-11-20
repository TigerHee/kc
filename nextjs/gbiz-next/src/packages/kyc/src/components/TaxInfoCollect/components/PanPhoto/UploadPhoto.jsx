/**
 * Owner: tiger@kupotech.com
 */
import { useState } from 'react';
import { styled, Upload, useSnackbar, Spin } from '@kux/mui';
import clsx from 'clsx';
import useLang from 'packages/kyc/src/hookTool/useLang';
import { getImgBase64 } from 'packages/kyc/src/common/tools';
import { uploadFile } from '../../service';
import uploadIcon from './img/uploadIcon.svg';

const StyledUpload = styled(Upload)`
  width: 100%;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  border: 1px dashed var(--color-text20);
  background-color: var(--color-cover2);
  .KuxUpload-wrapper {
    display: flex;
    width: 100%;
    height: fit-content;
  }
  .KuxUpload-contentWrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 100;
  }
  .KuxSpin-root {
    width: 100%;
  }
`;
const CustomBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 32px;
  width: 100%;
  &.hidden {
    visibility: hidden;
  }
`;
const IconBox = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  background-color: var(--color-cover4);
  img {
    width: 16px;
    height: 16px;
  }
`;
const Title = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 130%;
  text-align: center;
  margin-bottom: 4px;
  color: var(--color-text);
`;
const Desc = styled.div`
  font-size: 12px;
  font-weight: 400;
  line-height: 130%;
  text-align: center;
  color: var(--color-text40);
`;

// 上传文件大小限制 20M
const UPLOAD_FILE_SIZE = 20 * 1024 * 1024;
// 支持的文件类型
const SupportTypeList = ['image/jpeg', 'image/png', 'application/pdf'];

export default ({ onChange }) => {
  const { _t } = useLang();
  const { message } = useSnackbar();
  const [isLoading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  const beforeUpload = (file) => {
    if (file.size >= UPLOAD_FILE_SIZE) {
      message.error(_t('a8de7dbd99084000aca7', { num: 20 }));
      return false;
    }
    if (!SupportTypeList.includes(file.type)) {
      // 文件类型限制
      message.error(_t('5f05113261ef4000aa1d'));
      return false;
    }
  };

  const uploadXHR = async ({ file }) => {
    setLoading(true);
    try {
      const res = await uploadFile({
        file,
        kycType: 0,
        photoType: 0,
      });
      if (res.success && res.data) {
        const url = await getImgBase64(file);
        const newFile = [
          {
            url,
            key: res?.data,
          },
        ];
        setImages(newFile);
        onChange(res?.data);
      } else {
        // 上传失败，请重试
        message.error(_t('646c60d657ab4000a088'));
      }

      setLoading(false);
    } catch (error) {
      message.error(_t('646c60d657ab4000a088'));
      setLoading(false);
    }
  };

  return (
    <StyledUpload
      beforeUpload={beforeUpload}
      disabled={isLoading}
      images={images}
      customRequest={uploadXHR}
      onRemove={() => {
        setImages([]);
        onChange(null);
      }}
    >
      <Spin spinning={isLoading} size="xsmall">
        <CustomBox
          className={clsx({
            hidden: images[0],
          })}
        >
          <IconBox>
            <img src={uploadIcon} alt="upload" />
          </IconBox>
          <Title>{_t('c1f237568ea64000a305')}</Title>
          <Desc>{_t('56905a694b8b4000ad97', { num: 20 })}</Desc>
        </CustomBox>
      </Spin>
    </StyledUpload>
  );
};
