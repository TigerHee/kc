/**
 * Owner: willen@kupotech.com
 */
import JsBridge from 'gbiz-next/bridge';
import { useLocale } from 'hooks/useLocale';
import { styled } from '@kux/mui';
import EditApi from 'components/Account/Api/EditApi';
import { withRouter } from 'components/Router';
import { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import Back from 'src/components/common/Back';
import { useRouter } from 'kc-next/router';
import AccountLayout from '@/components/AccountLayout';

const EditApiWrapper = styled.div`
  padding: ${({ isInApp }) => (isInApp ? '0px 16px 16px 16px' : '26px 16px 16px 16px')};
  a {
    color: ${(props) => props.theme.colors.text60};
  }
`;

const Wrapper = styled.div`
  max-width: 640px;
  margin: 0 auto;
`;

const EditPage = ({ detailData, dispatch, query }) => {
  const router = useRouter();
  useLocale();
  const remainEditRef = useRef(false);
  const { apiKey: _apiKey } = query;
  const handlePostSec = () => {
    remainEditRef.current = true;
  };

  // 禁止没有通过安全校验就访问
  useEffect(() => {
    // 兼容换皮，取一次详情
    const getDetailData = async () => {
      const { success, data } = await dispatch({
        type: 'api_key/getApiDetail',
        payload: { apiKey: _apiKey },
      });
      if (!success || !data.apiName) {
        router?.replace('/account/api');
      }
    };
    getDetailData();
  }, [_apiKey]);

  useEffect(() => {
    return () => {
      if (!remainEditRef.current) {
        dispatch({ type: 'api_key/update', payload: { detailData: { authGroupMap: {} } } });
        dispatch({ type: 'api_key/update', payload: { editData: { authGroupMap: {} } } });
      }
    };
  }, []);

  const isInApp = JsBridge.isApp();

  return (
    <AccountLayout>
      <EditApiWrapper isInApp={isInApp} data-inspector="api_edit_page">
        {!isInApp && (
          <Wrapper>
            <Back onClick={() => router?.push('/account/api')} />
          </Wrapper>
        )}
        <EditApi
          backUrl="/account/api"
          bizType="UPDATE_API"
          postSecUrl="/account/api/edit/postsecurity"
          onPostSec={handlePostSec}
          onPageToPostSec={()=> router?.replace('/account/api/edit/postsecurity')}
        />
      </EditApiWrapper>
    </AccountLayout>
  );
};

export default withRouter()(
  connect(({ api_key }) => ({
    detailData: api_key.detailData,
  }))(EditPage),
);
