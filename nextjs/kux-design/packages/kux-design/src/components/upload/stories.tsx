import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Preview } from '@/components/preview';
import Upload, { FileList, ImageOverlay } from './index';
import { ICustomRequestOptions, IFileItemProps } from './types';

const componentMeta = {
  title: 'base/Upload',
  // component: Upload,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info:
    // https://storybook.js.org/docs/configure/story-layout
    layout: 'padded',
  },
  // args: {
  //   title: 'Drag or Click to Upload',
  //   description: 'Only PDF, JPG, PNG types are accepted. The maximum file size is 100 MB',
  // },
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked:
  // https://storybook.js.org/docs/essentials/actions#action-args
  // args: { onClick: fn() },
} satisfies Meta<typeof Upload>;

export default componentMeta;

type Story = StoryObj<typeof componentMeta>;

// 图片模式示例
export const ImageMode: Story = {
  render: () => {
    // const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [showPreview, setShowPreview] = useState(false);

    const handleStart = (file: File | FileList) => {
      console.log('开始上传图片:', file);
    };

    const handleSuccess = (data: any) => {
      console.log('upload data', data);
      // 创建本地 URL 用于预览
      setImageUrl(data);
    };

    const handleError = (error: Error, file?: File | FileList) => {
      console.log('图片上传失败:', error.message);
      console.log('file', file);
    };

    const handleDelete = () => {
      console.log('删除图片');
      setImageUrl('');
    };

    const handleLoadingStart = () => {
      console.log('开始 loading..');
    };

    const handleLoadingEnd = () => {
      console.log('结束 loading..');
    };

    return (
      <div>
        <h3>图片模式上传（带预览）</h3>
        <Upload
          accept="image/*"
          onStart={handleStart}
          onSuccess={handleSuccess}
          onError={handleError}
          onDelete={handleDelete}
          onLoadingStart={handleLoadingStart}
          onLoadingEnd={handleLoadingEnd}
          customRequest={({ file, onError, onSuccess }: ICustomRequestOptions) => {
            console.log('自定义上传图片:', file?.originalFile.name);
            // 模拟上传
            setTimeout(() => {
              if (Math.random() > 0.3) {
                onSuccess?.('https://fastly.picsum.photos/id/379/600/300.jpg?hmac=Tt4179tStqiygC3fC1vULDcINHozGKxJDwk0Eozn3VU');
              } else {
                onError(new Error('上传失败'));
              }
            }, 2000);
          }}
        >
          <ImageOverlay 
            url={imageUrl} 
            onPreview={() => setShowPreview(true)} 
            onDelete={handleDelete} 
            deleteText="delete"
            previewText="open"
          />
        </Upload>

        <Preview images={[{ src: imageUrl }]} isOpen={showPreview} onClose={() => setShowPreview(false)} />
      </div>
    );
  }
};


// 文件模式示例
export const FileMode: Story = {

  render: () => {
    const [fileList, setFileList] = useState<IFileItemProps[]>([]);

    const handleStart = (file: File | FileList) => {
      console.log('开始上传图片:', file);
    };

    const handleSuccess = (data: any) => {
      console.log('upload data', data);
      setFileList(data);
    };

    return (
      <div>
        <h3>文件模式上传</h3>
        <Upload
          uploadMode="file"
          onStart={handleStart}
          description='Supported files : PDF, JPG, PNG. Max 100 MB'
          onSuccess={handleSuccess}
          onError={() => console.log('上传失败')}
          multiple
          error
          fullWidth
          customRequest={({ files, onSuccess }: ICustomRequestOptions) => {
            console.log('uplaod files', files);
            const fileList = [
              {
                uid: '1',
                name: 'test1.jpg',
                size: 1000000,
                url: 'https://fastly.picsum.photos/id/379/600/300.jpg?hmac=Tt4179tStqiygC3fC1vULDcINHozGKxJDwk0Eozn3VU',
                status: 'uploading',
              },
              {
                uid: '2',
                name: 'test2.png',
                size: 1200000,
                url: 'https://fastly.picsum.photos/id/552/600/300.jpg?hmac=h0KgWjgUPHeyNDACuAptPevyzMXOasEuHcqGQ1XGdY8',
                status: 'done',
              },
              {
                uid: '3',
                name: 'test3.pdf',
                size: 13000,
                url: 'https://fastly.picsum.photos/id/830/600/300.jpg?hmac=wNp2qqETg_tPI06MePB_SnoTXnCrje6VWvRZQQeRD7s',
                status: 'error',
              },
            ]

            setFileList(fileList as IFileItemProps[]);
            
            // 模拟上传
            setTimeout(() => {
              onSuccess?.(fileList.map(item => {
                if (item.status === 'uploading') {
                  return {
                    ...item,
                    status: 'done',
                  };
                }
                return item;
              }));
            }, 2000);
          }}
        >
        </Upload>

        <FileList fullWidth files={fileList} onDelete={uid => console.log('delete uid', uid)} onRetry={uid => console.log('retry uid', uid)} title="files"  />
      </div>
    );
  }
};
