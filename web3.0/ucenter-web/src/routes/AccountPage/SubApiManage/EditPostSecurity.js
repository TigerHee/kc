/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from '@kucoin-base/i18n';
import { css, styled, useSnackbar } from '@kux/mui';
import { SECURITY_EXPIRED } from 'codes';
import SecurityForm from 'components/Account/Api/SecurityForm';
import { withRouter } from 'components/Router';
import { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import Back from 'src/components/common/Back';
import KcBreadCrumbs from 'src/components/KcBreadCrumbs';
import { _t } from 'tools/i18n';
import { push, replace } from 'utils/router';

const Security = styled.div`
  max-width: 480px;
  margin: 0 auto;
`;

const SecurityFormWrapper = css`
  margin-top: 40px;
`;

const SecurityValidation = ({ dispatch, verifyData: { verifyType, bizType }, editData, query }) => {
  const { sub, leadTrade } = query;
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

  // 提交编辑
  const submitEdit = () => {
    dispatch({
      type: 'api_key/updateApi',
      payload: {
        ...editData,
        isLeadTradeApi: !!leadTrade,
      },
    });
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
    submitEdit();
  };

  const backUrl = useMemo(
    () => (leadTrade ? '/account/api' : `/account-sub/api-manager/${sub}`),
    [sub, leadTrade],
  );

  // 如果刷新页面，将跳转至列表
  useEffect(() => {
    if (!editData.apiName || !verifyType || !verifyType.length) {
      replace(backUrl);
    }
  }, [verifyType, backUrl]);

  useEffect(() => {
    return () => {
      dispatch({ type: 'api_key/update', payload: { editData: { authGroupMap: {} } } });
    };
  }, []);

  return (
    <Security data-inspector="api_manager_edit_postsecurity_page">
      {leadTrade ? (
        <Back onClick={() => push(backUrl)} />
      ) : (
        <KcBreadCrumbs
          breadCrumbs={[
            { label: _t('subaccount.subaccount'), url: `/account/sub` },
            { label: _t('api.edit.title'), url: backUrl },
            { label: _t('security.verify') },
          ]}
        />
      )}
      <SecurityForm
        css={SecurityFormWrapper}
        onOk={handleOk}
        verifyType={secVerifyType}
        bizType={bizType}
        okText={_t('margin.lend.confirm.ok')}
      />
    </Security>
  );
};

export default withRouter()(
  connect(({ api_key }) => ({
    verifyData: api_key.verifyData,
    editData: api_key.editData,
  }))(injectLocale(SecurityValidation)),
);
