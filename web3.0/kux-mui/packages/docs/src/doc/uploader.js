/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { FileUpload, Button, Box } from '@kux/mui';
import Wrapper from './wrapper';

const defaultFileList = [
  {
    uid: '1',
    name: 'xxx.png',
    status: 'uploading',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '2',
    name: 'yyy.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '3',
    name: 'zzz.png',
    status: 'error',
  },
  {
    uid: '4',
    name: '233.pdf',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.pdf',
  },
];

const props = {
  defaultFileList,
};

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

const Doc = () => {
  const beforeUpload = (file) => {
    return false;
  };
  const handleChange = (info) => {
    console.log(info);
    getBase64(info.file, (url) => {
      console.log(url);
    });
  };
  return (
    <div>
      <Box width="300px">
        <FileUpload {...props}>
          <FileUpload.UploadButton>
            Upload
          </FileUpload.UploadButton>
        </FileUpload>
      </Box>
    </div>
  );
};

export default () => {
  return (
    <Wrapper>
      <Doc />
    </Wrapper>
  );
};
