/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from 'components/LoadLocale';
import { css, styled, useSnackbar } from '@kux/mui';
import { SECURITY_EXPIRED } from 'codes';
import SecurityForm from 'components/Account/Api/SecurityForm';
import { withRouter } from 'components/Router';
import { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import Back from 'src/components/common/Back';
import KcBreadCrumbs from 'src/components/KcBreadCrumbs';
import { _t } from 'tools/i18n';
import AccountSubLayout from '@/components/AccountSubLayout';
import { push, replace } from '@/utils/router';
import ErrorBoundary, { SCENE_MAP } from '@/components/common/ErrorBoundary';

const Security = styled.div`
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

const Wrapper = styled.div`
  max-width: 480px;
  margin: 0 auto;
`;

const SecurityFormWrapper = css`
  margin-top: 40px;
`;

const SecurityValidation = ({ dispatch, verifyData: { verifyType, bizType }, query }) => {
  const { apiKey, sub, leadTrade } = query;
  const [secVerifyType, setSecVerifyType] = useState(verifyType);
  const { message } = useSnackbar();

  // 获取校验类型
  const getVerifyType = async () => {
    const _verifyType = await dispatch({
      type: 'security_new/get_verify_type',
      payload: { bizType },
    });
    return _verifyType;
  };

  // 去编辑
  const goEdit = async () => {
    await dispatch({
      type: 'api_key/getApiDetail',
      payload: { subName: sub, apiKey },
    });
    const url = `/account-sub/api-manager/edit/${sub}?apiKey=${apiKey}${
      leadTrade ? '&leadTrade=1' : ''
    }`;
    replace(url);
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

  const backUrl = useMemo(
    () => (leadTrade ? '/account/api' : `/account-sub/api-manager/${sub}`),
    [sub, leadTrade],
  );

  // 如果刷新页面，将跳转至列表
  useEffect(() => {
    if (!verifyType || !verifyType.length) {
      replace(backUrl);
    }
  }, [verifyType, backUrl]);

  useEffect(() => {
    return () => {
      dispatch({
        type: 'api_key/cacheVerifyData',
        payload: { verifyData: { verifyType: [], bizType: null } },
      });
    };
  }, []);

  return (
    <div data-inspector="api_manager_edit_presecurity_page">
      <Wrapper>
        {leadTrade ? (
          <Back onClick={() => push(backUrl)} />
        ) : (
          <KcBreadCrumbs
            breadCrumbs={[
              { label: _t('subaccount.subaccount'), url: '/account/sub' },
              { label: _t('api.edit.title'), url: backUrl },
              { label: _t('security.verify') },
            ]}
          />
        )}
      </Wrapper>
      <PageTitle>{_t('security.verify')}</PageTitle>
      <Security>
        <SecurityForm
          css={SecurityFormWrapper}
          onOk={handleOk}
          verifyType={secVerifyType}
          bizType={bizType}
          okText={_t('next')}
        />
      </Security>
    </div>
  );
};

const SecurityValidationWithLayout = (props) => {
  return (
    <ErrorBoundary scene={SCENE_MAP.subAccount.api_edit_presecurity}>
      <AccountSubLayout>
        <SecurityValidation {...props} />
      </AccountSubLayout>
    </ErrorBoundary>
  );
};

export default withRouter()(
  connect(({ api_key }) => ({
    verifyData: api_key.verifyData,
  }))(injectLocale(SecurityValidationWithLayout)),
);
