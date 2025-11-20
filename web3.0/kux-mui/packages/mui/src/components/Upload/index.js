/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useState } from 'react';
import { map } from 'lodash-es';
import { ICEyeOpenOutlined, ICDeleteOutlined, ErrorOutlined, ICPlusOutlined } from '@kux/icons';
import Upload from 'rc-upload';
import styled from 'emotion/index';
import { variant } from 'styled-system';
import { useTheme } from 'hooks/index';
import ImgPreview from 'components/ImgPreview';
import Spin from 'components/Spin';
import UploadSvg from '@kux/icons/static/upload.svg';
import clsx from 'clsx';
import { getUnSupportPreviewUrl, downloadPreviewFile } from './utils';
import useClassNames from './useClassNames';

const RootWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  transition: all 0.3s ease;
`;

const UploadWrapper = styled(Upload)`
  outline: none;

  ${variant({
    prop: 'size',
    variants: {
      large: {
        width: 576,
        height: 240,
      },
      basic: {
        width: 100,
        height: 100,
      },
    },
  })}
`;

const BaseWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  color: ${(props) => props.theme.colors.text60};
  box-sizing: border-box;
  background: ${(props) => props.theme.colors.cover2};
  &:hover {
    background: ${(props) => props.theme.colors.cover4};
  }

  ${(props) =>
    variant({
      prop: 'size',
      variants: {
        large: {
          width: 576,
          height: 240,
          border: `1px dashed ${props.theme.colors.divider8}`,
        },
        basic: {
          width: 100,
          height: 100,
          border: `1px dashed ${
            props.error ? props.theme.colors.secondary : props.theme.colors.divider8
          }`,
        },
      },
    })}
`;

const ActionOver = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background: ${(props) => props.theme.colors.mask};
    .KuxUpload-actionContent {
      display: flex;
    }
  }
`;

const OverWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  display: none;
`;

const PrevImg = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  align-items: center;
`;

const UploadText = styled.div`
  font-size: 14px;
  line-height: 130%;
  margin-top: ${(props) => (props.size === 'large' ? '16px' : '8px')};
  font-weight: 500;
  color: ${(props) => props.theme.colors.text40};
  ${(props) =>
    variant({
      prop: 'size',
      variants: {
        large: {
          color: props.theme.colors.text,
        },
      },
    })}
`;

const UploadTextDes = styled.div`
  font-size: 12px;
  line-height: 14px;
  margin-top: 4px;
  font-weight: 400;
  color: ${(props) => props.theme.colors.text40};
`;

const ErrorWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.theme.colors.secondary8};
  border-radius: 8px;
`;

const ErrorText = styled.div`
  margin-top: 10px;
  font-size: 14px;
  line-height: 22px;
  color: ${(props) => props.theme.colors.secondary};
`;

const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  &:hover {
    opacity: 0.8;
  }
`;

const IconText = styled.div`
  font-size: 16px;
  line-height: 130%;
  color: #fff;
  margin-top: 8px;
  font-weight: 500;
`;

const ViewWrapper = styled(IconWrapper)`
  margin-right: ${(props) => (props.size === 'large' ? '117px' : '10px')};
  &:hover {
    opacity: 0.8;
  }
`;

const UploadImg = styled.img`
  width: 80px;
  height: 80px;
`;

const LoadingWrapper = styled.div``;

const KcUpload = React.forwardRef(
  (
    {
      children,
      showImages = true,
      images = [],
      max = 10,
      onRemove,
      onRetry,
      size = 'basic',
      uploadText = 'Upload',
      uploadTextDes = '',
      className,
      style,
      deleteText = 'Delete',
      viewText = 'View',
      ...restProps
    },
    ref,
  ) => {
    const theme = useTheme();
    const [imgShow, setImg] = useState(false);
    const [showUrl, setUrl] = useState('');
    const _classNames = useClassNames();

    const showImg = (url) => {
      setUrl(url);
      setImg(true);
    };

    return (
      <RootWrapper ref={ref} className={clsx(_classNames.root, className)}>
        {showImages
          ? map(images, (item) => {
              const unSupportPreview = getUnSupportPreviewUrl(item.url);
              return (
                <BaseWrapper
                  size={size}
                  key={item.key}
                  theme={theme}
                  contentType="content"
                  style={style}
                  error={item.error}
                  className={_classNames.contentWrapper}
                >
                  {item.error ? (
                    <ErrorWrapper onClick={onRetry} theme={theme}>
                      <ErrorOutlined size={20} color={theme.colors.secondary} />
                      <ErrorText theme={theme}>Retry</ErrorText>
                    </ErrorWrapper>
                  ) : (
                    <>
                      <ActionOver
                        theme={theme}
                        inLoading={item.loading}
                        className={_classNames.actionWrapper}
                      >
                        {item.loading ? (
                          <LoadingWrapper>
                            <Spin size="xsmall" />
                          </LoadingWrapper>
                        ) : (
                          <OverWrapper className={_classNames.actionContent}>
                            <ViewWrapper
                              onClick={() => onRemove(item.key)}
                              size={size}
                              className={_classNames.actionDelete}
                            >
                              <ICDeleteOutlined size={20} color="#fff" />

                              {size === 'large' && <IconText theme={theme}>{deleteText}</IconText>}
                            </ViewWrapper>
                            <IconWrapper
                              className={_classNames.actionPreview}
                              onClick={() => {
                                if (unSupportPreview) {
                                  // 文档类型的url，无法预览，转为下载该文件
                                  downloadPreviewFile(item.url);
                                } else {
                                  showImg(item.url);
                                }
                              }}
                            >
                              <ICEyeOpenOutlined color="#fff" size={20} />
                              {size === 'large' && <IconText theme={theme}>{viewText}</IconText>}
                            </IconWrapper>
                          </OverWrapper>
                        )}
                      </ActionOver>
                      <PrevImg
                        src={unSupportPreview || item.url}
                        className={_classNames.previewImg}
                        size={size}
                      />
                    </>
                  )}
                </BaseWrapper>
              );
            })
          : null}
        {showImages === false || images.length === 0 || images.length < max ? (
          <UploadWrapper
            {...restProps}
            theme={theme}
            size={size}
            multiple={false}
            className={_classNames.wrapper}
          >
            {children || (
              <BaseWrapper
                size={size}
                theme={theme}
                contentType="imgWrapper"
                style={style}
                className={_classNames.contentWrapper}
              >
                <TextWrapper className={_classNames.uploadTextWrapper}>
                  {size === 'large' ? (
                    <UploadImg src={UploadSvg} />
                  ) : (
                    <ICPlusOutlined size={24} color={theme.colors.text40} />
                  )}
                  <UploadText theme={theme} size={size} className={_classNames.uploadText}>
                    {uploadText}
                    {uploadTextDes && (
                      <UploadTextDes theme={theme} className={_classNames.uploadDes}>
                        {uploadTextDes}
                      </UploadTextDes>
                    )}
                  </UploadText>
                </TextWrapper>
              </BaseWrapper>
            )}
          </UploadWrapper>
        ) : null}
        <ImgPreview
          maskCloseable
          title={viewText}
          show={imgShow}
          url={showUrl}
          onClose={() => setImg(false)}
        />
      </RootWrapper>
    );
  },
);

export default KcUpload;
