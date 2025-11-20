/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useState } from 'react';
import { Upload, styled } from '@kux/mui';
import Wrapper from './wrapper';

const CusUpload = styled(Upload)`
  width: 100%;
`;

function Demo() {
  const [images, setImages] = useState([
    {
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      key: 'data1',
    },
    {
      url: 'https://picsum.photos/100',
      key: 'data2',
    },
    {
      url: 'https://picsum.photos/100?t=20332344',
      key: 'data3',
      loading: true,
    },
    {
      url: 'https://picsum.photos/100?t=09874444',
      key: 'data4',
      error: true,
    },
  ]);
  const onRemove = (key) => {
    setImages(images.filter((item) => item.key !== key));
  };
  const uploadXHR = ({ file }) => {
    console.log(file);
  };
  const uploadProps = {
    max: 6,
    images,
    onRemove,
    onRetry: () => {
      console.log('- retry -');
    },
    customRequest: (cfg) => {
      uploadXHR(cfg);
    },
    beforeUpload(file) {
      console.log('beforeUpload', file.name);
    },
    onStart: (file) => {
      console.log('onStart', file.name);
    },
    onSuccess(file) {
      console.log('onSuccess', file);
    },
    onProgress(step, file) {
      console.log('onProgress', Math.round(step.percent), file.name);
    },
    onError(err) {
      console.log('onError', err);
    },
  };
  const uploadProp2 = {
    ...uploadProps,
    max: 4,
  };
  const uploadProp3 = {
    ...uploadProps,
    css: '',
    max: 1,
    images: [],
    size: 'large',
    uploadText: '点击或者拖拽上传',
    uploadTextDes: '仅支持 JPG/PNG 格式的照片',
    reUploadText: '重新上传',
    deleteText: '删除',
  };

  const uploadProp4 = {
    ...uploadProps,
    css: '',
    max: 1,
    images: [
      {
        url: 'https://picsum.photos/900/430?t=09874444',
        key: 'data4',
      },
    ],
    size: 'large',
    uploadText: '点击或者拖拽上传',
    uploadTextDes: '仅支持 JPG/PNG 格式的照片',
    reUploadText: '重新上传',
    deleteText: '删除',
  };
  return (
    <div>
      <div style={{ marginTop: 24 }}>
        <Upload {...uploadProps} />
      </div>

      <div style={{ marginTop: 24 }}>
        <Upload {...uploadProp2} />
      </div>

      <div style={{ marginTop: 24 }}>
        <CusUpload {...uploadProp3} />
      </div>

      <div style={{ marginTop: 24 }}>
        <Upload {...uploadProp4} />
      </div>
    </div>
  );
}
function UploadDemo() {
  return (
    <Wrapper>
      <Demo />
    </Wrapper>
  );
}

export default UploadDemo;
