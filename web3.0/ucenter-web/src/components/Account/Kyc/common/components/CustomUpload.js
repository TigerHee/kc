/**
 * Owner: willen@kupotech.com
 */
import { Upload, useSnackbar } from '@kux/mui';
import React from 'react';

const CustomUpload = React.forwardRef(
  ({ kycType, dispatch, photoType, onSuccess, onChange, ...restProps }, ref) => {
    const { message } = useSnackbar();

    // 自定义上传方式
    const uploadXHR = async ({ file }) => {
      const data = await dispatch({
        type: 'kyc/kycUpload',
        payload: { file, kycType, photoType },
      });
      if (data.success && data.data) {
        // eslint-disable-next-line no-unused-expressions
        onChange && onChange(data.data);
        onSuccess({ file, data });
      }
      if (!data.success && data.msg) {
        // eslint-disable-next-line no-unused-expressions
        message.error(data.msg);
        onChange && onChange();
        throw new Error(data.msg);
      }
    };

    const uploadProps = {
      max: 1, // 最大上传的个数
      customRequest({ file }) {
        uploadXHR({ file });
      },
      ...restProps,
    };
    return <Upload {...uploadProps} ref={ref} />;
  },
);

export default CustomUpload;
