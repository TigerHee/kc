/**
 * Owner: odan.ou@kupotech.com
 */
import styled from '@emotion/styled';
import { ICPlusOutlined } from '@kux/icons';
import { Button, Uploader, useSnackbar } from '@kux/mui';
import { forwardRef, useCallback } from 'react';
import { _tHTML } from 'tools/i18n';
import { useLegalUpload } from '../useFetchConf';
import { eTheme, _t } from '../utils';

const UploaderWrap = styled.div`
  .KuxButton-contained {
    padding: 0 16px 0 12px;
    background: ${eTheme('cover2')};
    border: ${eTheme('text20')};
    border-radius: 8px;
  }
`;

const ButtonWrap = styled.div`
  color: ${eTheme('text40')};
`;

const UploadText = styled.span`
  padding-left: 10px;
`;

const UploadItem = forwardRef((props, ref) => {
  const {
    value = [],
    onChange,
    fileSize = 50, // 限制文件大小（MB）
    acceptType = ['.rar', '.pdf', '.zip'], // 支持的文件类型
    maxFiles = 1,
    token,
  } = props;
  const { loading, runAsync } = useLegalUpload();

  const { message } = useSnackbar();

  const fileChecked = useCallback(
    (info, showMsg = true) => {
      const { size, status, name } = info?.file || {};
      const messageError = (...args) => {
        if (!showMsg) return;
        message.error(...args);
      };
      // 删除操作
      if (status === 'removed') return true;
      // 类型
      if (acceptType?.length && !acceptType.some((type) => String(name).endsWith(type))) {
        // 上传文件格式错误: 仅支持{type}
        messageError(_tHTML('assetsBack.form.errMsg5', { type: acceptType.join(', ') }));
        return false;
      }
      // 大小 MB
      const sizeMb = size / (1024 * 1024);
      if (fileSize && sizeMb > fileSize) {
        messageError(_t('uR7eeQ3cKHJ4STsdAUqkgu', `文件大小：最大${sizeMb}MB`, { size: fileSize }));
        return false;
      }
      // 数量
      if (maxFiles && info?.fileList?.length > maxFiles) {
        messageError(_t('rMemj8C3o8RTnA9eRLFnVw', `超过文件数量限制${maxFiles}`, { n: maxFiles }));
        return false;
      }
      return true;
    },
    [message, acceptType, fileSize, maxFiles],
  );

  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      if (!fileChecked({ file }, false)) {
        onError();
        return;
      }
      const res = await runAsync({ file, token });
      if (res) {
        onSuccess(res);
      }
    } catch (error) {
      onError(error);
    }
  };

  const handleChange = async (info) => {
    if (!fileChecked(info)) {
      return;
    }
    onChange(info.fileList);
  };

  return (
    <UploaderWrap>
      <Uploader
        ref={ref}
        disabled={loading}
        onChange={handleChange}
        customRequest={customRequest}
        fileList={value}
        accept={acceptType.join(', ')}
      >
        <Button type="default" loading={loading}>
          <ButtonWrap>
            <ICPlusOutlined />
            <UploadText>
              {/* 上传文件 */} {_t('wsT9PwTNz2JGbSmBJUubDs', '上传文件')}
            </UploadText>
          </ButtonWrap>
        </Button>
      </Uploader>
    </UploaderWrap>
  );
});

export default UploadItem;
