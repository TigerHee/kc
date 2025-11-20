/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { Button, Checkbox, DatePicker, Form, Input, styled, useTheme } from '@kux/mui';
import {
  filterParams,
  kycSeniorSubmit,
  onValuesChange,
  resetRenderSequence,
} from 'components/Account/Kyc/common/components/CommonFunctions';
import { FAIL_REASON } from 'config/base';
import { tenantConfig } from 'config/tenant';
import { generateUuid, getImgBase64 } from 'helper';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import UploadDefaultImg from 'static/account/kyc/upload-default.svg';
import { _t } from 'tools/i18n';
import { saTrackForBiz, trackClick } from 'utils/ga';
import CustomUpload from '../../common/components/CustomUpload';
import HoldInfo from '../../common/components/HoldInfo';
import {
  ERROR_FIELD_MAP,
  KYC_TYPE,
  MULTIPLE_FILE_TYPES,
  NORMAL_FILE_TYPES,
  PHOTO_TYPE,
  SOURCE,
  UPLOAD_FILE_SIZE,
  UPLOAD_SIZE_ERROR,
  UPLOAD_TYPE_ERROR,
} from '../../common/constants';
import { getValidateLengthRule } from './config';
import { useStyle } from './style.js';

const FormNew = styled.div``;

const { FormItem, useForm } = Form;

// model name keys
const DATA_KEY = {
  INC_PHOTO_IMG: 'incumbencyPhotoImg',
  FRONT_PHOTO_IMG: 'frontPhotoImg',
  BACK_PHOTO_IMG: 'backPhotoImg',
  HANDLE_PHOTO_IMG: 'handlePhotoImg',
};

// model_name -> api_field
const MODEL_TO_FIELD = {
  // INC_PHOTO_IMG: 'incumbencyPhoto',
  FRONT_PHOTO_IMG: 'frontPhoto',
  BACK_PHOTO_IMG: 'backPhoto',
  HANDLE_PHOTO_IMG: 'handlePhoto',
};

const InstitutionalKycPersonalInfo = ({
  incumbencyPhotoImg,
  frontPhotoImg,
  backPhotoImg,
  handlePhotoImg,
  onPrevious,
  onSuccessCallback,
  dispatch,
  onError,
  kycCode,
  companyDetail,
  failureReason,
}) => {
  const [form] = useForm();
  const [checkedDate, setCheckedDate] = useState(false);
  const theme = useTheme();
  const classes = useStyle({ color: theme.colors, breakpoints: theme.breakpoints });
  const { currentLang = 'zh_CN' } = useLocale();
  const isCN = currentLang === 'zh_CN';
  const defaultCheckedDate = companyDetail.idExpireDate !== 'permanent';
  const defaultDate = moment().format('YYYY-MM-DD');

  const errorKeys = Object.keys(failureReason);
  const errors = {};
  _.forEach(errorKeys, (key) => {
    const { code } = failureReason[key];
    if (code === 'otherError') {
      errors[ERROR_FIELD_MAP[key]] = failureReason[key].val;
    } else {
      const reason = FAIL_REASON[code]?.key;
      if (reason) {
        errors[ERROR_FIELD_MAP[key]] = _t(reason);
      } else {
        errors[ERROR_FIELD_MAP[key]] = isCN
          ? FAIL_REASON[code]?.zh_CN
          : FAIL_REASON[code]?.en_US || failureReason[key].valEn;
      }
    }
  });

  useEffect(() => {
    saTrackForBiz({}, ['Applican', '']);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    Object.keys(failureReason).length && form.validateFields();
    // 组件删除后重置该属性，保证再次进入时的一致性
    return resetRenderSequence;
  }, [failureReason]);

  useEffect(() => {
    if (defaultCheckedDate) {
      form.setFieldsValue({
        idExpireDateM: moment(companyDetail.idExpireDate || defaultDate),
      });
    } else {
      setCheckedDate(true);
      form.setFieldsValue({
        idExpireDateM: moment(defaultDate),
      });
    }
  }, [companyDetail]);

  const handleSubmit = (e) => {
    e.preventDefault();
    form
      .validateFields()
      .then((values) => {
        const params = { ...values };
        params.idExpireDate = params.idExpireDateM;
        if (checkedDate) {
          params.idExpireDate = 'permanent';
        } else {
          params.idExpireDate = moment(params.idExpireDate).format('YYYY-MM-DD');
        }
        delete params.expiryCheck;
        delete params.idExpireDateM;
        const filteredParams = filterParams(params);
        kycSeniorSubmit({
          values: { ...filteredParams, source: SOURCE },
          dispatch,
          onSuccessCallback,
          onError,
          service: 'submitCompanyContact',
        });

        let locationid = '1';
        if (companyDetail?.verifyStatus >= 0) {
          locationid = Object.keys(filteredParams)?.some((key) => {
            if (filteredParams[key] !== companyDetail[key]) {
              return true;
            }
            return false;
          })
            ? '3'
            : '2';
        }
        trackClick(['ApplicanNext', locationid]);
      })
      .catch((e) => {
        console.log('e:', e);
      });
  };

  // model data keys
  const DATA_MODEL = {
    INC_PHOTO_IMG: incumbencyPhotoImg,
    FRONT_PHOTO_IMG: frontPhotoImg,
    BACK_PHOTO_IMG: backPhotoImg,
    HANDLE_PHOTO_IMG: handlePhotoImg,
  };

  // 限制大小
  const beforeUploadImage = (file, multi) => {
    if (file.size >= UPLOAD_FILE_SIZE) {
      // 文件大小限制
      const uploadErr = isCN ? UPLOAD_SIZE_ERROR.zh_CN : UPLOAD_SIZE_ERROR.en_US;
      // eslint-disable-next-line no-unused-expressions
      onError && typeof onError === 'function' && onError(uploadErr);
      return false;
    }
    if (!multi.includes(file.type)) {
      // 文件类型限制
      const uploadErr = isCN ? UPLOAD_TYPE_ERROR.zh_CN : UPLOAD_TYPE_ERROR.en_US;
      // eslint-disable-next-line no-unused-expressions
      onError && typeof onError === 'function' && onError(uploadErr);
      return false;
    }
  };

  // 更新预览图片
  const updateImage = (modelName, modelData, newData, key) => {
    dispatch({
      type: 'kyc/update',
      payload: {
        [modelName]: modelData.concat([{ url: newData, key: key || generateUuid() }]),
      },
    });
  };

  // 认证通过的，再次认证时，展示默认图片
  useEffect(() => {
    if (companyDetail.verifyFailReason && !DATA_MODEL.INC_PHOTO_IMG.length) {
      // if (!errors.incumbencyPhoto) {
      //   updateImage(DATA_KEY.INC_PHOTO_IMG, DATA_MODEL.INC_PHOTO_IMG, UploadDefaultImg);
      // }
      if (!errors.frontPhoto) {
        updateImage(DATA_KEY.FRONT_PHOTO_IMG, DATA_MODEL.FRONT_PHOTO_IMG, UploadDefaultImg);
      }
      if (!errors.backPhoto) {
        updateImage(DATA_KEY.BACK_PHOTO_IMG, DATA_MODEL.BACK_PHOTO_IMG, UploadDefaultImg);
      }
      if (!errors.handlePhoto) {
        updateImage(DATA_KEY.HANDLE_PHOTO_IMG, DATA_MODEL.HANDLE_PHOTO_IMG, UploadDefaultImg);
      }
    }
  }, [companyDetail]);

  // 转换为base64预览
  const onUploadSuccess = async ({ file, data, modelName, modelData }) => {
    getImgBase64(file, (base64) => {
      updateImage(modelName, modelData, base64, data.data);
    });
  };

  // 删除预览图片
  const removeImage = (modelName, modelData, key, fieldName) => {
    const tmpImages = _.filter(modelData, (item) => item.key !== key);
    dispatch({ type: 'kyc/update', payload: { [modelName]: tmpImages } });
    form.setFieldsValue({ [fieldName]: '' });
  };

  // 上传在职正面
  const uploadIncumbencyPhotoImgImgProps = {
    dispatch,
    beforeUpload: (file) => beforeUploadImage(file, MULTIPLE_FILE_TYPES),
    images: DATA_MODEL.INC_PHOTO_IMG,
    photoType: PHOTO_TYPE.PROOF_OF_EMPLOYMENT,
    kycType: KYC_TYPE.INSTITUTIONAL,
    onRemove: (key) =>
      removeImage(
        DATA_KEY.INC_PHOTO_IMG,
        DATA_MODEL.INC_PHOTO_IMG,
        key,
        MODEL_TO_FIELD.INC_PHOTO_IMG,
      ),
    onSuccess: (data) =>
      onUploadSuccess({
        ...data,
        modelName: DATA_KEY.INC_PHOTO_IMG,
        modelData: DATA_MODEL.INC_PHOTO_IMG,
      }),
  };

  // 上传证件照正面
  const uploadFrontPhotoImgImgProps = {
    dispatch,
    beforeUpload: (file) => beforeUploadImage(file, MULTIPLE_FILE_TYPES),
    images: DATA_MODEL.FRONT_PHOTO_IMG,
    photoType: PHOTO_TYPE.POSITIVE,
    kycType: KYC_TYPE.INSTITUTIONAL,
    onRemove: (key) =>
      removeImage(
        DATA_KEY.FRONT_PHOTO_IMG,
        DATA_MODEL.FRONT_PHOTO_IMG,
        key,
        MODEL_TO_FIELD.FRONT_PHOTO_IMG,
      ),
    onSuccess: (data) =>
      onUploadSuccess({
        ...data,
        modelName: DATA_KEY.FRONT_PHOTO_IMG,
        modelData: DATA_MODEL.FRONT_PHOTO_IMG,
      }),
  };

  // 上传证件照背面
  const uploadBackPhotoImgProps = {
    dispatch,
    beforeUpload: (file) => beforeUploadImage(file, MULTIPLE_FILE_TYPES),
    images: DATA_MODEL.BACK_PHOTO_IMG,
    photoType: PHOTO_TYPE.BACK,
    kycType: KYC_TYPE.INSTITUTIONAL,
    onRemove: (key) =>
      removeImage(
        DATA_KEY.BACK_PHOTO_IMG,
        DATA_MODEL.BACK_PHOTO_IMG,
        key,
        MODEL_TO_FIELD.BACK_PHOTO_IMG,
      ),
    onSuccess: (data) =>
      onUploadSuccess({
        ...data,
        modelName: DATA_KEY.BACK_PHOTO_IMG,
        modelData: DATA_MODEL.BACK_PHOTO_IMG,
      }),
  };

  // 上传手持证件照
  const uploadHandlePhotoImgProps = {
    dispatch,
    beforeUpload: (file) => beforeUploadImage(file, NORMAL_FILE_TYPES),
    images: DATA_MODEL.HANDLE_PHOTO_IMG,
    photoType: PHOTO_TYPE.PHOTO_WITH_ID,
    kycType: KYC_TYPE.INSTITUTIONAL,
    onRemove: (key) =>
      removeImage(
        DATA_KEY.HANDLE_PHOTO_IMG,
        DATA_MODEL.HANDLE_PHOTO_IMG,
        key,
        MODEL_TO_FIELD.HANDLE_PHOTO_IMG,
      ),
    onSuccess: (data) =>
      onUploadSuccess({
        ...data,
        modelName: DATA_KEY.HANDLE_PHOTO_IMG,
        modelData: DATA_MODEL.HANDLE_PHOTO_IMG,
      }),
  };

  const commonRules = [
    {
      required: true,
      message: _t('kyc.form.required'),
    },
  ];

  const onFormValuesChange = (fieldValues) => {
    onValuesChange({ dispatch, failureReason }, fieldValues);

    // 单独处理永久有效
    const keys = Object.keys(fieldValues);
    if (keys[0] === 'expiryCheck') {
      setCheckedDate(fieldValues.expiryCheck);
    }
  };

  return (
    <Form form={form} onValuesChange={onFormValuesChange}>
      <FormNew css={classes.root}>
        <div css={classes.part}>
          <div css={classes.partLabel}>{_t('kyc.contact.information')}</div>
          <div css={classes.row}>
            <div css={classes.item4}>
              <FormItem
                name="firstName"
                label={_t('kyc.account.sec.lastname')}
                validateStatus="error"
                help={errors.firstName || ''}
                rules={
                  !companyDetail.firstName
                    ? [...commonRules, ...getValidateLengthRule(256)]
                    : getValidateLengthRule(256)
                }
              >
                <Input allowClear={true} placeholder={companyDetail.firstName || ''} />
              </FormItem>
            </div>
            <div css={classes.item4}>
              <FormItem
                name="lastName"
                label={_t('kyc.account.sec.firstname')}
                validateStatus="error"
                help={errors.lastName || ''}
                rules={
                  !companyDetail.firstName
                    ? [...commonRules, ...getValidateLengthRule(200)]
                    : getValidateLengthRule(200)
                }
              >
                <Input allowClear={true} placeholder={companyDetail.lastName || ''} />
              </FormItem>
            </div>
            <div css={classes.item4}>
              <FormItem
                name="middleName"
                label={_t('kyc.form.middleName1')}
                validateStatus="error"
                help={errors.middleName || ''}
                rules={getValidateLengthRule(500)}
              >
                <Input allowClear={true} placeholder={companyDetail.middleName || ''} />
              </FormItem>
            </div>
            <div css={classes.item4}>
              <FormItem
                name="middleName2"
                label={_t('kyc.form.middleName2')}
                validateStatus="error"
                help={errors.middleName2 || ''}
                rules={getValidateLengthRule(500)}
              >
                <Input allowClear={true} placeholder={companyDetail.middleName2 || ''} />
              </FormItem>
            </div>
          </div>
          <div css={classes.row}>
            <div css={classes.item2}>
              <FormItem
                name="duty"
                label={_t('kyc.contact.information.position')}
                validateStatus="error"
                help={errors.duty || ''}
                rules={
                  !companyDetail.firstName
                    ? [...commonRules, ...getValidateLengthRule(256)]
                    : getValidateLengthRule(256)
                }
              >
                <Input allowClear={true} placeholder={companyDetail.duty || ''} />
              </FormItem>
            </div>
            {tenantConfig.kyc.isShowImAccount ? (
              <div css={classes.item2}>
                <FormItem
                  name="imAccount"
                  label="Telegram/Whatsapp"
                  validateStatus="error"
                  help={errors.imAccount || ''}
                  rules={
                    !companyDetail.imAccount
                      ? [...commonRules, ...getValidateLengthRule(200)]
                      : getValidateLengthRule(200)
                  }
                >
                  <Input allowClear={true} placeholder={companyDetail.imAccount || ''} />
                </FormItem>
              </div>
            ) : null}
          </div>
        </div>
        <div css={classes.part}>
          <div css={classes.partLabel}>{_t('kyc.company.docs')}</div>
          <div css={classes.row}>
            <div css={classes.uploadWrapper}>
              <div css={classes.label}>{_t('kyc.contact.information.ID.photo.front')}*</div>
              <div css={classes.notice}>
                {_t('kyc.mechanism.verify.company.certificate.upload.info')}
              </div>
              <FormItem
                name="frontPhoto"
                validateStatus="error"
                help={errors.frontPhoto || ''}
                rules={
                  !companyDetail.firstName
                    ? [
                        {
                          required: true,
                          message: _t('kyc.verification.info.upload.front'),
                        },
                        {
                          validator: (a, b) =>
                            b
                              ? Promise.resolve()
                              : Promise.reject(
                                  new Error(_t('kyc.verification.info.upload.failed')),
                                ),
                        },
                      ]
                    : []
                }
              >
                <CustomUpload {...uploadFrontPhotoImgImgProps} />
              </FormItem>
            </div>
          </div>
          <div css={classes.row}>
            <div css={classes.uploadWrapper}>
              <div css={classes.label}>{_t('kyc.contact.information.ID.photo.back')}*</div>
              <div css={classes.notice}>
                {_t('kyc.mechanism.verify.company.certificate.upload.info')}
              </div>
              <FormItem
                name="backPhoto"
                validateStatus="error"
                help={errors.backPhoto || ''}
                rules={
                  !companyDetail.firstName
                    ? [
                        {
                          required: true,
                          message: _t('kyc.verification.info.upload.back'),
                        },
                        {
                          validator: (a, b) =>
                            b
                              ? Promise.resolve()
                              : Promise.reject(
                                  new Error(_t('kyc.verification.info.upload.failed')),
                                ),
                        },
                      ]
                    : []
                }
              >
                <CustomUpload {...uploadBackPhotoImgProps} />
              </FormItem>
            </div>
          </div>
          <div css={classes.row}>
            <div css={classes.uploadWrapper}>
              <div css={classes.label}>
                {_t('kyc.contact.information.verified.holding.upload')}*
              </div>
              <div css={classes.notice}>{_t('biz.tips.front')}</div>
              <HoldInfo code={kycCode} />
              <FormItem
                name="handlePhoto"
                validateStatus="error"
                help={errors.handlePhoto || ''}
                rules={
                  !companyDetail.firstName
                    ? [
                        {
                          required: true,
                          message: _t('kyc.verification.info.upload.hold'),
                        },
                        {
                          validator: (a, b) =>
                            b
                              ? Promise.resolve()
                              : Promise.reject(
                                  new Error(_t('kyc.verification.info.upload.failed')),
                                ),
                        },
                      ]
                    : []
                }
              >
                <CustomUpload {...uploadHandlePhotoImgProps} />
              </FormItem>
            </div>
          </div>
          <div css={classes.row} style={{ justifyContent: 'flex-start' }}>
            <div>
              <FormItem
                name="idExpireDateM"
                label={_t('kyc.contact.information.certificate.lastdate')}
                validateStatus="error"
                help={errors.idExpireDate || ''}
                rules={!companyDetail.firstName ? [...commonRules] : []}
              >
                <DatePicker disabled={checkedDate} />
              </FormItem>
            </div>
            <div css={classes.expiryCheck}>
              <div css={classes.expiryWrapper}>
                <FormItem
                  name="expiryCheck"
                  initialValue={!defaultCheckedDate}
                  valuePropName="checked"
                >
                  <Checkbox>{_t('kyc.contact.information.certificate.permanent')}</Checkbox>
                </FormItem>
              </div>
            </div>
          </div>
          <div css={classes.row}>
            <div css={classes.item2}>
              <FormItem>
                <Button size="large" variant="outlined" onClick={onPrevious}>
                  {_t('da655b014c1d4000affc')}
                </Button>
              </FormItem>
            </div>
            <div css={classes.item2}>
              <FormItem>
                <Button size="large" onClick={handleSubmit}>
                  {_t('kyc.next.step')}
                </Button>
              </FormItem>
            </div>
          </div>
        </div>
      </FormNew>
    </Form>
  );
};

export default InstitutionalKycPersonalInfo;
