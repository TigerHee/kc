import { Spin, useSnackbar } from '@kux/mui';
import withRouter from '@/components/Router/withRouter';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getIdentityTypes, getSumsubDelete } from 'services/kyc';
import OcrSupplier from '@/components/Account/Kyc/OcrSupplier';
import Back from '@/routers/AccountPage/Kyc/components/Back';
import { kcsensorsManualExpose, trackClick } from '@/tools/ga';
import KycRetain from '../../components/KycRetain';
import replaceWithBackUrl from '../../utils/replaceWithBackUrl';
import OcrRemind from './OcrRemind';
import { Container, SupplierWrapper, Wrapper } from './styled';
import AccountLayout from '@/components/AccountLayout';
import { _t } from 'tools/i18n';
import ErrorBoundary, { SCENE_MAP } from '@/components/common/ErrorBoundary';

const OcrPage = withRouter()(({ query }) => {
  const { message } = useSnackbar();
  const dispatch = useDispatch();
  const kycInfo = useSelector((state) => state.kyc.kycInfo);
  const ocr = useSelector((state) => state.kyc.ocr);
  const { identityType, regionCode } = kycInfo;

  // ocr 路由
  const [currentRoute, setCurrentRoute] = useState('');
  // 页面loading
  const [isPageLoading, setPageLoading] = useState(true);
  // 继续按钮loading
  const [isBtnLoading, setBtnLoading] = useState(false);
  // 是否展示供应商页面
  const [isShowSupplier, setShowSupplier] = useState(false);
  // 是否本地化认证流程
  const [isNonDoc, setNonDoc] = useState(false);
  // 证件类型列表
  const [commonIdentityTypeList, setCommonIdentityTypeList] = useState([]);

  useEffect(() => {
    dispatch({
      type: 'kyc/pullKycInfo',
    });
  }, []);

  useEffect(() => {
    if (regionCode) {
      const checkIdentityType = async () => {
        const res = await getIdentityTypes({ region: regionCode });
        setCommonIdentityTypeList(res?.data?.commonIdentityTypeList || []);
        // 是本地化认证流程
        if (res?.data?.localIdentityTypeList?.find((i) => i.type === identityType)) {
          setNonDoc(true);
        } else {
          setNonDoc(false);
        }
        setPageLoading(false);
      };
      checkIdentityType();
    }
  }, [regionCode, identityType]);

  // 曝光
  useEffect(() => {
    if (!isPageLoading) {
      kcsensorsManualExpose([isNonDoc ? 'verifyGuidePageNonDoc' : 'verifyGuidePage', '1'], {
        type: identityType,
      });
    }
  }, [isPageLoading, isNonDoc, identityType]);

  // 调用 chanel
  const onClickVerify = async () => {
    trackClick([isNonDoc ? 'verifyGuidePageNonDoc' : 'verifyGuidePage', 'continueButton'], {
      type: identityType,
    });

    setBtnLoading(true);
    const { data, success, code, msg } = await dispatch({ type: 'kyc/checkKycRisk', payload: {} });

    if (data && success) {
      //获取kyc3渠道
      const data = await dispatch({
        type: 'kyc/getKyc2Channel',
        payload: { biz: 'DEFAULT' },
      });
      if (!data?.channel) {
        data.msg && message.error(data.msg);
        setBtnLoading(false);
        return;
      }
      const { channel, ekycflowId } = data;
      dispatch({
        type: 'kyc/update',
        payload: {
          // 先把 channel 和 kycId 存起来，但不启用查询
          ocr: { query: false, channel, ekycflowId },
        },
      });
      if (channel === 'JUMIO') {
        // jumio
        setCurrentRoute('jumio');
      } else if (channel === 'SUMSUB') {
        // sumsub
        try {
          await getSumsubDelete();
        } catch (error) {
          console.error(error);
        }
        setCurrentRoute('SUMSUB');
      } else {
        //兜底lego
        setCurrentRoute('legoIndex');
        dispatch({
          type: 'kyc/update',
          payload: {
            legoCameraStep: '',
            showCamera: false,
            legoPhotos: {},
            photoType: 'front',
          },
        });
      }
      setShowSupplier(true);
      setPageLoading(false);
    } else {
      //风控未通过
      message.error(code === '710015' ? _t('ukZa2Rk7VMcJeL3NreTxjc') : msg);
    }
    setBtnLoading(false);
  };

  // OCR 成功回调
  const onSupplierCallback = async (isSuccess) => {
    // 认证成功
    if (isSuccess) {
      dispatch({
        type: 'kyc/update',
        payload: {
          // 把 kyc 认证结果清空，避免在下次请求之前浏览到上次的状态
          kycInfo: {},
          // 认证完成后，非本地化认证跳转结果页需要查询 ocr 结果
          ocr: { ...ocr, query: !isNonDoc },
        },
      });
      replaceWithBackUrl('/account/kyc/home', query.backUrl);
    } else {
      message.info(_t('selfService2.verify.fail.des2'));
      setShowSupplier(false);
    }
  };

  // 返回
  const onBack = () => {
    replaceWithBackUrl('/account/kyc/setup/method', query.backUrl);
  };

  return (
    <Spin spinning={isPageLoading} size="small">
      <Container>
        {isShowSupplier ? (
          <SupplierWrapper>
            <Back
              onBack={() => {
                setShowSupplier(false);
              }}
            />
            <section className="supplierContent">
              <OcrSupplier
                onOk={setCurrentRoute}
                currentRoute={currentRoute}
                onSupplierCallback={onSupplierCallback}
                onCancel={() => setShowSupplier(false)}
              />
            </section>
          </SupplierWrapper>
        ) : (
          <Wrapper>
            <Back onBack={onBack} />
            {isPageLoading ? null : (
              <OcrRemind
                isBtnLoading={isBtnLoading}
                onClickVerify={onClickVerify}
                isNonDoc={isNonDoc}
                commonIdentityTypeList={commonIdentityTypeList}
              />
            )}
          </Wrapper>
        )}
      </Container>
      <KycRetain />
    </Spin>
  );
});

export default () => {
  return (
    <ErrorBoundary scene={SCENE_MAP.kyc.kyc_setup_ocr}>
      <AccountLayout>
        <OcrPage />
      </AccountLayout>
    </ErrorBoundary>
  );
};
