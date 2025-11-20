/**
 * Owner: tom@kupotech.com
 */
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Uploader } from '@kufox/mui';
import { useSnackbar } from '@kufox/mui';
import { styled } from '@kufox/mui';
import { _t } from 'tools/i18n';

const BtnWrap = styled.div`
  width: 100%;
  padding: 20px 20px;
  border-radius: 4px;
  border: 1px dashed ${(props) => props.theme.colors.cover8};
  background-color: ${(props) => props.theme.colors.cover4};
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  margin-top: 10px;
`;

const PlusWrap = styled.div`
  width: 12px;
  height: 12px;
  position: relative;
`;

const HorizontalLine = styled.div`
  width: 100%;
  height: 1px;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  background: rgba(115, 126, 141, 1);
`;

const VerticalLine = styled.div`
  width: 1px;
  height: 100%;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(115, 126, 141, 1);
`;

const UploadText = styled.div`
  margin-top: 14px;
  font-size: 12px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
`;

const UploadTip = styled.div`
  margin-top: 4px;
  font-size: 12px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text24};
  text-align: center;
`;

function UploadCmpt({
  fileSize, // 限制文件大小
  overSizeTip, // 超过文件大小的提示语
  uploadTip, // 上传按钮内的提示语
  multipleFiles, // 上传多个文件
  onChange,
  fileList = [],
  acceptType = [], // 支持的文件类型
  acceptTip, // 不支持文件 错误提示
  ...restProps
}) {
  const dispatch = useDispatch();
  const { message } = useSnackbar();

  const checkSize = (size) => {
    const sizeMb = size / (1024 * 1024);
    const isError = sizeMb > fileSize;
    if (isError) {
      message.error(overSizeTip);
    }
    return isError;
  };

  const handleChange = async (info) => {
    const { size, type, status } = info.file || {};

    if (status !== 'removed' && !acceptType.includes(type)) {
      message.error(acceptTip);
      return;
    }
    const isBigger = checkSize(size);
    if (isBigger) {
      return;
    }

    onChange(info.fileList);
  };

  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      const res = await dispatch({
        type: 'listing/uploadFile',
        payload: { file },
      });
      const { success, code } = res || {};
      if (success && code === '200') {
        onSuccess(res.data);
      }
    } catch (error) {
      onError(error);
    }
  };

  const renderBtn = useMemo(() => {
    if (fileList.length === 0 || multipleFiles) {
      return (
        <BtnWrap>
          <PlusWrap>
            <HorizontalLine />
            <VerticalLine />
          </PlusWrap>
          <UploadText>{_t('vVkC24hiW6FLFz6Ai5iYqh')}</UploadText>
          <UploadTip>{uploadTip}</UploadTip>
        </BtnWrap>
      );
    }
    return null;
  }, [fileList, uploadTip, multipleFiles]);

  return (
    <Uploader
      {...restProps}
      fileList={fileList}
      onChange={handleChange}
      customRequest={customRequest}
    >
      {renderBtn}
    </Uploader>
  );
}

export default UploadCmpt;
