/**
 * Owner: tiger@kupotech.com
 */
import axios from 'axios';
import classnames from 'classnames';
import { Upload, useSnackbar, Spin } from '@kux/mui';
import { useEffect, useState, useMemo } from 'react';
import { isFunction, isString } from 'lodash';
import useLang from '@packages/kyc/src/hookTool/useLang';
import useCommonData from '@kycCompliance/hooks/useCommonData';
import { fetchUploadFile, getFilesUrl } from '@kycCompliance/service';
import Desc from './Desc';
import {
  Wrapper,
  Title,
  ExpandWrapper,
  UploadTriggerContent,
  FileViewList,
  FileViewItem,
  DelIcon,
} from './style';
import {
  UPLOAD_MAX_LENGTH,
  UPLOAD_FILE_SIZE,
  SupportTypeList,
  SupportTypeMap,
  TypeToShortMap,
  getImgBase64,
  STATUS_PENDING,
  STATUS_ERROR,
  STATUS_SUCCESS,
  getFileName,
  getIsImgFromName,
} from './uploadConfig';
import { htmlToReactParser } from '../style';
import fileIcon from './img/file-icon.svg';
import uploadIcon from './img/upload.svg';

export default ({
  componentGroupTitle,
  componentGroupDesc,
  value,
  componentCode,
  form,
  name,
  uiConfig,
  componentTitle,
  componentContent,
}) => {
  const { isSmStyle, isH5 } = useCommonData();
  const { _t } = useLang();
  const { message } = useSnackbar();

  // 文件列表
  const [fileList, setFileList] = useState([]);
  // 是否可以开始调 form 的 onChange
  const [isCanChange, setCanChange] = useState(false);
  // 是否可以初始化数据
  const [isCanInit, setCanInit] = useState(true);
  // 是否展开
  const [isOpen, setOpen] = useState(true);

  const specialConfig = {
    component_130: {
      uploadMaxLength: 10,
      uploadFileSize: 20,
      supportTypeList: ['image/jpeg', 'image/png', 'application/pdf'],
      supportTypeErrMsg: _t('5f05113261ef4000aa1d'),
    },
  };

  useEffect(() => {
    const initData = async () => {
      if (isCanInit && value?.length > 0) {
        if (isString(value)) {
          const arr = value.split(',');
          const res = await getFilesUrl({ fileIds: arr });
          const data = res?.data || {};
          const list = arr
            .map((key) => {
              const url = data[key] || '';
              const name = getFileName(url) || key;
              return {
                key,
                url,
                name,
                uid: key,
                status: STATUS_SUCCESS,
                isImg: getIsImgFromName(name),
                isCanOpenUrl: true,
              };
            })
            .filter((i) => !!i.url);

          setFileList(list);
        } else {
          setFileList(
            value?.map((f) => ({
              ...f,
              uid: f.key || f.name,
              status: STATUS_SUCCESS,
            })),
          );
        }

        setCanInit(false);
      }
    };
    initData();
  }, [isCanInit, value]);

  useEffect(() => {
    if (isCanChange) {
      const validList = fileList.filter((f) => f.status === STATUS_SUCCESS);
      form.setFieldsValue({ [name]: validList });
    }
  }, [fileList, isCanChange]);

  // 最多上传数量
  const uploadMaxLength =
    uiConfig?.fileUploadMaxCount ||
    specialConfig[componentCode]?.uploadMaxLength ||
    UPLOAD_MAX_LENGTH;
  // 文件大小
  const uploadFileSize =
    uiConfig?.fileUploadMaxSize || specialConfig[componentCode]?.uploadFileSize || UPLOAD_FILE_SIZE;

  // 文件格式
  const supportTypeList = useMemo(() => {
    if (uiConfig?.fileUploadSupportTypes) {
      return uiConfig?.fileUploadSupportTypes.map((i) => SupportTypeMap[i]);
    }
    return specialConfig[componentCode]?.supportTypeList || SupportTypeList;
  }, [componentCode, uiConfig]);

  // 格式错误提示文案
  const supportTypeErrMsg = useMemo(() => {
    if (uiConfig?.fileUploadSupportTypes) {
      const fileType = uiConfig?.fileUploadSupportTypes.join('/').toLocaleUpperCase();
      return _t('15aa967c2e934000abe1', { fileType });
    }
    return specialConfig[componentCode]?.supportTypeErrMsg || _t('7a97e9f4772d4000a310');
  }, [componentCode, uiConfig]);

  // 上传前校验
  const beforeUpload = (file) => {
    if (file.size >= uploadFileSize * 1024 * 1024) {
      message.error(_t('a8de7dbd99084000aca7', { num: uploadFileSize }));
      return false;
    }
    if (!supportTypeList.includes(file.type)) {
      message.error(supportTypeErrMsg);
      return false;
    }
    return true;
  };
  // 调上传接口
  const uploadXHR = async ({ file }) => {
    setCanChange(true);

    const exists = fileList.some((f) => f.uid === file.uid);
    // 仅添加新文件，避免 retry 重复
    if (!exists) {
      const newFile = {
        originFile: file,
        isImg: file.type.includes('image'),
        uid: file.uid,
        name: file.name,
        sizeFormat: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        status: STATUS_PENDING,
      };
      setFileList((prev) => [newFile, ...prev]);
    } else {
      // 将状态重置为 pending
      setFileList((prev) =>
        prev.map((f) => (f.uid === file.uid ? { ...f, status: STATUS_PENDING } : f)),
      );
    }

    try {
      const res = await fetchUploadFile({
        file,
        fileType: 'BANK_STATEMENT',
      });

      if (res.success && res.data) {
        const url = await getImgBase64(file);
        setFileList((prev) =>
          prev.map((f) =>
            f.uid === file.uid
              ? {
                  ...f,
                  key: res.data,
                  url,
                  status: STATUS_SUCCESS,
                }
              : f,
          ),
        );
      } else {
        onUploadErr(file);
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        onUploadErr(file);
      }
    }
  };

  // 上传出错处理
  const onUploadErr = (file) => {
    message.error(_t('646c60d657ab4000a088'));
    setFileList((prev) =>
      prev.map((f) => (f.uid === file.uid ? { ...f, status: STATUS_ERROR } : f)),
    );
  };

  // 删除
  const onRemove = (uid) => {
    setCanChange(true);
    setFileList((prev) => prev.filter((f) => f.uid !== uid));
  };

  // 重试
  const handleRetry = (file) => {
    uploadXHR({ file: file.originFile });
  };

  const renderTitle = componentGroupTitle || componentTitle;

  return (
    <Wrapper className={classnames({ isSmStyle: isSmStyle || isH5 })}>
      {renderTitle && (
        <Title
          className={classnames({ isSmStyle: isSmStyle || isH5 })}
          onClick={() => setOpen(true)}
        >
          {renderTitle}
        </Title>
      )}

      <ExpandWrapper isOpen={isOpen}>
        <Desc desc={componentGroupDesc || componentContent} />

        {fileList.length < uploadMaxLength && (
          <Upload beforeUpload={beforeUpload} customRequest={uploadXHR}>
            <Spin spinning={false} type="normal">
              <UploadTriggerContent id={`upload_trigger_${componentCode}`}>
                <img src={uploadIcon} className="triggerIcon" alt="uploadIcon" />
                {isSmStyle ? (
                  <h5 className="triggerTitle">
                    {htmlToReactParser.parse(_t('7e68b06ddff24800a500'))}
                  </h5>
                ) : (
                  <h5 className="triggerTitle">
                    {htmlToReactParser.parse(_t('d813df9853854000acd2'))}
                  </h5>
                )}
                <p className="triggerDesc">
                  {_t('265365122db14000ae31', {
                    fileType: supportTypeList.map((i) => TypeToShortMap[i]).join(', '),
                    maxSize: uploadFileSize,
                    length: fileList.length,
                    maxLength: uploadMaxLength,
                  })}
                </p>
              </UploadTriggerContent>
            </Spin>
          </Upload>
        )}

        {fileList.length > 0 ? (
          <div className="fileLength">
            {_t('53d9513e591f4000a1e2', { length: fileList.length })}
          </div>
        ) : null}

        <FileViewList className={classnames({ isSmStyle: isSmStyle || isH5 })}>
          {fileList.map((item) => {
            const { uid, name, status, sizeFormat, isImg, url, isCanOpenUrl } = item;
            const isPending = status === STATUS_PENDING;
            const isError = status === STATUS_ERROR;
            // 是否显示图片预览
            const isShowPreviewImg = isImg && url;

            return (
              <FileViewItem key={uid}>
                <div className="fileData">
                  <div
                    className={classnames('imgBox', {
                      imgBoxNoBorder: isPending,
                    })}
                    style={
                      isShowPreviewImg
                        ? {
                            backgroundImage: `url(${url})`,
                          }
                        : {}
                    }
                  >
                    {isShowPreviewImg ? null : (
                      <>
                        {isPending ? (
                          <Spin type="normal" spinning />
                        ) : (
                          <img className="fileIcon" src={fileIcon} alt="fileIcon" />
                        )}
                      </>
                    )}
                  </div>

                  <div className="fileInfo">
                    <div
                      role="button"
                      tabIndex={0}
                      className={classnames('fileName', {
                        fileNameErr: isError,
                        cursorPointer: isCanOpenUrl,
                      })}
                      onClick={() => {
                        if (isCanOpenUrl) {
                          window.open(url, '_blank');
                        }
                      }}
                    >
                      {name}
                    </div>
                    {sizeFormat && <p className="fileSize">{sizeFormat}</p>}
                  </div>
                </div>
                <div className="actionBox">
                  {isError && (
                    <span onClick={() => handleRetry(item)} className="fileRetry">
                      {_t('e7a6a8b69b204000ac07')}
                    </span>
                  )}
                  <DelIcon
                    onClick={() => {
                      if (isPending && isFunction(window.fetchUploadCancel)) {
                        window.fetchUploadCancel();
                      }
                      onRemove(uid);
                    }}
                  />
                </div>
              </FileViewItem>
            );
          })}
        </FileViewList>
      </ExpandWrapper>
    </Wrapper>
  );
};
