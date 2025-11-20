/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import AjaxUpload from './AjaxUploader';

function empty() {}

const defaultProps = {
  component: 'span',
  data: {},
  headers: {},
  name: 'file',
  multipart: false,
  onStart: empty,
  onError: empty,
  onSuccess: empty,
  multiple: false,
  beforeUpload: null,
  customRequest: null,
  withCredentials: false,
  openFileDialogOnClick: true,
};

class Upload extends React.Component {
  saveUploader = (node) => {
    this.uploader = node;
  };

  abort(file) {
    this.uploader.abort(file);
  }

  render() {
    return <AjaxUpload {...this.props} ref={this.saveUploader} />;
  }
}

Upload.defaultProps = {
  ...defaultProps,
};

export default Upload;
