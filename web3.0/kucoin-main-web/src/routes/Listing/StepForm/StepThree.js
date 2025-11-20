/**
 * Owner: tom@kupotech.com
 */
import React, { useCallback, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { map, isEmpty } from 'lodash';
import { Form, Input, Button, Checkbox } from '@kufox/mui';
import { useSnackbar } from '@kufox/mui';
import { useResponsive } from '@kufox/mui';
import { styled } from '@kufox/mui';
import { _t, _tHTML } from 'tools/i18n';
import { initFile, getFileUrl } from '../common/config';
import { StepTitle } from '../common/StyledComps';
import UploadCmpt from './UploadCmpt';

const { FormItem, useForm } = Form;

const FormStyle = styled(Form)`
  width: 588px;
  margin-top: 40px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    margin-top: 15px;
  }
  .KuxForm-itemHelp {
    min-height: 30px;
  }
  .KuxForm-itemLabel {
    display: flex;
  }
  .KuxInput-container {
    margin-top: 10px;
  }
`;

const LabelWrapper = styled.div`
  display: inline;
`;

const Label = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-size: 12px;
  line-height: 150%;
`;

const ExtraInfo = styled.div`
  margin-top: 2px;
  color: ${(props) => props.theme.colors.text40};
  font-size: 12px;
  line-height: 150%;
  .green {
    color: #01bc8d;
  }
`;

const MarginTop = styled.div`
  margin-top: 50px;
`;

const ReadText = styled.span`
  .green {
    color: #01bc8d;
  }
`;

const BtnGroup = styled.div``;

const SubmitButton = styled(Button)`
  min-width: 282px;
  border-radius: 6px;
  font-weight: 500;
  :last-child {
    margin-left: 24px;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    min-width: 48.7%;
    max-width: 48.7%;
    :last-child {
      margin-left: 2.6%;
    }
  }
`;

function StepThree() {
  const { message } = useSnackbar();
  const dispatch = useDispatch();
  const { detail } = useSelector((state) => state.listing);
  const loading = useSelector((state) => state.loading.effects['listing/applySubmit']);
  const timerRef = useRef(null);

  const { sm, md, lg } = useResponsive();
  const isPc = sm && md && lg;
  const isMobile = sm && !md && !lg;
  const uploadWidth = isPc ? 588 : isMobile ? 'calc(100vw - 32px)' : 'calc(100vw - 48px)';

  const [form] = useForm();
  const file1 = Form.useWatch('dueDiligenceInfo', form);
  const file2 = Form.useWatch('majorLegalEntity', form);
  const file3 = Form.useWatch('legalOpinion', form);
  const file4 = Form.useWatch('projectWhitePaper', form);
  const file5 = Form.useWatch('signedVersion', form);
  const file6 = Form.useWatch('securityReviewReport', form);
  const file7 = Form.useWatch('kycInformation', form);
  const btnDisable =
    isEmpty(file1) ||
    isEmpty(file2) ||
    isEmpty(file3) ||
    isEmpty(file4) ||
    isEmpty(file5) ||
    isEmpty(file6) ||
    isEmpty(file7)
      ? true
      : false;

  useEffect(() => {
    form.setFieldsValue({
      dueDiligenceInfo: initFile(detail.dueDiligenceInfo),
      majorLegalEntity: initFile(detail.majorLegalEntity),
      legalOpinion: initFile(detail.legalOpinion),
      projectWhitePaper: initFile(detail.projectWhitePaper),
      signedVersion: initFile(detail.signedVersion),
      securityReviewReport: initFile(detail.securityReviewReport),
      kycInformation: initFile(detail.kycInformation),
      remark: detail.remark,
    });

    // 1分钟保存一次草稿
    timerRef.current = setInterval(() => {
      saveDraft();
    }, 60000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const saveDraft = () => {
    const values = form.getFieldsValue(true) || {};
    if (isEmpty(values)) return;
    const params = getFileUrl(values);
    dispatch({
      type: 'listing/saveDraft',
      payload: {
        ...params,
      },
    }).then((res) => {
      const { success, code, data } = res || {};
      if (success && data && code === '200') {
        dispatch({
          type: 'listing/update',
          payload: {
            detail: { ...detail, ...params },
          },
        });
      }
    });
  };

  const handlePrev = () => {
    const values = form.getFieldsValue(true) || {};
    let params = {};
    if (!isEmpty(values)) {
      params = getFileUrl(values);
    }
    dispatch({
      type: 'listing/update',
      payload: {
        applyCurrentStep: 1,
        detail: { ...detail, ...params },
      },
    });
    window.scrollTo(0, 0);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const params = getFileUrl(values);
      dispatch({
        type: 'listing/applySubmit',
        payload: {
          ...detail,
          ...params,
        },
      }).then((res) => {
        const { success, data, code } = res || {};
        if (success && data && code === '200') {
          dispatch({
            type: 'listing/update',
            payload: {
              applyCurrentStep: 3,
              detail: { ...detail, ...params },
            },
          });
          window.scrollTo(0, 0);
        } else {
          message.error(_t('5e2cUmt2n2dXvfjhdSXEUH'));
        }
      });
    });
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const customLabel = useCallback((label, extraInfo) => {
    return (
      <LabelWrapper>
        <Label>{label}</Label>
        {extraInfo ? <ExtraInfo>{extraInfo}</ExtraInfo> : null}
      </LabelWrapper>
    );
  }, []);

  return (
    <>
      <StepTitle>{_t('oC2zppBKimuGB5NRJjAoJu')}</StepTitle>
      <FormStyle form={form}>
        <FormItem
          label={customLabel(
            _t('74FrTaGzkzaV5UzVoF3Mm7'),
            _tHTML('avv53ML7yhD2EPc72iDFKW', {
              url: 'https://docs.google.com/document/d/1vrdtxQB2JNa8VfT9G57Tv0gjTdywRVAn/edit?usp=sharing&ouid=115021248537152215509&rtpof=true&sd=true',
            }),
          )}
          name="dueDiligenceInfo"
          rules={[
            {
              required: true,
              message: _t('4wNcNHzYjMVVhaobd5FVmH'),
            },
            {
              validator: (_, val, cb) => {
                const fileStatus = map(val, (item) => item.status);
                if (fileStatus.includes('error')) {
                  cb(_t('vUs4q5cgqN2mzEJnDC7GRq'));
                  return;
                }
                cb();
              },
            },
          ]}
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <UploadCmpt
            accept=".doc,.docx"
            acceptType={[
              'application/msword', // doc
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
            ]}
            acceptTip={_t('assetsBack.form.errMsg5', { type: 'Word' })}
            fileSize={5}
            overSizeTip={_t('ozeCWDpb8t5oRjLRiEEfgb', { size: '5M' })}
            uploadTip={_t('8LU73bjU1vJs46E4HGgMgV', { type: 'Word', size: '5M' })}
            style={{ minWidth: uploadWidth, display: 'block' }}
          />
        </FormItem>
        <FormItem
          label={customLabel(_t('gABdQUHSDUG2nUPVUmg2AM'))}
          name="majorLegalEntity"
          rules={[
            {
              required: true,
              message: _t('4wNcNHzYjMVVhaobd5FVmH'),
            },
            {
              validator: (_, val, cb) => {
                const fileStatus = map(val, (item) => item.status);
                if (fileStatus.includes('error')) {
                  cb(_t('vUs4q5cgqN2mzEJnDC7GRq'));
                  return;
                }
                cb();
              },
            },
          ]}
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <UploadCmpt
            accept=".png,.jpg,.jpeg,.pdf"
            acceptType={['image/png', 'image/jpg', 'image/jpeg', 'application/pdf']}
            acceptTip={_t('assetsBack.form.errMsg5', { type: 'PNG、JPG、PDF' })}
            fileSize={5}
            overSizeTip={_t('ozeCWDpb8t5oRjLRiEEfgb', { size: '5M' })}
            uploadTip={_t('8LU73bjU1vJs46E4HGgMgV', { type: 'PNG、JPG、PDF', size: '5M' })}
            style={{ minWidth: uploadWidth, display: 'block' }}
          />
        </FormItem>
        <FormItem
          label={customLabel(
            _t('pwEKwvfrfD9Kh6BvmdkwRx'),
            _tHTML('wacJDT1ncV3CDNmngPhTbR', {
              url: 'https://drive.google.com/file/d/1QN9if-QVk_Tetd0ga6PX00eQYjLnqY53/view',
            }),
          )}
          name="legalOpinion"
          rules={[
            {
              required: true,
              message: _t('4wNcNHzYjMVVhaobd5FVmH'),
            },
            {
              validator: (_, val, cb) => {
                const fileStatus = map(val, (item) => item.status);
                if (fileStatus.includes('error')) {
                  cb(_t('vUs4q5cgqN2mzEJnDC7GRq'));
                  return;
                }
                cb();
              },
            },
          ]}
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <UploadCmpt
            accept=".png,.jpg,.jpeg,.pdf"
            acceptType={['image/png', 'image/jpg', 'image/jpeg', 'application/pdf']}
            acceptTip={_t('assetsBack.form.errMsg5', { type: 'PNG、JPG、PDF' })}
            fileSize={5}
            overSizeTip={_t('ozeCWDpb8t5oRjLRiEEfgb', { size: '5M' })}
            uploadTip={_t('8LU73bjU1vJs46E4HGgMgV', { type: 'PNG、JPG、PDF', size: '5M' })}
            style={{ minWidth: uploadWidth, display: 'block' }}
          />
        </FormItem>
        <FormItem
          label={customLabel(_t('qzs75E38yUjVS2RTBqAh1H'))}
          name="projectWhitePaper"
          rules={[
            { required: true, message: _t('4wNcNHzYjMVVhaobd5FVmH') },
            {
              validator: (_, val, cb) => {
                const fileStatus = map(val, (item) => item.status);
                if (fileStatus.includes('error')) {
                  cb(_t('vUs4q5cgqN2mzEJnDC7GRq'));
                  return;
                }
                cb();
              },
            },
          ]}
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <UploadCmpt
            accept=".pdf"
            acceptType={['application/pdf']}
            acceptTip={_t('assetsBack.form.errMsg5', { type: 'PDF' })}
            fileSize={5}
            overSizeTip={_t('ozeCWDpb8t5oRjLRiEEfgb', { size: '5M' })}
            uploadTip={_t('8LU73bjU1vJs46E4HGgMgV', { type: 'PDF', size: '5M' })}
            style={{ minWidth: uploadWidth, display: 'block' }}
          />
        </FormItem>
        <FormItem
          label={customLabel(
            _t('4bvv5wXTy9zyqTLEseTwkz'),
            _tHTML('wdkpc5nooLdkJ8kvgbbdxt', {
              url: 'https://drive.google.com/file/d/1JB3AQySshCRnQ74WnrbRf-XyixqWoPRW/view',
            }),
          )}
          name="signedVersion"
          rules={[
            {
              required: true,
              message: _t('4wNcNHzYjMVVhaobd5FVmH'),
            },
            {
              validator: (_, val, cb) => {
                const fileStatus = map(val, (item) => item.status);
                if (fileStatus.includes('error')) {
                  cb(_t('vUs4q5cgqN2mzEJnDC7GRq'));
                  return;
                }
                cb();
              },
            },
          ]}
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <UploadCmpt
            accept=".png,.jpg,.jpeg,.pdf"
            acceptType={['image/png', 'image/jpg', 'image/jpeg', 'application/pdf']}
            acceptTip={_t('assetsBack.form.errMsg5', { type: 'PNG、JPG、PDF' })}
            fileSize={5}
            overSizeTip={_t('ozeCWDpb8t5oRjLRiEEfgb', { size: '5M' })}
            uploadTip={_t('8LU73bjU1vJs46E4HGgMgV', { type: 'PNG、JPG、PDF', size: '5M' })}
            style={{ minWidth: uploadWidth, display: 'block' }}
          />
        </FormItem>
        <FormItem
          label={customLabel(
            _t('cXwjyNsuyzMAcmqaQPewWf'),
            _tHTML('6DbQTMJALV6Kr7ewkWZSfe', {
              url: 'https://drive.google.com/file/d/1iIIDdh_cL5kjvCAdv3tU1291HLsEYkck/view?usp=share_link',
            }),
          )}
          name="securityReviewReport"
          rules={[
            { required: true, message: _t('4wNcNHzYjMVVhaobd5FVmH') },
            {
              validator: (_, val, cb) => {
                const fileStatus = map(val, (item) => item.status);
                if (fileStatus.includes('error')) {
                  cb(_t('vUs4q5cgqN2mzEJnDC7GRq'));
                  return;
                }
                cb();
              },
            },
          ]}
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <UploadCmpt
            accept=".png,.jpg,.jpeg,.pdf"
            acceptType={['image/png', 'image/jpg', 'image/jpeg', 'application/pdf']}
            acceptTip={_t('assetsBack.form.errMsg5', { type: 'PNG、JPG、PDF' })}
            fileSize={5}
            overSizeTip={_t('ozeCWDpb8t5oRjLRiEEfgb', { size: '5M' })}
            uploadTip={_t('8LU73bjU1vJs46E4HGgMgV', { type: 'PNG、JPG、PDF', size: '5M' })}
            style={{ minWidth: uploadWidth, display: 'block' }}
          />
        </FormItem>
        <FormItem
          label={customLabel(_t('ic4hP5ge2tpVCo1jBfYQ7J'))}
          name="kycInformation"
          rules={[
            { required: true, message: _t('4wNcNHzYjMVVhaobd5FVmH') },
            {
              validator: (_, val, cb) => {
                const fileStatus = map(val, (item) => item.status);
                if (fileStatus.includes('error')) {
                  cb(_t('vUs4q5cgqN2mzEJnDC7GRq'));
                  return;
                }
                if (val && val.length < 3) {
                  cb(_t('nLKCzhnvnzoLuajU1tiMRY', { num: 3 }));
                  return;
                }
                if (val && val.length > 5) {
                  cb(_t('91xXw22xZhCYxYVeDdhx4i', { num: 5 }));
                  return;
                }
                cb();
              },
            },
          ]}
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <UploadCmpt
            accept=".png,.jpg,.jpeg,.pdf"
            acceptType={['image/png', 'image/jpg', 'image/jpeg', 'application/pdf']}
            acceptTip={_t('assetsBack.form.errMsg5', { type: 'PNG、JPG、PDF' })}
            fileSize={5}
            overSizeTip={_t('ozeCWDpb8t5oRjLRiEEfgb', { size: '5M' })}
            uploadTip={_t('8LU73bjU1vJs46E4HGgMgV', { type: 'PNG、JPG、PDF', size: '5M' })}
            multipleFiles
            style={{ minWidth: uploadWidth, display: 'block' }}
          />
        </FormItem>
        <FormItem
          label={customLabel(_t('nJWfwLhZuHrMssPDQSHbkg'))}
          name="remark"
          rules={[
            {
              validator: (_, val, cb) => {
                if (val && val.length > 200) {
                  cb(_t('vZzscjbsChQYY3DVxq7F7S', { num: 200 }));
                  return;
                }
                cb();
              },
            },
          ]}
        >
          <Input placeholder={_t('bTo6uFEz432SLtKsnXG5QB')} size="large" />
        </FormItem>
        <MarginTop />
        <FormItem
          name="readAndAgree"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value, cb) => {
                if (!value) {
                  cb(_t('hrSfPDGPQ2BMjukNxv3yLa'));
                  return;
                }
                cb();
              },
            },
          ]}
        >
          <Checkbox>
            <ReadText>{_t('goLJKkrkVr4mA3dyodh62A')}</ReadText>
          </Checkbox>
        </FormItem>
      </FormStyle>
      <BtnGroup>
        <SubmitButton size="large" variant="outlined" onClick={handlePrev}>
          {_t('fiat.last.step')}
        </SubmitButton>
        <SubmitButton size="large" loading={loading} disabled={btnDisable} onClick={handleSubmit}>
          {_t('submit')}
        </SubmitButton>
      </BtnGroup>
    </>
  );
}

export default StepThree;
