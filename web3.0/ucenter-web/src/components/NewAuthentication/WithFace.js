/**
 * Owner: lori@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { Box, Button, Form, Spin, useResponsive, useSnackbar } from '@kux/mui';
import { SUPPORT_ADVANCE_FACE } from 'config/base';
import { isIOS } from 'helper';
import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAdvanceToken } from 'services/kyc';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import compareVersion from 'utils/compareVersion';
import { trackClick } from 'utils/ga';
import ImgGuide1 from './ImgGuide1';
import { NeededItemsPrefix0, Title, TitleWrapper } from './ImgGuide1/styled';
import ImgGuide2 from './ImgGuide2';
import ScanResult from './ScanResult';
import { DesInApp, FormItemTitle, IdentityForm, Kyc2InApp, Loading } from './styled';
import UploadItem from './UploadItem';

const { FormItem, useForm } = Form;

// 人脸验证接口不通过, 返回重试的code
const FACE_FAIL_CODES = {
  2022501: _t('selfService2.faceVerify.fail1'),
  2022503: _t('selfService2.faceVerify.fail2'),
  2022505: _t('selfService2.faceVerify.fail3'),
  200: _t('selfService2.faceVerify.fail3'),
};

export default (props) => {
  const [form] = useForm();
  const rv = useResponsive();
  const isH5 = !rv?.sm;
  const isInApp = JsBridge.isApp();
  const dispatch = useDispatch();
  const { message } = useSnackbar();
  const { namespace, onSubmit, bizType } = props;
  const { kycInfo, kycCode } = useSelector((state) => state.kyc);
  const appVersion = useSelector((state) => state.app.appVersion);
  const { configs = {} } = useSelector((state) => state[namespace]);

  // 大于该版本使用 advance 人脸服务
  const isUseAdvanceVersion = useMemo(
    () => isInApp && compareVersion(appVersion, SUPPORT_ADVANCE_FACE) >= 0,
    [appVersion, isInApp],
  );

  // 人脸识别服务是否可用
  const isAvailable = configs[`${isIOS() ? 'IOS' : 'ANDROID'}_FACE_MATCH`]?.isOpen;
  // 最大SDK失败次数,默认次数为3
  const MAX_SDK_TIMES = configs[`${isIOS() ? 'IOS' : 'ANDROID'}_FACE_MATCH`]?.maxRetries || 3;
  // 人脸验证最大重试次数（接口返回的比对结果三次都不通过）
  const MAX_CHECK_TIMES = configs?.IDENTITY_FAIL?.maxRetries || 3;
  const isKYC2 = kycInfo?.verifyStatus === 1;
  // 身份验证结果
  const [result, setResult] = useState({ show: false, failReason: '' });
  // SDK重试次数 等于 MAX_SDK_TIMES 时走到上传手持身份证逻辑
  const [retrySDKTimes, setRetrySDKTimes] = useState(0);
  // 加载调用人脸识别SDK
  const [loadingSDK, setLoadingSDK] = useState();
  const loading = useSelector((state) => {
    return (
      state.loading.effects[`${namespace}/checkFacePic`] || state.loading.effects['kyc/pullKycInfo']
    );
  });

  const loadingSubmit = useSelector((state) => state.loading.effects[`${namespace}/submit`]);

  // 获取用户KYC等级
  useEffect(() => {
    dispatch({ type: `${namespace}/pullConfig` });
    dispatch({ type: 'kyc/pullKycInfo' });
    dispatch({ type: 'kyc/getKycCode' });
  }, [namespace]);

  // 人脸识别服务不可用直接走上传手持
  useEffect(() => {
    if (isAvailable === false) {
      setRetrySDKTimes(MAX_SDK_TIMES);
    }
  }, [isAvailable, MAX_SDK_TIMES]);

  // 下架了百度人脸，如果低于 3.117直接走手持
  useEffect(() => {
    if (!isUseAdvanceVersion) {
      setRetrySDKTimes(MAX_SDK_TIMES);
    }
  }, [isUseAdvanceVersion, MAX_SDK_TIMES]);

  // 进入的埋点
  useEffect(() => {
    if (isKYC2 !== undefined) {
      if (!isKYC2 && !isInApp) {
        trackClick(['Identify1', '1']);
      }
      if (!isKYC2 && isInApp) {
        trackClick(['Identify2', '1']);
      }
      if (isKYC2 && !isInApp) {
        trackClick(['Identify3', '1']);
      }
      if (isKYC2 && isInApp) {
        trackClick(['Identify4', '1']);
      }
    }
  }, [isKYC2, isInApp]);

  // 提交: 如果是没有通过高级认证且在APP中，下一步进入人脸识别
  const handleSubmit = debounce(
    () => {
      form
        .validateFields()
        .then(() => {
          if (!isKYC2 && isInApp && retrySDKTimes < MAX_SDK_TIMES) {
            trackClick(['Identify21', '1']);
            handleToScan();
            return;
          }
          trackClick([isKYC2 ? 'Identify31' : 'Identify11', '1']);
          onSubmit();
        })
        .catch((err) => {
          console.log(err);
          message.error(_t('selfService.auth.error'));
        });
    },
    1000,
    { leading: true, trailing: false },
  );

  // 进入APP人脸识别功能
  const handleToScan = debounce(
    async () => {
      if (isKYC2) {
        trackClick(['Identify41', '1']);
      }
      setLoadingSDK(true);

      if (isUseAdvanceVersion) {
        try {
          const livenessData = await getAdvanceToken();
          const advanceToken = livenessData?.data?.advanceConfig?.license;
          if (advanceToken) {
            JsBridge.open(
              {
                type: 'func',
                params: {
                  name: 'faceRecognition',
                  channel: 'advance',
                  advanceToken,
                },
              },
              (res) => {
                setLoadingSDK(false);
                const { data, code } = res || {};
                const advanceLivenessId = data?.advanceLivenessId;
                // code: 0成功拿到人脸识别照， -1失败
                if (code === 0) {
                  checkFacePic({ advanceLivenessId });
                }
                // SDK内部调用人脸服务失败，3次后走上传手持身份证逻辑
                if (code === -1) {
                  setRetrySDKTimes(retrySDKTimes + 1);
                  message.error(
                    retrySDKTimes + 1 < MAX_SDK_TIMES
                      ? _t('selfService2.verify.fail.des2')
                      : _t('selfService2.verify.faceFail'),
                  );
                }
              },
            );
          } else {
            setLoadingSDK(false);
            message.error(_t('qrnvBWNg6XyWgLmS8a5Dy2'));
          }
        } catch (error) {
          setLoadingSDK(false);
          console.error('error === ', error);
        }
      } else {
        // 下线百度人脸服务，不支持 advance 的版本进入到手持身份证
        setRetrySDKTimes(MAX_SDK_TIMES);
        setLoadingSDK(false);
      }
    },
    1000,
    { leading: true, trailing: false },
  );

  // 人脸和证件比对
  const checkFacePic = ({ advanceLivenessId }) => {
    const payloadData = {
      livenessChannel: 'ADVANCE',
      app: isIOS() ? 'ios' : 'android',
      bizType,
      advanceLivenessId,
    };

    dispatch({
      type: `${namespace}/checkFacePic`,
      payload: payloadData,
      callBack: (response) => {
        const { result, code } = response;
        const failTimes = response.failTimes || 0;
        // 人脸比对成功-》身份认证通过
        if (result) {
          setResult({ show: true, failReason: '', isRetry: false });
          // 人脸比对不成功-> 特定情况需要重试
        } else if (Object.keys(FACE_FAIL_CODES).includes(code)) {
          setResult({
            show: true,
            failReason: FACE_FAIL_CODES[code],
            isRetry: failTimes < MAX_CHECK_TIMES,
          });
          // 人脸比对不成功-> 其他失败，3次后和SDK失败一样上传手持
        } else {
          setRetrySDKTimes(retrySDKTimes + 1);
          message.error(
            retrySDKTimes + 1 < MAX_SDK_TIMES
              ? _t('selfService2.verify.fail.des2')
              : _t('selfService2.verify.faceFail'),
          );
        }
      },
    });
  };

  // 点击身份验证，重试或提交
  const handleResultClick = () => {
    if (result.isRetry) {
      setResult({ show: false, failReason: '', isRetry: false });
    } else {
      onSubmit();
    }
  };

  let needHandPic = true;
  let needFrontBackPic = true;
  // 初级认证且在app端且重试SDK不满3次, 不需要手持证件照
  if (!isKYC2 && isInApp && retrySDKTimes < MAX_SDK_TIMES) {
    needHandPic = false;
  }

  // 高级认证且在app端，且重试SDK3次，仅需要手持证件照
  if (isKYC2 && isInApp && retrySDKTimes >= MAX_SDK_TIMES) {
    needFrontBackPic = false;
  }

  if (loading) {
    return (
      <Loading>
        <Spin />
      </Loading>
    );
  }

  if (result.show) {
    return (
      <ScanResult
        onSubmit={handleResultClick}
        result={result}
        loading={loadingSubmit || loadingSDK}
      />
    );
  }

  // 如果是高级认证且在app中--》直接人脸认证
  if (isKYC2 && isInApp && retrySDKTimes < MAX_SDK_TIMES) {
    return (
      <Kyc2InApp>
        <DesInApp>{_t('selfService2.APPCertificate.inAppDes')}</DesInApp>
        <Button onClick={handleToScan} fullWidth={true} loading={loadingSDK}>
          {_t('selfService2.APPCertificate.inAppBtn')}
        </Button>
      </Kyc2InApp>
    );
  }

  return (
    <IdentityForm form={form}>
      {props.prompt}
      {needFrontBackPic && (
        <>
          <TitleWrapper>
            <NeededItemsPrefix0>*</NeededItemsPrefix0>
            <Title style={{ fontSize: isH5 ? '18px' : '20px', fontWeight: 600 }}>
              {_t('kyc.form.uploadPhotos')}
            </Title>
          </TitleWrapper>
          <Box style={{ height: '20px' }} />
          <FormItemTitle>{_t('kyc.form.frontPhoto')}</FormItemTitle>
          <UploadItem id="frontPic" namespace={namespace} />
          <Box style={{ height: '4px' }} />
          <FormItemTitle>{_t('kyc.form.backPhoto')}</FormItemTitle>
          <UploadItem id="backPic" namespace={namespace} />
          <Box style={{ height: '4px' }} />
          <FormItemTitle>{_t('authentication.handlePic.label3')}</FormItemTitle>
          <ImgGuide1 />
        </>
      )}
      {needHandPic && (
        <>
          <Box style={{ height: isH5 ? '40px' : '64px' }} />
          <TitleWrapper>
            <NeededItemsPrefix0>*</NeededItemsPrefix0>
            <Title style={{ fontSize: isH5 ? '18px' : '20px', fontWeight: 600 }}>
              {_t('selfService.auth.guide2')}
            </Title>
          </TitleWrapper>
          <Box style={{ height: '20px' }} />
          {!isH5 && <FormItemTitle>{_t('selfService.auth.guide2')}</FormItemTitle>}
          <UploadItem id="handPic" namespace={namespace} />
          <ImgGuide2 kycCode={kycCode} />
        </>
      )}
      <Box style={{ height: isH5 ? '40px' : '64px' }} />
      <FormItem>
        <Button
          size="large"
          onClick={handleSubmit}
          loading={loadingSubmit || loadingSDK}
          fullWidth={true}
        >
          {needFrontBackPic && !needHandPic
            ? _t('selfService2.APPCertificate.inAppBtn')
            : _t('submit')}
        </Button>
      </FormItem>
    </IdentityForm>
  );
};
