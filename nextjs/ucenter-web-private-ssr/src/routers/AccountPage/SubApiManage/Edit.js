/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from 'components/LoadLocale';
import { styled } from '@kux/mui';
import EditApi from 'components/Account/Api/EditApi';
import { withRouter } from 'components/Router';
import { useEffect, useMemo, useRef } from 'react';
import { connect } from 'react-redux';
import Back from 'src/components/common/Back';
import KcBreadCrumbs from 'src/components/KcBreadCrumbs';
import { _t } from 'tools/i18n';
import AccountSubLayout from '@/components/AccountSubLayout';
import { push, replace } from '@/utils/router';
import ErrorBoundary, { SCENE_MAP } from '@/components/common/ErrorBoundary';

const Wrapper = styled.div`
  max-width: 640px;
  margin: 0 auto;
`;

const EditPage = ({ query, detailData, dispatch }) => {
  const { sub, leadTrade } = query;
  const remainEditRef = useRef(false);

  const handlePostSec = () => {
    remainEditRef.current = true;
  };

  const backUrl = useMemo(
    () => (leadTrade ? '/account/api' : `/account-sub/api-manager/${sub}`),
    [leadTrade, sub],
  );

  // 禁止没有通过安全校验就访问
  useEffect(() => {
    if (!detailData.apiName) {
      replace(backUrl);
    }
  }, [detailData, backUrl]);

  useEffect(() => {
    return () => {
      if (!remainEditRef.current) {
        dispatch({ type: 'api_key/update', payload: { detailData: { authGroupMap: {} } } });
        dispatch({ type: 'api_key/update', payload: { editData: { authGroupMap: {} } } });
      }
    };
  }, []);

  return (
    <>
      <Wrapper>
        {leadTrade ? (
          <Back onClick={() => push(backUrl)} />
        ) : (
          <KcBreadCrumbs
            breadCrumbs={[
              { label: _t('b3ZQna2k1NGzWKCfmbC8vr'), url: backUrl },
              { label: _t('api.edit.title') },
            ]}
          />
        )}
      </Wrapper>
      <EditApi
        backUrl={backUrl}
        postSecUrl={`/account-sub/api-manager/edit/postsecurity/${sub}${
          leadTrade ? '&leadTrade=1' : ''
        }`}
        bizType="UPDATE_SUB_ACCOUNT_API"
        onPostSec={handlePostSec}
      />
    </>
  );
};

const EditPageWithLayout = (props) => {
  return (
    <ErrorBoundary scene={SCENE_MAP.subAccount.api_edit}>
      <AccountSubLayout>
        <EditPage {...props} />
      </AccountSubLayout>
    </ErrorBoundary>
  );
};

export default withRouter()(
  connect(({ api_key }) => ({
    detailData: api_key.detailData,
  }))(injectLocale(EditPageWithLayout)),
);
