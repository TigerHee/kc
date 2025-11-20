/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { styled, useTheme, Spin, Upload } from '@kufox/mui';
import { useTranslation } from '@tools/i18n';

import imgCompress from './compress';
import { useStyle } from './style.js';
import uploadIcon from '../../../static/images/kyc2/guide/plus.svg';

const Wrapper = styled.div`
  flex: 1;

  position: relative;
  & > div {
    &:nth-of-type(1) {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      & > div {
        width: 100%;
        height: 100%;
        & > img {
          width: ${(props) => (props.showDefaultImg ? '100px' : '100%')};
          height: ${(props) => (props.showDefaultImg ? '100px' : '100%')};
        }
      }
    }
  }
`;
const StyledUpload = styled(Upload)`
  background: rgba(0, 13, 29, 0.04);
  width: 100%;
  height: 100%;

  border: 1px dashed rgba(0, 13, 29, 0.08);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
const Content = styled.div`
  text-align: center;
  padding: 0 24px;
`;
const Icon = styled.img`
  width: 16px;
  height: 16px;
  margin-bottom: 24px;
`;
const Title = styled.p`
  font-weight: 500;
  font-size: 16px;
  line-height: 26px;
  text-align: center;
  color: #000d1d;
  margin-bottom: 4px;
`;
const Tips = styled.p`
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  margin-bottom: 0;

  color: rgba(0, 13, 29, 0.68);
`;
const CustomUpload = React.forwardRef(
  (
    {
      kycType,
      dispatch,
      photoType,
      onSuccess,
      onChange,
      service,
      onError,
      showLoading,
      loadingView,
      compress,
      className,
      showDefaultImg,
      ...restProps
    },
    ref,
  ) => {
    const theme = useTheme();
    const { t: _t } = useTranslation('kyc');
    const styles = useStyle({ color: theme.colors });
    // 上传状态
    const [loadingState, setLoading] = React.useState(null);
    // 自定义上传方式
    const uploadXHR = async ({ file }) => {
      setLoading('loading');
      // 压缩图片并上传
      let uploadFile = file;
      const { size } = file;
      const sizeMb = size / (1024 * 1024);
      // 大于1Mb启用压缩上传
      if (compress && sizeMb > 1) {
        try {
          uploadFile = await imgCompress(file);
        } catch (e) {
          console.error('图片压缩上传失败', e);
        }
      }
      const data = await dispatch({
        type: service,
        payload: { file: uploadFile, kycType, photoType },
      });
      if (data.success && data.data) {
        // eslint-disable-next-line no-unused-expressions
        onChange && onChange(data.data);
        onSuccess({ file: uploadFile, data });
      }
      if (!data.success && data.msg) {
        // eslint-disable-next-line no-unused-expressions
        onChange && onChange();
        onError && typeof onError === 'function' && onError(data.msg);
      }
      setLoading('loaded');
    };

    const uploadProps = {
      max: 1,
      customRequest({ file }) {
        uploadXHR({ file });
      },
      accept: 'image/png, image/jpeg',
      ...restProps,
    };
    return (
      <Wrapper className={className} showDefaultImg={showDefaultImg}>
        <StyledUpload {...uploadProps} ref={ref}>
          <Content>
            <Icon src={uploadIcon} />
            <Title>{_t('uJHY2APt3uzd6CeJZ19VAF')}</Title>
            <Tips>{_t('n8HCQiyBrZNiswZxf7gf4B')}</Tips>
          </Content>
        </StyledUpload>

        {loadingState === 'loading' && showLoading ? (
          <div css={styles.uploadLoading}>
            {loadingView || <Spin spinning tip="Uploading" size="small" />}
          </div>
        ) : null}
      </Wrapper>
    );
  },
);

export default CustomUpload;
