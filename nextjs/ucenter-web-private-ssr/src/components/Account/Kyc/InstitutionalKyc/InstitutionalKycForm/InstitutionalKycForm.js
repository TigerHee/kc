/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from 'hooks/useLocale';
import {
  Button,
  DatePicker as KcDatePicker,
  Form,
  Input,
  Select,
  styled,
  useTheme,
} from '@kux/mui';
import { FAIL_REASON } from 'config/base';
import { generateUuid, getImgBase64 } from 'helper';
import { forEach, filter, map } from 'lodash-es';
import moment from 'moment';
import { useEffect } from 'react';
import UploadDefaultImg from 'static/account/kyc/upload-default.svg';
import { _t } from 'tools/i18n';
import { saTrackForBiz, trackClick } from 'utils/ga';
import {
  filterParams,
  kycSeniorSubmit,
  onValuesChange,
  resetRenderSequence,
} from '../../common/components/CommonFunctions';
import CustomUpload from '../../common/components/CustomUpload';
import HoldInfo from '../../common/components/HoldInfo';
import {
  ERROR_FIELD_MAP,
  KYC_TYPE,
  MULTIPLE_FILE_TYPES,
  NORMAL_FILE_TYPES,
  PHOTO_TYPE,
  SOURCE,
  TRADE_OPTIONS,
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
  REG_ATT_IMG: 'registrationAttachmentImg',
  HAND_REG_ATT_IMG: 'handleRegistrationAttachmentImg',
};

// model_name -> api_field
const MODEL_TO_FIELD = {
  REG_ATT_IMG: 'registrationAttachment',
  HAND_REG_ATT_IMG: 'handleRegistrationAttachment',
};

const countryFilter = (opts, state) => {
  const { inputValue } = state;
  const _other = [];
  const result = opts.filter((v) => {
    if (v.code === 'OT') {
      _other.push(v);
    }
    return v.name.indexOf(inputValue) > -1;
  });
  if (result.length === 0) {
    return _other;
  }
  return result;
};

const InstitutionalKycForm = ({
  onSuccessCallback,
  dispatch,
  onError,
  registrationAttachmentImg,
  handleRegistrationAttachmentImg,
  kycCode,
  countries,
  companyDetail,
  failureReason,
}) => {
  const [form] = useForm();
  const theme = useTheme();
  const classes = useStyle({ color: theme.colors, breakpoints: theme.breakpoints });
  const { currentLang = 'zh_CN' } = useLocale();
  const isCN = currentLang === 'zh_CN';
  const defaultWorkCountry =
    countries.filter((item) => item.code === companyDetail.workCountry)[0] || {};
  const defaultRegistrationCountry =
    countries.filter((item) => item.code === companyDetail.registrationCountry)[0] || {};
  const defaultTradeAmount = companyDetail.tradeAmount || '';
  const defaultRegistrationDate = companyDetail.registrationDate || moment().format('YYYY-MM-DD');

  const errorKeys = Object.keys(failureReason);

  const errors = {};
  forEach(errorKeys, (key) => {
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
    saTrackForBiz({}, ['Company', '']);
  }, []);

  useEffect(() => {

    Object.keys(failureReason).length && form.validateFields();

    // 组件删除后重置该属性，保证再次进入时的一致性
    return resetRenderSequence;
  }, [failureReason]);

  useEffect(() => {
    form.setFieldsValue({
      registrationDate: moment(defaultRegistrationDate),
      registrationCountry: defaultRegistrationCountry.code,
      workCountry: defaultWorkCountry.code,
      tradeAmount: defaultTradeAmount,
    });
  }, [companyDetail, countries]);

  const handleSubmit = (e) => {
    e.preventDefault();
    form
      .validateFields()
      .then((values) => {
        values.workCountry = values.workCountry;
        values.registrationCountry = values.registrationCountry;
        values.registrationDate = moment(values.registrationDate).format('YYYY-MM-DD');

        const filteredParams = filterParams(values);
        kycSeniorSubmit({
          values: { ...filteredParams, source: SOURCE },
          dispatch,
          onSuccessCallback,
          onError,
          service: 'kycCompBasicSubmit',
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
        trackClick(['CompanyNext', locationid]);
      })
      .catch((e) => {
        console.log('e:', e);
      });
  };

  // model data keys
  const DATA_MODEL = {
    REG_ATT_IMG: registrationAttachmentImg,
    HAND_REG_ATT_IMG: handleRegistrationAttachmentImg,
  };

  // 限制大小
  const beforeUploadImage = (file, multi) => {
    if (file.size >= UPLOAD_FILE_SIZE) {
      // 文件大小限制
      const uploadErr = isCN ? UPLOAD_SIZE_ERROR.zh_CN : UPLOAD_SIZE_ERROR.en_US;

      onError && typeof onError === 'function' && onError(uploadErr);
      return false;
    }
    if (!multi.includes(file.type)) {
      // 文件类型限制
      const uploadErr = isCN ? UPLOAD_TYPE_ERROR.zh_CN : UPLOAD_TYPE_ERROR.en_US;

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
    if (companyDetail.verifyFailReason && !DATA_MODEL.HAND_REG_ATT_IMG.length) {
      if (!errors.registrationAttachment) {
        updateImage(DATA_KEY.REG_ATT_IMG, DATA_MODEL.REG_ATT_IMG, UploadDefaultImg);
      }
      if (!errors.handleRegistrationAttachment) {
        updateImage(DATA_KEY.HAND_REG_ATT_IMG, DATA_MODEL.HAND_REG_ATT_IMG, UploadDefaultImg);
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
    const tmpImages = filter(modelData, (item) => item.key !== key);
    dispatch({ type: 'kyc/update', payload: { [modelName]: tmpImages } });
    form.setFieldsValue({ [fieldName]: '' });
  };

  // 上传公司注册证书和商业登记证
  const uploadRegistrationAttachmentImgProps = {
    dispatch,
    images: DATA_MODEL.REG_ATT_IMG,
    photoType: PHOTO_TYPE.CERTIFICATE_OF_INCORPORATION,
    kycType: KYC_TYPE.INSTITUTIONAL,
    beforeUpload: (file) => beforeUploadImage(file, MULTIPLE_FILE_TYPES),
    onRemove: (key) =>
      removeImage(DATA_KEY.REG_ATT_IMG, DATA_MODEL.REG_ATT_IMG, key, MODEL_TO_FIELD.REG_ATT_IMG),
    onSuccess: (data) =>
      onUploadSuccess({
        ...data,
        modelName: DATA_KEY.REG_ATT_IMG,
        modelData: DATA_MODEL.REG_ATT_IMG,
      }),
  };

  // 上传手持公司注册证书照
  const uploadHandleRegistrationAttachmentImgProps = {
    dispatch,
    images: DATA_MODEL.HAND_REG_ATT_IMG,
    photoType: PHOTO_TYPE.PHOTO_OF_CERTIFICATE,
    kycType: KYC_TYPE.INSTITUTIONAL,
    beforeUpload: (file) => beforeUploadImage(file, NORMAL_FILE_TYPES),
    onRemove: (key) =>
      removeImage(
        DATA_KEY.HAND_REG_ATT_IMG,
        DATA_MODEL.HAND_REG_ATT_IMG,
        key,
        MODEL_TO_FIELD.HAND_REG_ATT_IMG,
      ),
    onSuccess: (data) =>
      onUploadSuccess({
        ...data,
        modelName: DATA_KEY.HAND_REG_ATT_IMG,
        modelData: DATA_MODEL.HAND_REG_ATT_IMG,
      }),
  };

  const commonRules = [
    {
      required: true,
      message: _t('kyc.form.required'),
    },
  ];

  const countryOptions = countries
    .filter((i) => [3].includes(i?.regionType))
    .map((item) => {
      if (item.code === 'OT') {
        return {
          label: (isInSelectInput) => {
            return (
              <div>
                {item.name}
                {item.code === 'OT' && !isInSelectInput ? (
                  <div css={classes.autoCompleteTip}>{_t('kyc.country.other')}</div>
                ) : null}
              </div>
            );
          },
          value: item.code,
          title: item.name,
        };
      }
      return { label: item.name, value: item.code, title: item.name };
    });

  return (
    <Form
      form={form}
      onValuesChange={(values) => {
        onValuesChange({ dispatch, failureReason }, values);

        if (values?.registrationCountry) {
          trackClick(['Country', '1']);
        }
      }}
    >
      <FormNew css={classes.root}>
        <div css={classes.part}>
          <div css={classes.partLabel}>
            <span css={classes.labelDot} />
            {_t('kyc.form.basic')}
          </div>
          <div css={classes.row}>
            <div css={classes.item3}>
              <FormItem
                name="name"
                label={_t('kyc.company.name')}
                validateStatus="error"
                help={errors.name}
                rules={
                  !companyDetail.name
                    ? [...commonRules, ...getValidateLengthRule(500)]
                    : getValidateLengthRule(500)
                }
              >
                <Input allowClear={true} placeholder={companyDetail.name || ''} />
              </FormItem>
            </div>
            <div css={classes.item3}>
              <FormItem
                name="registrationDate"
                label={_t('kyc.company.regDate')}
                validateStatus="error"
                help={errors.registrationDate || ''}
                rules={!companyDetail.name ? [...commonRules] : []}
              >
                <KcDatePicker style={{ width: '100%' }} />
              </FormItem>
            </div>
            <div css={classes.item3}>
              <FormItem
                name="code"
                label={_t('kyc.company.code')}
                validateStatus="error"
                help={errors.code}
                rules={
                  !companyDetail.name
                    ? [...commonRules, ...getValidateLengthRule(200)]
                    : getValidateLengthRule(200)
                }
              >
                <Input allowClear={true} placeholder={companyDetail.code || ''} />
              </FormItem>
            </div>
          </div>
          <div css={classes.row}>
            <div css={classes.item3}>
              <FormItem
                name="dutyParagraph"
                label={_t('kyc.company.taxCode')}
                validateStatus="error"
                help={errors.dutyParagraph || ''}
                rules={
                  !companyDetail.name
                    ? [...commonRules, ...getValidateLengthRule(24)]
                    : getValidateLengthRule(24)
                }
              >
                <Input allowClear={true} placeholder={companyDetail.dutyParagraph || ''} />
              </FormItem>
            </div>
            <div css={classes.item3}>
              <FormItem
                name="capitalSource"
                label={_t('kyc.company.ivSource')}
                validateStatus="error"
                help={errors.capitalSource || ''}
                rules={
                  !companyDetail.name
                    ? [...commonRules, ...getValidateLengthRule(256)]
                    : getValidateLengthRule(256)
                }
              >
                <Input allowClear={true} placeholder={companyDetail.capitalSource || ''} />
              </FormItem>
            </div>
            <div css={classes.item3}>
              <FormItem
                name="tradeAmount"
                label={_t('kyc.company.tradeAmout')}
                validateStatus="error"
                help={errors.tradeAmount || ''}
                rules={!companyDetail.name ? [...commonRules] : []}
              >
                <Select
                  options={map(TRADE_OPTIONS, (item) => {
                    return { label: item.value, value: item.code, title: item.value };
                  })}
                />
              </FormItem>
            </div>
          </div>
          <div css={classes.row}>
            <div css={classes.item1}>
              <FormItem
                name="director"
                label={_t('kyc.company.director')}
                validateStatus={errors.director ? 'error' : 'info'}
                help={errors.director ? errors.director : _t('kyc.director.help')}
                rules={
                  !companyDetail.name
                    ? [...commonRules, ...getValidateLengthRule(500)]
                    : getValidateLengthRule(500)
                }
              >
                <Input allowClear={true} placeholder={companyDetail.director || ''} />
              </FormItem>
            </div>
          </div>
          <div css={classes.row}>
            <div css={classes.item1}>
              <FormItem
                name="governmentWebsite"
                label={_t('kyc.company.govUrl')}
                validateStatus="error"
                help={errors.governmentWebsite || ''}
                rules={getValidateLengthRule(400)}
              >
                <Input allowClear={true} placeholder={companyDetail.governmentWebsite || ''} />
              </FormItem>
            </div>
          </div>
          <div css={classes.row}>
            <div css={classes.item1}>
              <FormItem
                name="officialWebsite"
                label={_t('kyc.company.url')}
                validateStatus="error"
                help={errors.officialWebsite || ''}
                rules={getValidateLengthRule(300)}
              >
                <Input allowClear={true} placeholder={companyDetail.officialWebsite || ''} />
              </FormItem>
            </div>
          </div>
        </div>
        <div css={classes.part}>
          <div css={classes.partLabel}>
            <span css={classes.labelDot} />
            {_t('com.reg.info')}
          </div>
          <div css={classes.row}>
            <div css={classes.item2}>
              <FormItem
                name="registrationCountry"
                label={_t('kyc.company.regAddr')}
                validateStatus="error"
                help={errors.registrationCountry || ''}
                rules={[
                  {
                    validator: (a, b) => {
                      return b
                        ? Promise.resolve()
                        : Promise.reject(new Error(_t('kyc.form.required')));
                    },
                  },
                ]}
              >
                <Select allowSearch options={countryOptions} />
              </FormItem>
            </div>
            <div css={classes.item2} required>
              <FormItem
                name="registrationProvince"
                label={_t('kyc.form.state')}
                validateStatus="error"
                help={errors.registrationProvince || ''}
                rules={
                  !companyDetail.name
                    ? [...commonRules, ...getValidateLengthRule(500)]
                    : getValidateLengthRule(500)
                }
              >
                <Input allowClear={true} placeholder={companyDetail.registrationProvince || ''} />
              </FormItem>
            </div>
          </div>
          <div css={classes.row}>
            <div css={classes.item2}>
              <FormItem
                name="registrationCity"
                label={_t('kyc.form.city')}
                validateStatus="error"
                help={errors.registrationCity || ''}
                rules={
                  !companyDetail.name
                    ? [...commonRules, ...getValidateLengthRule(500)]
                    : getValidateLengthRule(500)
                }
              >
                <Input allowClear={true} placeholder={companyDetail.registrationCity || ''} />
              </FormItem>
            </div>
            <div css={classes.item2}>
              <FormItem
                name="registrationPostcode"
                label={_t('kyc.form.postcode')}
                validateStatus="error"
                help={errors.registrationPostcode || ''}
                rules={
                  !companyDetail.name
                    ? [...commonRules, ...getValidateLengthRule(100)]
                    : getValidateLengthRule(100)
                }
              >
                <Input allowClear={true} placeholder={companyDetail.registrationPostcode || ''} />
              </FormItem>
            </div>
          </div>
          <div css={classes.row}>
            <div css={classes.item2}>
              <FormItem
                name="registrationStreet"
                label={_t('kyc.form.street')}
                validateStatus="error"
                help={errors.registrationStreet || ''}
                rules={
                  !companyDetail.name
                    ? [...commonRules, ...getValidateLengthRule(500)]
                    : getValidateLengthRule(500)
                }
              >
                <Input allowClear={true} placeholder={companyDetail.registrationStreet || ''} />
              </FormItem>
            </div>
            <div css={classes.item2}>
              <FormItem
                name="registrationHome"
                label={_t('kyc.form.houseno')}
                validateStatus="error"
                help={errors.registrationHome || ''}
                rules={
                  !companyDetail.name
                    ? [...commonRules, ...getValidateLengthRule(500)]
                    : getValidateLengthRule(500)
                }
              >
                <Input allowClear={true} placeholder={companyDetail.registrationHome || ''} />
              </FormItem>
            </div>
          </div>
        </div>
        <div css={classes.part}>
          <div css={classes.partLabel}>
            <span css={classes.labelDot} />
            {_t('com.work.info')}
          </div>
          <div css={classes.row}>
            <div css={classes.item2}>
              <FormItem
                name="workCountry"
                label={_t('kyc.company.addr')}
                validateStatus="error"
                help={errors.workCountry || ''}
                rules={[
                  {
                    validator: (a, b) => {
                      return b
                        ? Promise.resolve()
                        : Promise.reject(new Error(_t('kyc.form.required')));
                    },
                  },
                ]}
              >
                <Select allowSearch options={countryOptions} />
              </FormItem>
            </div>
            <div css={classes.item2} required>
              <FormItem
                name="workProvince"
                label={_t('kyc.form.state')}
                validateStatus="error"
                help={errors.workProvince || ''}
                rules={
                  !companyDetail.name
                    ? [...commonRules, ...getValidateLengthRule(100)]
                    : getValidateLengthRule(100)
                }
              >
                <Input allowClear={true} placeholder={companyDetail.workProvince || ''} />
              </FormItem>
            </div>
          </div>
          <div css={classes.row}>
            <div css={classes.item2}>
              <FormItem
                name="workCity"
                label={_t('kyc.form.city')}
                validateStatus="error"
                help={errors.workCity || ''}
                rules={
                  !companyDetail.name
                    ? [...commonRules, ...getValidateLengthRule(500)]
                    : getValidateLengthRule(500)
                }
              >
                <Input allowClear={true} placeholder={companyDetail.workCity || ''} />
              </FormItem>
            </div>
            <div css={classes.item2}>
              <FormItem
                name="workPostcode"
                label={_t('kyc.form.postcode')}
                validateStatus="error"
                help={errors.workPostcode || ''}
                rules={
                  !companyDetail.name
                    ? [...commonRules, ...getValidateLengthRule(40)]
                    : getValidateLengthRule(40)
                }
              >
                <Input allowClear={true} placeholder={companyDetail.workPostcode || ''} />
              </FormItem>
            </div>
          </div>
          <div css={classes.row}>
            <div css={classes.item2}>
              <FormItem
                name="workStreet"
                label={_t('kyc.form.street')}
                validateStatus="error"
                help={errors.workStreet || ''}
                rules={
                  !companyDetail.name
                    ? [...commonRules, ...getValidateLengthRule(500)]
                    : getValidateLengthRule(500)
                }
              >
                <Input allowClear={true} placeholder={companyDetail.workStreet || ''} />
              </FormItem>
            </div>
            <div css={classes.item2}>
              <FormItem
                name="workHome"
                label={_t('kyc.form.houseno')}
                validateStatus="error"
                help={errors.workHome || ''}
                rules={
                  !companyDetail.name
                    ? [...commonRules, ...getValidateLengthRule(500)]
                    : getValidateLengthRule(500)
                }
              >
                <Input allowClear={true} placeholder={companyDetail.workHome || ''} />
              </FormItem>
            </div>
          </div>
        </div>
        <div css={classes.part}>
          <div css={classes.partLabel}>
            <span css={classes.labelDot} />
            {_t('kyc.company.docs')}
          </div>
          <div css={classes.row}>
            <div css={classes.uploadWrapper}>
              <div css={classes.label}>
                {_t('kyc.mechanism.verify.company.certificate.upload')}*
              </div>
              <div css={classes.notice}>
                {_t('kyc.mechanism.verify.company.certificate.upload.info')}
              </div>
              <FormItem
                name="registrationAttachment"
                validateStatus="error"
                help={errors.registrationAttachment || ''}
                rules={
                  !companyDetail.name
                    ? [
                      {
                        required: true,
                        message: _t('kyc.verification.info.upload.corp.docum'),
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
                <CustomUpload {...uploadRegistrationAttachmentImgProps} />
              </FormItem>
            </div>
          </div>
          <div css={classes.row}>
            <div css={classes.uploadWrapper}>
              <div css={classes.label}>
                {_t('kyc.mechanism.verify.company.certificate.holding.upload')}*
              </div>
              <div css={classes.notice}>{_t('biz.tips.front')}</div>
              <HoldInfo code={kycCode} type="institutional" />
              <FormItem
                name="handleRegistrationAttachment"
                validateStatus="error"
                help={errors.handleRegistrationAttachment || ''}
                rules={
                  !companyDetail.name
                    ? [
                      {
                        required: true,
                        message: _t('kyc.verification.info.upload.hold.corp.docum'),
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
                <CustomUpload {...uploadHandleRegistrationAttachmentImgProps} />
              </FormItem>
            </div>
          </div>
          <FormItem>
            <Button onClick={handleSubmit} size="large" style={{ width: '100%' }}>
              {_t('kyc.next.step')}
            </Button>
          </FormItem>
        </div>
      </FormNew>
    </Form>
  );
};

export default InstitutionalKycForm;
