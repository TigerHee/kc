/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from 'components/LoadLocale';
import { BaseDialog } from 'gbiz-next/userRestricted';
import { Box, css, styled, useSnackbar, useTheme } from '@kux/mui';
import { SECURITY_EXPIRED } from 'codes';
import SecurityForm from 'components/Account/Api/SecurityForm';
import { withRouter } from 'components/Router';
import { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import KcBreadCrumbs from 'src/components/KcBreadCrumbs';
import { _t } from 'tools/i18n';
import CreateSuccess from '../../../components/Account/Api/CreateSuccess';
import { useRouter } from 'kc-next/router';
import { push, replace } from '@/utils/router';
import AccountSubLayout from '@/components/AccountSubLayout';
import ErrorBoundary, { SCENE_MAP } from '@/components/common/ErrorBoundary';

import useResponsiveSSR from '@/hooks/useResponsiveSSR';

const StyledTitle = styled.h1`
  color: ${(props) => props.theme.colors.text};
  font-size: 36px;
  font-style: normal;
  font-weight: 600;
  padding: 0;
  margin: 0;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 24px;
  }
`;

const Security = styled.div`
  max-width: 480px;
  margin: 0 auto;
`;

const SecurityFormWrapper = css`
  margin-top: 40px;
`;

const SecurityValidation = ({
  dispatch,
  addData,
  createSuccessVisible,
  verifyData: { verifyType, bizType },
  query,
  isKycDialogVisible,
}) => {
  const { sub } = query;
  const theme = useTheme();
  const responsive = useResponsiveSSR();
  const isH5 = !responsive.sm;
  const [secVerifyType, setSecVerifyType] = useState(verifyType);
  const remainAddRef = useRef(false);
  const { message } = useSnackbar();
  const router = useRouter();

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
      payload: { ...data, extra, bizType, subName: sub },
    });
    if (code === '500001') {
      // 用useState则无法在销毁时拿到最新的值
      remainAddRef.current = true;
      replace(`/account-sub/api-manager/create/${sub}`);
    } else if (code === '500000') {
      replace(`/account-sub/api-manager/${sub}`);
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
      replace(`/account-sub/api-manager/${sub}`);
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

  return (
    <Security data-inspector="api_manager_create_security_page">
      <KcBreadCrumbs
        breadCrumbs={[
          { label: _t('security.verify'), url: `/account-sub/api-manager/${sub}` },
          { label: _t('api.create') },
        ]}
      />
      <Box style={{ height: isH5 ? '24px' : '52px' }} />
      <StyledTitle>{_t('api.create')}</StyledTitle>
      <SecurityForm
        css={SecurityFormWrapper}
        onOk={handleOk}
        verifyType={secVerifyType}
        bizType={bizType}
        okText={_t('margin.lend.confirm.ok')}
      />
      <CreateSuccess
        visible={createSuccessVisible}
        successUrl={`/account-sub/api-manager/${sub}`}
      />
      <BaseDialog
        theme={theme?.currentTheme}
        onOk={() => {
          replace('/account/kyc');
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
    </Security>
  );
};

const SecurityValidationWithLayout = (props) => {
  return (
    <ErrorBoundary scene={SCENE_MAP.subAccount.api_create_security}>
      <AccountSubLayout>
        <SecurityValidation {...props} />
      </AccountSubLayout>
    </ErrorBoundary>
  );
};

export default withRouter()(
  connect(({ api_key }) => ({
    addData: api_key.addData,
    verifyData: api_key.verifyData,
    isKycDialogVisible: api_key.isKycDialogVisible,
  }))(injectLocale(SecurityValidationWithLayout)),
);
