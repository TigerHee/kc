import { PageContainer } from '@ant-design/pro-components';
import { Button, Flex, Form, Input, List, message, Upload, UploadFile } from 'antd';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { UploadChangeParam } from 'antd/es/upload/interface';
import lottie, { AnimationItem } from 'lottie-web';
import type * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { compressLottie, parseLottie } from '@/services/lottie';
import { DraggerProps } from 'antd/es/upload/Dragger';
import { debounce } from 'lodash';

const { Dragger } = Upload;

function downloadFile(content: any, filename: string, type: string) {
  // 创建 Blob 对象
  const blob = new Blob([JSON.stringify(content)], { type });

  // 使用 FileReader 将 Blob 转换为 Data URL
  const reader = new FileReader();
  reader.onload = function () {
    const downloadLink = document.createElement('a');
    downloadLink.href = reader.result as string; // 使用 FileReader 的结果
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // 读取 Blob 对象为 Data URL
  reader.readAsDataURL(blob);
}

export default function Lottie() {
  const previewRef = useRef<AnimationItem | null>(null);
  const previewCompressRef = useRef<AnimationItem | null>(null);
  const [currentFileInfo, setCurrentFileInfo] = useState<UploadChangeParam<UploadFile<any>> | null>(
    null,
  );
  const [theme, setTheme] = useState('transparent');
  const [compressing, setCompressing] = useState(false);
  const [compressFileData, setCompressFileData] = useState<any>(null);

  useEffect(() => {
    return () => {
      previewRef.current?.destroy();
      previewCompressRef.current?.destroy();
    };
  }, []);

  const handleUploadPreview = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file.status !== 'done') {
      return;
    }

    if (previewRef.current) {
      previewRef.current.destroy();
    }

    const file = info.file;
    if (!file) {
      message.error('Please select a file!');
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        if (!e.target?.result) return;

        const jsonData = JSON.parse(e.target.result as any);
        // 使用 Lottie-Web 渲染动画
        const container = document.getElementById('lottie-preview')!;
        previewRef.current = lottie.loadAnimation({
          container, // 渲染容器
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: jsonData, // 解析的 Lottie JSON 数据
        });
      } catch (error) {
        console.error('Error parsing JSON:', error);
        message.error('Invalid Lottie JSON file.');
      }
    };
    reader.readAsText(file.originFileObj as File);
  };

  const handleCompressPreview = (animationData: any) => {
    if (!animationData) {
      message.error('请先上传 Lottie JSON 文件.');
      return;
    }

    if (previewCompressRef.current) {
      previewCompressRef.current.destroy();
    }

    const container = document.getElementById('lottie-compress-preview')!;
    previewCompressRef.current = lottie.loadAnimation({
      container,
      animationData,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      name: 'lottie',
    });
  };

  const props: DraggerProps = {
    name: 'file',
    accept: '.json',
    showUploadList: false,
    fileList: currentFileInfo?.fileList ?? [],
    multiple: false,
    customRequest: ({ file, onSuccess, onError }) => {
      parseLottie(file)
        .then((animationData) => {
          onSuccess?.(animationData);
        })
        .catch((error) => {
          onError?.(error);
        });
    },
    onChange(info: UploadChangeParam<UploadFile<any>>) {
      const { status } = info.file;
      if (status === 'uploading') {
        setCurrentFileInfo(info);
      } else if (status === 'done') {
        setCurrentFileInfo(info);
        handleUploadPreview(info);
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        setCurrentFileInfo(null);
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e: React.DragEvent<HTMLDivElement>) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  function handleCompress() {
    if (!currentFileInfo) {
      message.error('请先上传 Lottie JSON 文件');
      return;
    }
    const file = currentFileInfo.file;
    setCompressing(true);
    compressLottie(file.originFileObj as File)
      .then((fileData) => {
        setCompressFileData(fileData);
        handleCompressPreview(fileData);
      })
      .catch((error) => {
        console.error('Error compressing Lottie:', error);
        message.error('压缩 Lottie 失败');
      })
      .finally(() => {
        setCompressing(false);
      });
  }

  function jsonToBlob(jsonData: any) {
    return new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
  }

  function getCompressFileName(info: UploadChangeParam<UploadFile<any>> | null) {
    if (!info) {
      return '未命名';
    }

    const fileName = info.file.name;
    if (!fileName) {
      return '未命名';
    }

    if (fileName.includes('.')) {
      return fileName.slice(0, fileName.lastIndexOf('.')) + '_compressed.json';
    }
    return fileName + '_compressed.json';
  }

  function fileSizeFormatter(bytes?: number) {
    if (!bytes) {
      return '';
    }

    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1048576) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    } else if (bytes < 1073741824) {
      return `${(bytes / 1048576).toFixed(2)} MB`;
    } else {
      return `${(bytes / 1073741824).toFixed(2)} GB`;
    }
  }

  const displayData = useMemo(() => {
    if (!currentFileInfo) {
      return [];
    }

    const currentItem = {
      fileName: currentFileInfo.file.name,
      fileSize: fileSizeFormatter(currentFileInfo.file.size),
    };
    let compressItem;
    if (compressFileData) {
      const blob = jsonToBlob(compressFileData);
      compressItem = {
        fileName: getCompressFileName(currentFileInfo),
        fileSize: fileSizeFormatter(blob?.size),
      };
    } else {
      compressItem = {
        fileName: '',
        fileSize: '',
      };
    }

    return [currentItem, compressItem];
  }, [currentFileInfo, compressFileData]);

  const handleDownload = useCallback(
    debounce(
      () => {
        if (!compressFileData) {
          message.error('请先上传 Lottie JSON 文件并进行压缩');
          return;
        }

        downloadFile(compressFileData, getCompressFileName(currentFileInfo), 'application/json');
      },
      500,
      {
        leading: true,
        trailing: false,
      },
    ),
    [currentFileInfo, compressFileData],
  );

  return (
    <PageContainer>
      <div style={{ backgroundColor: theme }}>
        <Flex vertical={true} gap={16}>
          <Flex vertical={false} gap={16}>
            <Button
              icon={<UploadOutlined />}
              type={'primary'}
              onClick={handleCompress}
              loading={compressing}
            >
              开始压缩
            </Button>
            <Button icon={<UploadOutlined />} type={'primary'} onClick={handleDownload}>
              下载压缩后文件
            </Button>
            <Input
              placeholder={'请输入 Lottie 背景色 (支持 CSS backgroundColor 值)'}
              style={{ width: 400 }}
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            />
          </Flex>
          <Flex vertical={false} gap={16}>
            <div style={{ width: 400 }}>
              <Form layout={'vertical'} style={{ height: '100%' }}>
                <Form.Item noStyle={true}>
                  <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">点击或者拖拽上传</p>
                    <p className="ant-upload-hint">注意：上传的 Lottie JSON 必须小于 10MB。</p>
                  </Dragger>
                </Form.Item>
              </Form>
            </div>
            <div style={{ width: 600 }}>
              <List
                header={<div>文件信息</div>}
                bordered
                dataSource={displayData}
                renderItem={(item: { fileName: string; fileSize: string }, index: number) => {
                  return (
                    <List.Item key={item.fileName}>
                      <div>
                        <div>{index === 0 ? '源文件' : '压缩后文件'}</div>
                        <div>文件名称：{item.fileName || '-'}</div>
                        <div>文件大小：{item.fileSize || '-'}</div>
                      </div>
                    </List.Item>
                  );
                }}
              />
            </div>
          </Flex>
        </Flex>
        <Flex vertical={false} gap={16}>
          <div id="lottie-preview" style={{ width: 375 }} />
          <div id="lottie-compress-preview" style={{ width: 375 }} />
        </Flex>
      </div>
    </PageContainer>
  );
}
