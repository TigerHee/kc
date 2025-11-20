/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Form } from '@kux/mui';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { _t } from 'tools/i18n';
import { TOTAL_FIELD_INFOS } from '../../../../config';
import useRules from '../../hooks/useRules';
import { Block } from '../styled';
import { InnerWrapper, Tips, UploadInfo } from './styled';
import Upload from './Upload';

export const UploadFieldInner = forwardRef(
  (
    {
      name,
      required,
      tips,
      bottomSlot,
      form,
      formData,
      rejectedReasons,
      validate,
      registerValidate,
      descWrapper,
      ...props
    },
    ref,
  ) => {
    const kycCode = useSelector((state) => state.kyc?.kycCode);
    const { title, description, photoType, max } = useMemo(() => {
      const { title, description, photoType, max } = TOTAL_FIELD_INFOS[name] ?? {};
      const desc = description?.({ ...formData, kycCode });
      return {
        title: title?.(formData),
        description: descWrapper ? descWrapper(desc) : desc,
        photoType: photoType?.(formData),
        max,
      };
    }, [name, formData, descWrapper, kycCode]);
    const [errorMsg, setErrorMsg] = useState('');
    const commonRules = useRules({ name, required, formData });
    const rules = useMemo(() => {
      const handleValidate = (_rule, _val, callback) => {
        const values = form.getFieldValue(name) ?? [];
        const errorItem = values.find((v) => v.error);
        if (errorItem) {
          callback(errorItem.error.msg || errorItem.error.message);
        } else if (values.some((v) => v.loading)) {
          callback(_t('4abec5ec855e4000a74d'));
        } else if (values.some((v) => v.status === 2)) {
          callback(_t('053a8e49d7924800a0b3'));
        } else {
          callback();
        }
      };
      return [...commonRules, { validator: handleValidate }];
    }, [name, commonRules]);

    useEffect(() => {
      const unregister = registerValidate(() => {
        setErrorMsg(form.getFieldError(name)?.[0]);
      });
      return () => unregister();
    }, [name, form, registerValidate]);

    return (
      <InnerWrapper ref={ref} className="upload-inner">
        {rejectedReasons[name] ? (
          <UploadInfo fail>{rejectedReasons[name]}</UploadInfo>
        ) : formData.additionOperatorAttachmentList?.includes(photoType) ? (
          <UploadInfo>
            {_t('b259316d46df4800adbb', { documents: TOTAL_FIELD_INFOS[name]?.title?.(formData) })}
          </UploadInfo>
        ) : null}
        {tips ? <Tips>{tips}</Tips> : null}
        <Form.FormItem name={name} rules={rules}>
          <Upload
            {...props}
            title={title}
            description={description}
            photoType={photoType}
            errorMsg={errorMsg}
            value={formData?.[name]}
            max={max}
            onChange={(value) => {
              form.setFieldsValue({ [name]: value });
              validate([name]);
            }}
          />
        </Form.FormItem>
        {bottomSlot}
      </InnerWrapper>
    );
  },
);

const UploadField = (props) => (
  <Block>
    <UploadFieldInner {...props} />
  </Block>
);

export default UploadField;
