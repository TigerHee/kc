/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import pickAttrs from './pickAttrs';
import defaultRequest from './request';
import getUid from './uuid';
import attrAccept from './attr-accept';
import traverseFileTree from './traverseFileTree';

class AjaxUploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = { uid: getUid() };
    this.reqs = {};
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.abort();
  }

  onFileDrop = (e) => {
    const { multiple } = this.props;

    e.preventDefault();

    if (e.type === 'dragover') {
      return;
    }

    if (this.props.directory) {
      traverseFileTree(
        Array.prototype.slice.call(e.dataTransfer.items),
        this.uploadFiles,
        (_file) => attrAccept(_file, this.props.accept),
      );
    } else {
      let files = [...e.dataTransfer.files].filter((file) => attrAccept(file, this.props.accept));

      if (multiple === false) {
        files = files.slice(0, 1);
      }

      this.uploadFiles(files);
    }
  };

  onKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.onClick(e);
    }
  };

  onClick = (e) => {
    const el = this.fileInput;
    if (!el) {
      return;
    }
    const { children, onClick } = this.props;
    if (children && children.type === 'button') {
      const parent = el.parentNode;
      parent.focus();
      parent.querySelector('button').blur();
    }
    el.click();
    if (onClick) {
      onClick(e);
    }
  };

  onChange = (e) => {
    const { accept, directory } = this.props;
    const { files } = e.target;
    const acceptedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!directory || attrAccept(file, accept)) {
        acceptedFiles.push(file);
      }
    }
    this.uploadFiles(acceptedFiles);
    this.reset();
  };

  uploadFiles = (files) => {
    const originFiles = [...files];
    const postFiles = originFiles.map((file) => {
      file.uid = getUid();
      return this.processFile(file, originFiles);
    });

    Promise.all(postFiles).then((fileList) => {
      const { onBatchStart } = this.props;

      onBatchStart?.(fileList.map(({ origin, parsedFile }) => ({ file: origin, parsedFile })));

      fileList
        .filter((file) => file.parsedFile !== null)
        .forEach((file) => {
          this.post(file);
        });
    });
  };

  processFile = async (file, fileList) => {
    const { beforeUpload } = this.props;

    let transformedFile = file;

    if (beforeUpload) {
      try {
        transformedFile = await beforeUpload(file, fileList);
      } catch (e) {
        transformedFile = false;
      }
      if (transformedFile === false) {
        return {
          origin: file,
          parsedFile: null,
          action: null,
          data: null,
        };
      }
    }

    const { action } = this.props;
    let mergedAction;
    if (typeof action === 'function') {
      mergedAction = await action(file);
    } else {
      mergedAction = action;
    }

    const { data } = this.props;
    let mergedData;
    if (typeof data === 'function') {
      mergedData = await data(file);
    } else {
      mergedData = data;
    }

    const parsedData =
      (typeof transformedFile === 'object' || typeof transformedFile === 'string') &&
      transformedFile
        ? transformedFile
        : file;

    let parsedFile;
    if (parsedData instanceof File) {
      parsedFile = parsedData;
    } else {
      parsedFile = new File([parsedData], file.name, { type: file.type });
    }

    const mergedParsedFile = parsedFile;
    mergedParsedFile.uid = file.uid;

    return {
      origin: file,
      data: mergedData,
      parsedFile: mergedParsedFile,
      action: mergedAction,
    };
  };

  saveFileInput = (node) => {
    this.fileInput = node;
  };

  abort(file) {
    const { reqs } = this;
    if (file) {
      const uid = file.uid ? file.uid : file;
      if (reqs[uid] && reqs[uid].abort) {
        reqs[uid].abort();
      }
      delete reqs[uid];
    } else {
      Object.keys(reqs).forEach((uid) => {
        if (reqs[uid] && reqs[uid].abort) {
          reqs[uid].abort();
        }
        delete reqs[uid];
      });
    }
  }

  reset() {
    this.setState({
      uid: getUid(),
    });
  }

  post({ data, origin, action, parsedFile }) {
    if (!this._isMounted) {
      return;
    }

    const { onStart, customRequest, name, headers, withCredentials, method } = this.props;

    const { uid } = origin;
    const request = customRequest || defaultRequest;

    const requestOption = {
      action,
      filename: name,
      data,
      file: parsedFile,
      headers,
      withCredentials,
      method: method || 'post',
      onProgress: (e) => {
        const { onProgress } = this.props;
        onProgress?.(e, parsedFile);
      },
      onSuccess: (ret, xhr) => {
        const { onSuccess } = this.props;
        onSuccess?.(ret, parsedFile, xhr);

        delete this.reqs[uid];
      },
      onError: (err, ret) => {
        const { onError } = this.props;
        onError?.(err, ret, parsedFile);

        delete this.reqs[uid];
      },
    };

    onStart(origin);
    this.reqs[uid] = request(requestOption);
  }

  render() {
    const {
      component: Tag,
      prefixCls,
      className,
      disabled,
      id,
      style,
      multiple,
      accept,
      capture,
      children,
      directory,
      openFileDialogOnClick,
      onMouseEnter,
      onMouseLeave,
      ...otherProps
    } = this.props;

    const dirProps = directory
      ? { directory: 'directory', webkitdirectory: 'webkitdirectory' }
      : {};
    const events = disabled
      ? {}
      : {
          onClick: openFileDialogOnClick ? this.onClick : () => {},
          onKeyDown: openFileDialogOnClick ? this.onKeyDown : () => {},
          onMouseEnter,
          onMouseLeave,
          onDrop: this.onFileDrop,
          onDragOver: this.onFileDrop,
          tabIndex: '0',
        };
    return (
      <Tag {...events} role="button" style={style}>
        <input
          {...pickAttrs(otherProps, { aria: true, data: true })}
          id={id}
          type="file"
          ref={this.saveFileInput}
          onClick={(e) => e.stopPropagation()}
          key={this.state.uid}
          style={{ display: 'none' }}
          accept={accept}
          {...dirProps}
          multiple={multiple}
          onChange={this.onChange}
          {...(capture != null ? { capture } : {})}
        />
        {children}
      </Tag>
    );
  }
}

export default AjaxUploader;
