/**
 * Owner: willen@kupotech.com
 */
import JsBridge from 'gbiz-next/bridge';
import { useLocale } from 'hooks/useLocale';
import { BaseDialog } from 'gbiz-next/userRestricted';
import { styled, useTheme } from '@kux/mui';
import { SECURITY_EXPIRED } from 'codes';
import SecurityForm from 'components/Account/Api/SecurityForm';
import { withRouter } from 'components/Router';
import { message } from 'components/Toast';
import { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import Back from 'src/components/common/Back';
import { _t } from 'tools/i18n';
import { useRouter } from 'kc-next/router';
import AccountLayout from '@/components/AccountLayout';
import CreateSuccess from '../../../components/Account/Api/CreateSuccess';

const CreateApi = styled.div`
  padding: ${({ isInApp }) => (isInApp ? '0 16px 16px 16px' : ' 26px 16px 16px 16px')};
  a {
    color: ${(props) => props.theme.colors.text60};
  }
`;

const Wrapper = styled.div`
  max-width: 480px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  position: relative;
  display: flex;
  justify-content: left;
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
  font-size: 36px;
  line-height: 44px;
  margin: 40px auto;
  max-width: 480px;
  text-align: left;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 24px;
    line-height: 130%;
  }
`;

const SecurityFormWrapper = styled.div`
  max-width: 480px;
  margin: 0 auto;

  .security_form {
    margin-top: 40px;

    [dir='rtl'] & {
      .KuxCol-col {
        text-align: right;
      }
    }
  }
`;

const SecurityValidation = ({
  dispatch,
  addData,
  createSuccessVisible,
  verifyData: { verifyType, bizType },
  isKycDialogVisible,
}) => {
  const router = useRouter();
  useLocale();
  const theme = useTheme();
  const [secVerifyType, setSecVerifyType] = useState(verifyType);
  const remainAddRef = useRef(false);

  // 获取校验类型
  const getVerifyType = async () => {
    const _verifyType = await dispatch({
      type: 'security_new/get_verify_type',
      payload: { bizType },
    });
    return _verifyType;
  };

  // 处理提交数据
  const handleSubmitData = () => {
    const obj = { ...addData };
    const _authGroupMap = {};
    obj.authGroupMap.forEach((key) => {
      _authGroupMap[key] = true;
    });
    obj.authGroupMap = JSON.stringify(_authGroupMap);
    return obj;
  };

  // 创建提交
  const submitCreate = async (extra) => {
    const data = handleSubmitData();
    const { code } = await dispatch({
      type: 'api_key/createApi',
      payload: { ...data, extra },
    });
    if (code === '500001') {
      // 用useState则无法在销毁时拿到最新的值
      remainAddRef.current = true;
      router?.replace('/account/api/create');
    } else if (code === '500000') {
      router?.replace('/account/api');
    }
  };

  // 点击验证
  const handleOk = async (payload) => {
    const {
      success,
      code,
      msg,
      data = [],
    } = await dispatch({
      type: 'security_new/sec_verify',
      payload,
    });
    if (!success) {
      message.error(msg);
      if (code === SECURITY_EXPIRED) {
        const _verifyType = await getVerifyType();
        // const _verifyType = [['withdraw_password', 'google_2fa'], ['withdraw_password', 'my_sms']];
        setSecVerifyType(_verifyType);
      }
      return false;
    }
    const { extra = '' } = data[0] || {};
    submitCreate(extra);
  };

  // 如果刷新页面，将跳转至列表
  useEffect(() => {
    const { apiName } = addData;
    if (!apiName || !verifyType || !verifyType.length) {
      router?.replace('/account/api');
    }
  }, []);

  useEffect(() => {
    return () => {
      if (!remainAddRef.current) dispatch({ type: 'api_key/cacheAddData', payload: {} });
      dispatch({
        type: 'api_key/cacheVerifyData',
        payload: { verifyData: { verifyType: [], bizType: null } },
      });
    };
  }, []);

  const isInApp = JsBridge.isApp();

  return (
    <AccountLayout>
      <CreateApi isInApp={isInApp} data-inspector="api_create_security_page">
        {!isInApp && (
          <Wrapper>
            <Back onClick={() => router?.push('/account/api')} />
          </Wrapper>
        )}
        <PageTitle>{_t('security.verify')}</PageTitle>
        <SecurityFormWrapper>
          <SecurityForm
            className="security_form"
            onOk={handleOk}
            verifyType={secVerifyType}
            bizType={bizType}
            okText={_t('margin.lend.confirm.ok')}
          />
          <CreateSuccess visible={createSuccessVisible} successUrl="/account/api" />
        </SecurityFormWrapper>
        <BaseDialog
          theme={theme?.currentTheme}
          onOk={() => {
            router?.replace('/account/kyc');
          }}
          onCancel={() => {
            dispatch({
              type: 'api_key/update',
              payload: { isKycDialogVisible: false },
            });
          }}
          visible={isKycDialogVisible}
          title={_t('withdraw.kyc.limit.title')}
          content={_t('aFwLcveb4nJggr7AYamqor')}
          buttonAgree={_t('withdraw.v2.kyc.btn')}
          buttonRefuse={_t('poolx.ac.modal.cancel')}
        />
      </CreateApi>
    </AccountLayout>
  );
};

export default withRouter()(
  connect(({ api_key }) => ({
    addData: api_key.addData,
    verifyData: api_key.verifyData,
    isKycDialogVisible: api_key.isKycDialogVisible,
  }))(SecurityValidation),
);
