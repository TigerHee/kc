/**
 * Owner: willen@kupotech.com
 */
import JsBridge from 'gbiz-next/bridge';
import { useLocale } from 'hooks/useLocale';
import { styled, useSnackbar } from '@kux/mui';
import { SECURITY_EXPIRED } from 'codes';
import SecurityForm from 'components/Account/Api/SecurityForm';
import { withRouter } from 'components/Router';
import { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Back from 'src/components/common/Back';
import { _t } from 'tools/i18n';
import { useRouter } from 'kc-next/router';
import AccountLayout from '@/components/AccountLayout';
import CreateSuccess from '../../../components/Account/Api/CreateSuccess';

const Wrapper = styled.div`
  max-width: 480px;
  margin: 0 auto;
`;

const EditApi = styled.div`
  padding: ${({ isInApp }) => (isInApp ? '0px 16px 16px 16px' : '26px 16px 16px 16px')};
  a {
    color: ${(props) => props.theme.colors.text60};
  }
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

const Security = styled.div`
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
  createSuccessVisible,
  verifyData: { verifyType, bizType: _bizType },
  query,
}) => {
  const router = useRouter();
  useLocale();
  const { apiKey, bizType: queryBizType } = query;
  // 换皮兼容 _bizType 是URL里的, model 没有就取一下url里的;
  const bizType = _bizType || queryBizType;
  const [secVerifyType, setSecVerifyType] = useState(verifyType);
  const { message } = useSnackbar();

  // 获取校验类型
  const getVerifyType = useCallback(async () => {
    const _verifyType = await dispatch({
      type: 'security_new/get_verify_type',
      payload: { bizType },
    });
    return _verifyType;
  }, [bizType]);

  // 去编辑
  const goEdit = async () => {
    await dispatch({
      type: 'api_key/getApiDetail',
      payload: { apiKey },
    });
    const url = `/account/api/edit?apiKey=${apiKey}`;
    router?.replace(url);
  };

  // 点击验证
  const handleOk = async (payload) => {
    const { success, code, msg } = await dispatch({
      type: 'security_new/sec_verify',
      payload,
    });
    if (!success) {
      message.error(msg);
      if (code === SECURITY_EXPIRED) {
        const _verifyType = await getVerifyType();
        setSecVerifyType(_verifyType);
      }
      return false;
    }
    goEdit();
  };

  // 如果刷新页面，将跳转至列表
  useEffect(() => {
    // 取了一次VerifyType接口，迁移内页后可去掉
    const _getVerifyType = async () => {
      const _verifyType = await getVerifyType(_bizType);
      setSecVerifyType(_verifyType);
      if (!_verifyType || !_verifyType.length) {
        router?.replace('/account/api');
      }
    };
    _getVerifyType();
  }, [_bizType, getVerifyType]);

  useEffect(() => {
    return () => {
      dispatch({
        type: 'api_key/cacheVerifyData',
        payload: { verifyData: { verifyType: [], bizType: null } },
      });
    };
  }, []);

  const isInApp = JsBridge.isApp();

  return (
    <AccountLayout>
      <EditApi isInApp={isInApp} data-inspector="api_edit_presecurity_page">
        {!isInApp && (
          <Wrapper>
            <Back onClick={() => router?.push('/account/api')} />
          </Wrapper>
        )}
        <PageTitle>{_t('security.verify')}</PageTitle>
        <Security>
          <SecurityForm
            className="security_form"
            onOk={handleOk}
            verifyType={secVerifyType}
            bizType={bizType}
            okText={_t('next')}
          />
          <CreateSuccess visible={createSuccessVisible} successUrl="/account/api" />
        </Security>
      </EditApi>
    </AccountLayout>
  );
};

export default withRouter()(
  connect(({ api_key }) => ({
    verifyData: api_key.verifyData,
  }))(SecurityValidation),
);
