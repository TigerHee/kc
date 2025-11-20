/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import useMergedState from 'hooks/useMergedState';
import useTheme from 'hooks/useTheme';
import styled, { isPropValid } from 'emotion/index';
import UploadButton from './UploadButton';

import BaseUpload from './BaseUploader/BaseUploader';

import { getFileItem, file2Obj, updateFileList, removeFileItem } from './aux';

import List from './List';

export const LIST_IGNORE = `__LIST_IGNORE_${Date.now()}__`;

const RenderButtonBox = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ listType, theme }) => {
  return {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
    listStyle: 'none',
    ...(listType === 'text' && {
      display: 'inline-block',
    }),
    ...(listType === 'picture-card' && {
      display: 'inline-block',
      width: '100px',
      height: '100px',
      background: theme.colors.cover4,
      borderRadius: '4px',
      border: `1px dashed ${theme.colors.cover4}`,
      margin: '0 12px 12px 0',
      cursor: 'pointer',
      textAlign: 'center',
      verticalAlign: 'top',
      '&:hover': {
        borderColor: theme.colors.cover8,
      },
    }),
  };
});

const PictureWrapper = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(() => {
  return {
    width: '100%',
    display: 'inline-block',
  };
});

const Uploader = React.forwardRef((props, ref) => {
  const {
    fileList,
    defaultFileList,
    onRemove,
    showUploadList,
    listType,
    onPreview,
    onChange,
    disabled,
    children,
    maxCount,
  } = props;

  const upload = React.useRef();

  const theme = useTheme();

  const [mergedFileList, setMergedFileList] = useMergedState(defaultFileList || [], {
    value: fileList,
    postState: (list) => list || [],
  });

  React.useMemo(() => {
    const timestamp = Date.now();

    (fileList || []).forEach((file, index) => {
      if (!file.uid && !Object.isFrozen(file)) {
        file.uid = `__AUTO__${timestamp}_${index}__`;
      }
    });
  }, [fileList]);

  const onInnerChange = (file, changedFileList, event) => {
    let cloneList = [...changedFileList];

    if (maxCount === 1) {
      cloneList = cloneList.slice(-1);
    } else if (maxCount) {
      cloneList = cloneList.slice(0, maxCount);
    }

    setMergedFileList(cloneList);

    const changeInfo = {
      file,
      fileList: cloneList,
    };

    if (event) {
      changeInfo.event = event;
    }

    onChange?.(changeInfo);
  };

  const mergedBeforeUpload = async (file, fileListArgs) => {
    const { beforeUpload, transformFile } = props;

    let parsedFile = file;
    if (beforeUpload) {
      const result = await beforeUpload(file, fileListArgs);

      if (result === false) {
        return false;
      }

      delete file[LIST_IGNORE];
      if (result === LIST_IGNORE) {
        Object.defineProperty(file, LIST_IGNORE, {
          value: true,
          configurable: true,
        });
        return false;
      }

      if (typeof result === 'object' && result) {
        parsedFile = result;
      }
    }

    if (transformFile) {
      parsedFile = await transformFile(parsedFile);
    }

    return parsedFile;
  };

  const onBatchStart = (batchFileInfoList) => {
    const filteredFileInfoList = batchFileInfoList.filter((info) => !info.file[LIST_IGNORE]);

    if (!filteredFileInfoList.length) {
      return;
    }

    const objectFileList = filteredFileInfoList.map((info) => file2Obj(info.file));

    let newFileList = [...mergedFileList];

    objectFileList.forEach((fileObj) => {
      newFileList = updateFileList(fileObj, newFileList);
    });

    objectFileList.forEach((fileObj, index) => {
      let triggerFileObj = fileObj;

      if (!filteredFileInfoList[index].parsedFile) {
        const { originFileObj } = fileObj;

        let clone;
        try {
          clone = new File([originFileObj], originFileObj.name, {
            type: originFileObj.type,
          });
        } catch (e) {
          clone = new Blob([originFileObj], {
            type: originFileObj.type,
          });
          clone.name = originFileObj.name;
          clone.lastModifiedDate = new Date();
          clone.lastModified = new Date().getTime();
        }

        clone.uid = fileObj.uid;
        triggerFileObj = clone;
      } else {
        fileObj.status = 'uploading';
      }

      onInnerChange(triggerFileObj, newFileList);
    });
  };

  const onSuccess = (response, file, xhr) => {
    try {
      if (typeof response === 'string') {
        response = JSON.parse(response);
      }
    } catch (e) {
      console.log(e);
    }

    if (!getFileItem(file, mergedFileList)) {
      return;
    }

    const targetItem = file2Obj(file);
    targetItem.status = 'done';
    targetItem.percent = 100;
    targetItem.response = response;
    targetItem.xhr = xhr;

    const nextFileList = updateFileList(targetItem, mergedFileList);

    onInnerChange(targetItem, nextFileList);
  };

  const onProgress = (e, file) => {
    if (!getFileItem(file, mergedFileList)) {
      return;
    }

    const targetItem = file2Obj(file);
    targetItem.status = 'uploading';
    targetItem.percent = e.percent;

    const nextFileList = updateFileList(targetItem, mergedFileList);

    onInnerChange(targetItem, nextFileList, e);
  };

  const onError = (error, response, file) => {
    if (!getFileItem(file, mergedFileList)) {
      return;
    }

    const targetItem = file2Obj(file);
    targetItem.error = error;
    targetItem.response = response;
    targetItem.status = 'error';

    const nextFileList = updateFileList(targetItem, mergedFileList);

    onInnerChange(targetItem, nextFileList);
  };

  const handleRemove = (file) => {
    let currentFile;
    Promise.resolve(typeof onRemove === 'function' ? onRemove(file) : onRemove).then((ret) => {
      if (ret === false) {
        return;
      }

      const removedFileList = removeFileItem(file, mergedFileList);

      if (removedFileList) {
        currentFile = { ...file, status: 'removed' };
        mergedFileList?.forEach((item) => {
          const matchKey = currentFile.uid !== undefined ? 'uid' : 'name';
          if (item[matchKey] === currentFile[matchKey] && !Object.isFrozen(item)) {
            item.status = 'removed';
          }
        });
        upload.current?.abort(currentFile);

        onInnerChange(currentFile, removedFileList);
      }
    });
  };

  React.useImperativeHandle(ref, () => ({
    onBatchStart,
    onSuccess,
    onProgress,
    onError,
    fileList: mergedFileList,
    upload: upload.current,
  }));

  const baseUploadProps = {
    onBatchStart,
    onError,
    onProgress,
    onSuccess,
    ...props,
    beforeUpload: mergedBeforeUpload,
    onChange: undefined,
  };

  if (!children || disabled) {
    delete baseUploadProps.id;
  }

  if (listType === 'picture-card') {
    baseUploadProps.style = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      textAlign: 'center',
    };
  }

  const renderUploadList = (button, buttonVisible) => {
    return (
      <>
        {showUploadList ? (
          <List
            listType={listType}
            items={mergedFileList}
            onPreview={onPreview}
            onRemove={handleRemove}
            appendAction={button}
            appendActionVisible={buttonVisible}
          />
        ) : (
          button
        )}
      </>
    );
  };

  const renderUploadButton = (uploadButtonStyle) => (
    <RenderButtonBox theme={theme} listType={listType} style={uploadButtonStyle}>
      <BaseUpload {...baseUploadProps} ref={upload} />
    </RenderButtonBox>
  );

  if (listType === 'picture-card') {
    return <PictureWrapper>{renderUploadList(renderUploadButton(), !!children)}</PictureWrapper>;
  }
  return (
    <span>
      {renderUploadButton(children ? undefined : { display: 'none' })}
      {renderUploadList()}
    </span>
  );
});

Uploader.UploadButton = UploadButton;

Uploader.propTypes = {
  listType: PropTypes.oneOf(['text', 'picture-card']),
  showUploadList: PropTypes.bool,
  multiple: PropTypes.bool,
  data: PropTypes.object,
  action: PropTypes.string,
  accept: PropTypes.string,
  disabled: PropTypes.bool,
  supportServerRender: PropTypes.bool,
};

Uploader.defaultProps = {
  listType: 'text',
  multiple: false,
  action: '',
  data: {},
  accept: '',
  showUploadList: true,
  disabled: false,
  supportServerRender: true,
};

export default Uploader;
