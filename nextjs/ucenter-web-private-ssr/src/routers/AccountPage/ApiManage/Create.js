/**
 * Owner: willen@kupotech.com
 */
import JsBridge from 'gbiz-next/bridge';
import { useLocale } from 'hooks/useLocale';
import { styled } from '@kux/mui';
import CreateApi from 'components/Account/Api/CreateApi';
import { withRouter } from 'components/Router';
import { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import Back from 'src/components/common/Back';
import AccountLayout from '@/components/AccountLayout';
import { useRouter } from 'kc-next/router';

const Wrapper = styled.div`
  max-width: 640px;
  margin: 0 auto;
  margin-top: 10px;
`;

const CreateApiWrapper = styled.div`
  padding: ${({ isInApp }) => (isInApp ? '0 16px 16px 16px' : '16px')};
  a {
    color: ${(props) => props.theme.colors.text60};
  }
`;

const CreatePage = ({ dispatch }) => {
  const router = useRouter();
  useLocale();
  const remainRef = useRef(false);

  // 无需再验证，直接调用创建
  const requestCreate = async (params) => {
    const _authGroupMap = {};
    params.authGroupMap.forEach((key) => {
      _authGroupMap[key] = true;
    });
    params.authGroupMap = JSON.stringify(_authGroupMap);
    const { code } = await dispatch({
      type: 'api_key/createApi',
      payload: params,
    });
    if (code === '500000') {
      router?.replace('/account/api');
    }
  };

  const changeRemainRef = (bool) => {
    remainRef.current = bool;
  };

  useEffect(() => {
    return () => {
      if (!remainRef.current) {
        dispatch({ type: 'api_key/cacheAddData', payload: {} });
      }
    };
  }, [dispatch]);

  const isInApp = JsBridge.isApp();

  return (
    <AccountLayout>
      <CreateApiWrapper isInApp={isInApp} data-inspector="create_api">
        {!isInApp && (
          <Wrapper>
            <Back onClick={() => router?.push('/account/api')} />
          </Wrapper>
        )}

        <CreateApi
          bizType="CREATE_API"
          securityUrl="/account/api/create/security"
          backUrl="/account/api"
          successUrl="/account/api"
          skipSecCallback={requestCreate}
          changeRemainRef={changeRemainRef}
        />
      </CreateApiWrapper>
    </AccountLayout>
  );
};

export default withRouter()(connect()(CreatePage));
