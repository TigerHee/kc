/**
 * Owner: willen@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { styled, useSnackbar } from '@kux/mui';
import { SECURITY_EXPIRED } from 'codes';
import SecurityForm from 'components/Account/Api/SecurityForm';
import { withRouter } from 'components/Router';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Back from 'src/components/common/Back';
import { _t } from 'tools/i18n';
import { push, replace } from 'utils/router';

const EditApi = styled.div`
  padding: ${({ isInApp }) => (isInApp ? '0px 16px 16px 16px' : '26px 16px 16px 16px;')};
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

const SecurityValidation = ({ dispatch, verifyData: { verifyType, bizType }, editData }) => {
  useLocale();
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

  // 如果刷新页面，将跳转至列表
  useEffect(() => {
    if (!editData.apiName || !verifyType || !verifyType.length) {
      replace('/account/api');
    }
  }, [verifyType]);

  useEffect(() => {
    return () => {
      dispatch({ type: 'api_key/update', payload: { editData: { authGroupMap: {} } } });
    };
  }, []);

  const isInApp = JsBridge.isApp();

  return (
    <EditApi isInApp={isInApp} data-inspector="api_edit_postsecurity_page">
      {!isInApp && (
        <Wrapper>
          <Back onClick={() => push('/account/api')} />
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
      </SecurityFormWrapper>
    </EditApi>
  );
};

export default withRouter()(
  connect(({ api_key }) => ({
    verifyData: api_key.verifyData,
    editData: api_key.editData,
  }))(SecurityValidation),
);
