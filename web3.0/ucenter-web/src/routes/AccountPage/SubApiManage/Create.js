/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { styled } from '@kux/mui';
import CreateApi from 'components/Account/Api/CreateApi';
import { withRouter } from 'components/Router';
import { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import KcBreadCrumbs from 'src/components/KcBreadCrumbs';
import { _t } from 'tools/i18n';
import { replace } from 'utils/router';

const Wrapper = styled.div`
  max-width: 640px;
  margin: 0 auto;
`;

const CreatePage = ({ query, dispatch }) => {
  useLocale();
  const { sub } = query;
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
      payload: { ...params, subName: sub },
    });
    if (code === '500000') {
      replace(`/account-sub/api-manager/${sub}`);
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
  }, []);

  return (
    <>
      <Wrapper>
        <KcBreadCrumbs
          breadCrumbs={[
            { label: _t('b3ZQna2k1NGzWKCfmbC8vr'), url: `/account-sub/api-manager/${sub}` },
            { label: _t('api.create') },
          ]}
        />
      </Wrapper>
      <CreateApi
        bizType="CREATE_SUB_ACCOUNT_API"
        securityUrl={`/account-sub/api-manager/create/security/${sub}`}
        backUrl={`/account-sub/api-manager/${sub}`}
        successUrl={`/account-sub/api-manager/${sub}`}
        skipSecCallback={requestCreate}
        changeRemainRef={changeRemainRef}
        subName={sub}
      />
    </>
  );
};

export default withRouter()(connect()(CreatePage));
