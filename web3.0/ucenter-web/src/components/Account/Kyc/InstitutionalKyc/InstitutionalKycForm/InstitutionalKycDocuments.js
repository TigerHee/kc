/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { Button, Form, styled, useTheme } from '@kux/mui';
import {
  kycSeniorSubmit,
  onValuesChange,
  resetRenderSequence,
} from 'components/Account/Kyc/common/components/CommonFunctions';
import { FAIL_REASON } from 'config/base';
import { getImgBase64 } from 'helper';
import _ from 'lodash';
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import UploadDefaultImg from 'static/account/kyc/upload-default.svg';
import { _t, _tHTML } from 'tools/i18n';
import { saTrackForBiz, trackClick } from 'utils/ga';
import CustomUpload from '../../common/components/CustomUpload';
import Tips from '../../common/components/Tips';
import {
  ERROR_FIELD_MAP,
  KYC_TYPE,
  PDF_LINk,
  PHOTO_TYPE,
  SUPPLEMENTARY_FILE_TYPES,
  SUPPLEMENTARY_OTHER_FILE_TYPES,
  UPLOAD_FILE_SIZE,
  UPLOAD_SIZE_ERROR,
  UPLOAD_TYPE_ERROR,
} from '../../common/constants';
import { useStyle } from './style.js';

const FormNew = styled.div``;

const { FormItem, useForm } = Form;

const IMG_UPLOAD_MAX = 10; // 文件的最大上传的个数
// model name keys
const DATA_KEY = {
  AUTHORIZE_IMG: 'authorizeAttachmentImg',
  PERFORMANCE_IMG: 'performanceAttachmentImg',
  SHAREHOLDERS_IMG: 'shareholdersAttachmentImg',
  DIR_ATT_IMG: 'directorAttachmentImg',
  OTHER_IMG: 'otherAttachmentImg',
};

// model_name -> api_field
const MODEL_TO_FIELD = {
  AUTHORIZE_IMG: 'authorizeAttachments',
  PERFORMANCE_IMG: 'performanceAttachments',
  SHAREHOLDERS_IMG: 'shareholdersAttachments',
  DIR_ATT_IMG: 'directorAttachments',
  OTHER_IMG: 'otherAttachments',
};

const InstitutionalKycDocuments = ({
  authorizeAttachmentImg,
  performanceAttachmentImg,
  shareholdersAttachmentImg,
  directorAttachmentImg,
  otherAttachmentImg,
  onPrevious,
  onSuccessCallback,
  dispatch,
  onError,
  companyDetail,
  failureReason,
}) => {
  const theme = useTheme();
  const [form] = useForm();
  const classes = useStyle({ color: theme.colors, breakpoints: theme.breakpoints });
  const upLoading = useSelector((state) => state.loading.effects['kyc/kycUpload']);
  const { currentLang = 'zh_CN' } = useLocale();
  const isCN = currentLang === 'zh_CN';
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
    // eslint-disable-next-line no-unused-expressions
    Object.keys(failureReason).length && form.validateFields();
    // 组件删除后重置该属性，保证再次进入时的一致性
    return resetRenderSequence;
  }, [failureReason]);

  // 新的图片多张上传的参数处理函数
  const handlerResultSubmit = () => {
    // 将数据的key和value对应
    let obj = {};
    _.forIn(MODEL_TO_FIELD, (value, key) => {
      let tempArr = DATA_MODEL[key];
      if (_.isArray(tempArr) && !_.isEmpty(tempArr)) {
        tempArr = _.map(tempArr, (item) => item.key);
      }
      obj[value] = tempArr;
    });
    return obj;
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then(() => {
        // 新的多张图片的上传，todo接口连调
        const result = handlerResultSubmit();
        kycSeniorSubmit({
          values: result,
          dispatch,
          onSuccessCallback,
          onError,
          service: 'submitKycCompMoreImg',
        });

        let locationid = '1';
        if (companyDetail?.verifyStatus >= 0) {
          locationid = Object.values(result)?.some((v) => v?.length > 0) ? '3' : '2';
        }
        trackClick(['Submit', locationid]);
      })
      .catch((err) => {
        console.log('err:', err);
      });
  };

  // model data keys
  const DATA_MODEL = {
    AUTHORIZE_IMG: authorizeAttachmentImg,
    PERFORMANCE_IMG: performanceAttachmentImg,
    SHAREHOLDERS_IMG: shareholdersAttachmentImg,
    DIR_ATT_IMG: directorAttachmentImg,
    OTHER_IMG: otherAttachmentImg,
  };

  // 限制大小
  const beforeUploadImage = (file, multi) => {
    // 如果是正在上传，则直接返回
    if (upLoading) return;
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
        [modelName]: newData ? modelData.concat([{ url: newData, key }]) : modelData,
      },
    });
  };

  // 多张图片展示处理回显示
  const handleShowImgAndKey = (list = [], modelName) => {
    return _.forEach(list, (item) => {
      item.url = UploadDefaultImg; // 将返回数据中的***覆盖为默认的图片展示
      item.key = item.fileId; // 为了兼容以前的老key的数据，所以添加了属性值
      updateImage(modelName, list, null, item.fileId);
    });
  };

  useEffect(() => {
    saTrackForBiz({}, ['Document', '']);
  }, []);

  // 认证通过的，再次认证时，展示默认图片
  // 改成多个上传之后，处理回填的时候，需要将原本的key附带上，不再处理为generateUuid
  useEffect(() => {
    if (companyDetail.verifyFailReason) {
      const {
        authorizeAttachments = [],
        performanceAttachments = [],
        shareholdersAttachments = [],
        directorAttachments = [],
        otherAttachments = [],
      } = companyDetail || {};
      if (!errors.authorizeAttachments) {
        handleShowImgAndKey(authorizeAttachments, DATA_KEY.AUTHORIZE_IMG);
      }
      if (!errors.performanceAttachments) {
        handleShowImgAndKey(performanceAttachments, DATA_KEY.PERFORMANCE_IMG);
      }
      if (!errors.shareholdersAttachments) {
        handleShowImgAndKey(shareholdersAttachments, DATA_KEY.SHAREHOLDERS_IMG);
      }
      if (!errors.directorAttachments) {
        handleShowImgAndKey(directorAttachments, DATA_KEY.DIR_ATT_IMG);
      }
      if (!errors.otherAttachments) {
        handleShowImgAndKey(otherAttachments, DATA_KEY.OTHER_IMG);
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
    // 如果多张图片均已经删除，才进行置为空
    form.setFieldsValue({ [fieldName]: tmpImages });
  };

  // 上传董事会决议或授权书
  const uploadAuthorizeAttachmentImgProps = {
    disabled: upLoading, //如果有文件正在上传，则禁止上传操作
    max: IMG_UPLOAD_MAX,
    dispatch,
    beforeUpload: (file) => beforeUploadImage(file, SUPPLEMENTARY_FILE_TYPES),
    images: DATA_MODEL.AUTHORIZE_IMG,
    photoType: PHOTO_TYPE.AUTHORIZE_IMG,
    kycType: KYC_TYPE.INSTITUTIONAL,
    onRemove: (key) =>
      removeImage(
        DATA_KEY.AUTHORIZE_IMG,
        DATA_MODEL.AUTHORIZE_IMG,
        key,
        MODEL_TO_FIELD.AUTHORIZE_IMG,
      ),
    onSuccess: (data) =>
      onUploadSuccess({
        ...data,
        modelName: DATA_KEY.AUTHORIZE_IMG,
        modelData: DATA_MODEL.AUTHORIZE_IMG,
      }),
  };

  // 上传履约承诺协议
  const uploadPerformanceAttachmentImgProps = {
    disabled: upLoading, //如果有文件正在上传，则禁止上传操作
    max: IMG_UPLOAD_MAX,
    dispatch,
    beforeUpload: (file) => beforeUploadImage(file, SUPPLEMENTARY_FILE_TYPES),
    images: DATA_MODEL.PERFORMANCE_IMG,
    photoType: PHOTO_TYPE.PERFORMANCE_IMG,
    kycType: KYC_TYPE.INSTITUTIONAL,
    onRemove: (key) =>
      removeImage(
        DATA_KEY.PERFORMANCE_IMG,
        DATA_MODEL.PERFORMANCE_IMG,
        key,
        MODEL_TO_FIELD.PERFORMANCE_IMG,
      ),
    onSuccess: (data) =>
      onUploadSuccess({
        ...data,
        modelName: DATA_KEY.PERFORMANCE_IMG,
        modelData: DATA_MODEL.PERFORMANCE_IMG,
      }),
  };

  // 上传股东名单
  const uploadShareholdersAttachmentImgProps = {
    disabled: upLoading, //如果有文件正在上传，则禁止上传操作
    max: IMG_UPLOAD_MAX,
    dispatch,
    beforeUpload: (file) => beforeUploadImage(file, SUPPLEMENTARY_FILE_TYPES),
    images: DATA_MODEL.SHAREHOLDERS_IMG,
    photoType: PHOTO_TYPE.SHAREHOLDERS_IMG,
    kycType: KYC_TYPE.INSTITUTIONAL,
    onRemove: (key) =>
      removeImage(
        DATA_KEY.SHAREHOLDERS_IMG,
        DATA_MODEL.SHAREHOLDERS_IMG,
        key,
        MODEL_TO_FIELD.SHAREHOLDERS_IMG,
      ),
    onSuccess: (data) =>
      onUploadSuccess({
        ...data,
        modelName: DATA_KEY.SHAREHOLDERS_IMG,
        modelData: DATA_MODEL.SHAREHOLDERS_IMG,
      }),
  };

  // 上传所有董事名单
  const uploadDirectorAttachmentImgProps = {
    disabled: upLoading, //如果有文件正在上传，则禁止上传操作
    max: IMG_UPLOAD_MAX,
    dispatch,
    images: DATA_MODEL.DIR_ATT_IMG,
    photoType: PHOTO_TYPE.BOARD_OF_DIRECTORS,
    kycType: KYC_TYPE.INSTITUTIONAL,
    beforeUpload: (file) => beforeUploadImage(file, SUPPLEMENTARY_FILE_TYPES),
    onRemove: (key) =>
      removeImage(DATA_KEY.DIR_ATT_IMG, DATA_MODEL.DIR_ATT_IMG, key, MODEL_TO_FIELD.DIR_ATT_IMG),
    onSuccess: (data) =>
      onUploadSuccess({
        ...data,
        modelName: DATA_KEY.DIR_ATT_IMG,
        modelData: DATA_MODEL.DIR_ATT_IMG,
      }),
  };

  // 上传其他证件
  const uploadOtherAttachmentImgProps = {
    disabled: upLoading, //如果有文件正在上传，则禁止上传操作
    max: IMG_UPLOAD_MAX,
    dispatch,
    beforeUpload: (file) => beforeUploadImage(file, SUPPLEMENTARY_OTHER_FILE_TYPES),
    images: DATA_MODEL.OTHER_IMG,
    photoType: PHOTO_TYPE.OTHER_IMG,
    kycType: KYC_TYPE.INSTITUTIONAL,
    onRemove: (key) =>
      removeImage(DATA_KEY.OTHER_IMG, DATA_MODEL.OTHER_IMG, key, MODEL_TO_FIELD.OTHER_IMG),
    onSuccess: (data) =>
      onUploadSuccess({
        ...data,
        modelName: DATA_KEY.OTHER_IMG,
        modelData: DATA_MODEL.OTHER_IMG,
      }),
  };

  // 多张上传的校验规则
  const validateRuleFlag =
    !companyDetail.authorizeAttachments ||
    (_.isArray(companyDetail.authorizeAttachments) &&
      _.isEmpty(companyDetail.authorizeAttachments));

  const handleValueChange = useCallback(
    (data) => {
      onValuesChange({ failureReason, dispatch }, data);
    },
    [failureReason, dispatch],
  );

  return (
    <Form size="small" name="MechanismKycDocuments" form={form} onValuesChange={handleValueChange}>
      <FormNew css={classes.root}>
        <div css={classes.part}>
          <div css={classes.partLabel}>{_t('kyc.verification.info.documents.title')}</div>
          <div css={classes.partLabelTips}>
            <div>
              {_tHTML('kyc.verification.info.documents.subTitle1', {
                text: _t('kyc.verification.info.documents.link1'),
                link: PDF_LINk.statement,
              })}
            </div>
            <div>{_t('kyc.verification.info.documents.subTitle2')}</div>
            <div>{_t('kyc.verification.info.documents.subTitle3')}</div>
            <div>{_t('kyc.verification.info.documents.subTitle4')}</div>
            <div>{_t('kyc.verification.info.documents.subTitle5')}</div>
            <div>{_t('kyc.verification.info.documents.subTitle6')}</div>
          </div>
          <div css={classes.row}>
            <div css={classes.uploadWrapper}>
              <div css={classes.label}>{_t('kyc.verification.info.documents.item1')}*</div>
              <div css={classes.notice}>{_t('kyc.verification.info.documents.item.limit')}</div>
              <Tips
                topContent={
                  <div>
                    {_t('kyc.verification.info.documents.item.tips1')}
                    <a href={PDF_LINk.resolution} target="_blank" rel="noreferrer">
                      {_t('kyc.verification.info.documents.link2')}
                    </a>
                    、
                    <a href={PDF_LINk.certificate} target="_blank" rel="noreferrer">
                      {_t('kyc.verification.info.documents.link3')}
                    </a>
                    ；
                  </div>
                }
                bottomContent={[_t('kyc.verification.info.documents.item.tips2')]}
              />
              <FormItem
                required
                help={errors.authorizeAttachments || ''}
                name="authorizeAttachment"
                validateStatus="error"
                rules={
                  validateRuleFlag
                    ? [
                        {
                          required: true,
                          message: _t('kyc.verification.info.documents.item.required1'),
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
                <CustomUpload {...uploadAuthorizeAttachmentImgProps} />
              </FormItem>
            </div>
          </div>
          <div css={classes.row}>
            <div css={classes.uploadWrapper}>
              <div css={classes.label}>{_t('kyc.verification.info.documents.item2')}*</div>
              <div css={classes.notice}>{_t('kyc.verification.info.documents.item.limit')}</div>
              <Tips
                topContent={
                  <div>
                    {_t('kyc.verification.info.documents.item.tips1')}
                    <a href={PDF_LINk.commitment} target="_blank" rel="noreferrer">
                      {_t('kyc.verification.info.documents.link4')}
                    </a>
                    。
                  </div>
                }
              />
              <FormItem
                required
                help={errors.performanceAttachments || ''}
                name="performanceAttachment"
                validateStatus="error"
                rules={
                  validateRuleFlag
                    ? [
                        {
                          required: true,
                          message: _t('kyc.verification.info.documents.item.required2'),
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
                <CustomUpload {...uploadPerformanceAttachmentImgProps} />
              </FormItem>
            </div>
          </div>
          <div css={classes.row}>
            <div css={classes.uploadWrapper}>
              <div css={classes.label}>{_t('kyc.verification.info.documents.item3')}*</div>
              <div css={classes.notice}>{_t('kyc.verification.info.documents.item.limit')}</div>
              <Tips
                topContent={<div>{_t('kyc.verification.info.documents.item.tips3')}</div>}
                bottomContent={[
                  _t('kyc.verification.info.documents.item.tips4'),
                  _t('kyc.verification.info.documents.item.tips5'),
                  _t('kyc.verification.info.documents.item.tips6'),
                ]}
              />
              <FormItem
                required
                help={errors.shareholdersAttachments || ''}
                name="shareholdersAttachment"
                validateStatus="error"
                rules={
                  validateRuleFlag
                    ? [
                        {
                          required: true,
                          message: _t('kyc.verification.info.documents.item.required3'),
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
                <CustomUpload {...uploadShareholdersAttachmentImgProps} />
              </FormItem>
            </div>
          </div>
          <div css={classes.row}>
            <div css={classes.uploadWrapper}>
              <div css={classes.label}>{_t('kyc.verification.info.documents.item5')}*</div>
              <div css={classes.notice}>{_t('kyc.verification.info.documents.item.limit')}</div>
              <Tips topContent={<div>{_t('kyc.verification.info.documents.item.tips7')}</div>} />
              <FormItem
                required
                help={errors.directorAttachments || ''}
                name="directorAttachment"
                validateStatus="error"
                rules={
                  validateRuleFlag
                    ? [
                        {
                          required: true,
                          message: _t('kyc.verification.info.documents.item.required4'),
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
                <CustomUpload {...uploadDirectorAttachmentImgProps} />
              </FormItem>
            </div>
          </div>
          <div css={classes.row}>
            <div css={classes.uploadWrapper}>
              <div css={classes.label}>{_t('kyc.verification.info.documents.item4')}</div>
              <div css={classes.notice}>{_t('ac5d43a873cd4000ae4f')}</div>
              <Tips
                topContent={_t('kyc.verification.info.documents.item.tips9')}
                bottomContent={null}
              />
              <FormItem
                required
                help={errors.otherAttachments || ''}
                name="otherAttachment"
                validateStatus="error"
                rules={
                  validateRuleFlag
                    ? [
                        {
                          required: true,
                          message: _t('kyc.uploadIncumbency'),
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
                <CustomUpload {...uploadOtherAttachmentImgProps} />
              </FormItem>
            </div>
          </div>
          <div css={classes.row}>
            <div css={classes.item2}>
              <FormItem>
                <Button size="large" variant="outlined" css={classes.button} onClick={onPrevious}>
                  {_t('da655b014c1d4000affc')}
                </Button>
              </FormItem>
            </div>
            <div css={classes.item2}>
              <FormItem>
                <Button
                  variant="contained"
                  size="large"
                  css={classes.button}
                  onClick={handleSubmit}
                >
                  {_t('kyc.form.confirm')}
                </Button>
              </FormItem>
            </div>
          </div>
        </div>
      </FormNew>
    </Form>
  );
};

export default InstitutionalKycDocuments;
