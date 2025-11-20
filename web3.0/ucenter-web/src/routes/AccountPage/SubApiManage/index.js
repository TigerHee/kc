/**
 * Owner: willen@kupotech.com
 */
import { Button, styled } from '@kux/mui';
import { useEffect } from 'react';
import { connect } from 'react-redux';
// import classnames from 'classnames';
import { useLocale } from '@kucoin-base/i18n';
import AbsoluteLoading from 'components/AbsoluteLoading';
import ListItem from 'components/Account/Api/ListItem';
import { withRouter } from 'components/Router';
import SecurityBinding from 'components/SecuritySetting';
import _ from 'lodash';
import { _t } from 'tools/i18n';
import { push } from 'utils/router';
// import { getCompleteUrl } from 'utils/seoTools';

const ApiWrapper = styled.div`
  .apiTitle {
    margin-bottom: 32px;
    color: ${(props) => props.theme.colors.text};
    font-weight: 500;
    font-size: 34px;
    line-height: 44px;
  }
  .api_notice {
    display: flex;
    padding: 12px 16px;
    color: ${(props) => props.theme.colors.text60};
    font-size: 12px;
    line-height: 20px;
    background: ${(props) => props.theme.colors.cover8};
    border-radius: 4px;
    p {
      margin: 0;
      a {
        color: ${(props) => props.theme.colors.primary};
      }
    }
  }
  .api_btns {
    display: flex;
    flex-wrap: wrap;
    // margin-bottom: 16px;
    ${(props) => props.theme.breakpoints.down('sm')} {
      flex-direction: column;
    }
    .api_btn {
      min-width: 120px;
      margin: 0px 16px 16px 0px;
      padding: 0 17px;
      font-size: 14px;

      ${(props) => props.theme.breakpoints.down('sm')} {
        min-width: 100%;
      }
    }
  }
`;

const ApiTitle = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 24px;
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
  font-size: 48px;
  line-height: 48px;
  transition: all 0.3s ease;

  ${(props) => props.theme.breakpoints.down('md')} {
    font-size: 36px;
    line-height: 36px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    flex-direction: column;
    align-items: flex-start;
    font-size: 24px;
    line-height: 24px;
  }
`;

const SubApiManange = ({ dispatch, apiKeys, query, security, loading }) => {
  useLocale();
  const isSecurity = (security.GOOGLE2FA || security.SMS) && security.WITHDRAW_PASSWORD;
  const { sub } = query;

  const listLoading = loading.effects['api_key/pull'];

  // 第一个版本是v1的api的索引值
  const toolTipsIndex = apiKeys.findIndex((api) => api.version === 1);

  // 去创建api
  const goCreate = () => {
    dispatch({
      type: 'api_key/cacheAddData',
      payload: {},
    });
    push(`/account-sub/api-manager/create/${sub}`);
  };

  useEffect(() => {
    dispatch({
      type: 'api_key/pull',
    });
  }, []);

  if (!isSecurity && _.keys(security || {})?.length > 0) {
    return (
      <div data-inspector="account_sub_api_manager_page">
        <ApiTitle>{_t('api.title')}</ApiTitle>
        <SecurityBinding tip={_t('deposit.requirement')} />
      </div>
    );
  }
  return (
    <ApiWrapper data-inspector="account_sub_api_manager_page">
      <div className="api_btns">
        <Button className="styles.api_btn" onClick={goCreate}>
          {_t('api.create')}
        </Button>
      </div>
      {listLoading ? (
        <AbsoluteLoading />
      ) : (
        _.map(apiKeys, (item, idx) => {
          return (
            <ListItem
              securityUrl={`/account-sub/api-manager/edit/presecurity/${sub}?apiKey=${item.apiKey}`}
              editUrl={`/account-sub/api-manager/edit/${sub}?apiKey=${item.apiKey}`}
              key={item.apiKey}
              isFirstV1Item={toolTipsIndex === idx}
              {...item}
            />
          );
        })
      )}
    </ApiWrapper>
  );
};

export default withRouter()(
  connect(({ api_key, user, loading }) => ({
    apiKeys: api_key.apiKeys,
    security: user.securtyStatus,
    loading,
  }))(SubApiManange),
);
