/**
 * Owner: willen@kupotech.com
 */
import { ICCopyOutlined } from '@kux/icons';
import { Button, Dialog, styled, useSnackbar } from '@kux/mui';
import IpTag from 'components/Account/Api/IpTag';
import { withRouter } from 'components/Router';
import { tenantConfig } from 'config/tenant';
import { map } from 'lodash-es';
import { useMemo } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { connect } from 'react-redux';
import { _t } from 'tools/i18n';
import { trackClick } from 'utils/ga';
import { replace } from 'utils/router';

const StyledDialog = styled(Dialog)`
  overflow: hidden;
  .KuxDialog-content {
    display: block;
    max-height: calc(100vh - 20vh - 90px);
    overflow-y: auto;
  }
`;

const CreateSuccessName = styled.div`
  margin-bottom: 4px;
  color: ${(props) => props.theme.colors.text60};
  font-size: 14px;
  line-height: 22px;
`;

const CreateSuccessValue = styled.div`
  margin-bottom: 24px;
  color: ${(props) => props.theme.colors.text};
  font-size: 14px;
  line-height: 22px;
  word-break: break-all;
  .create_success__tag {
    margin-bottom: 12px;
  }
`;

const CreateSuccessValueKeyValue = styled(CreateSuccessValue)`
  padding: 12px 16px;
  overflow: hidden;
  background: ${(props) => props.theme.colors.cover8};
  border-radius: 2px;

  div:first-of-type {
    margin-bottom: 12px;
    color: ${(props) => props.theme.colors.text};
    font-size: 12px;
    line-height: 20px;
    word-break: keep-all;
  }

  div:last-child {
    color: ${(props) => props.theme.colors.text};
    font-size: 14px;
    line-height: 22px;
  }
`;

const CopyIcon = styled(ICCopyOutlined)`
  float: right;
  color: ${(props) => props.theme.colors.primary};
  transform: rotate(180deg) translateY(1px);
`;

const ListItemNolimit = styled.span`
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;

  span {
    margin-left: 6px;
    color: ${(props) => props.theme.colors.text};
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
  }
`;

const CreateSuccessBtn = styled(Button)`
  margin: 16px 0 32px;
`;

const CreateSuccess = ({
  successUrl,
  successFunc,
  createSuccessVisible,
  createSuccessData: {
    apiKey,
    apiName,
    secret,
    authGroupMap = {},
    permissionMap = {},
    ipWhitelist,
    ipWhitelistStatus,
    brokerId,
    useType,
  },
  dispatch,
}) => {
  const limitIPList = (ipWhitelist || '').split(',');
  const { message } = useSnackbar();

  const authList = useMemo(() => {
    const authMap = tenantConfig.api.apiAuthMap(_t);
    // 交集则显示
    let authArr = [];
    map(authGroupMap, (value, key) => {
      if (value) {
        if (key === 'API_COMMON' || (permissionMap && permissionMap[key])) {
          authArr.push(authMap[key]?.name);
        }
      }
    });
    return authArr.toString(', ');
  }, [authGroupMap, permissionMap]);

  // 确认或取消都走该逻辑
  const handleConfirm = () => {
    trackClick(['Confirm', '1']);
    dispatch({
      type: 'api_key/closeCreateSuccess',
    });
    if (successUrl) {
      replace(successUrl);
    }
    if (successFunc && typeof successFunc === 'function') {
      successFunc();
    }
  };

  return (
    <StyledDialog
      data-inspector="api_manager_create_success"
      open={createSuccessVisible}
      title={_t('api.create.success')}
      onCancel={handleConfirm}
      onOk={handleConfirm}
      maxWidth={false}
      okText=""
      cancelText=""
      footer={null}
    >
      <CreateSuccessName>{_t('api.memo')}</CreateSuccessName>
      <CreateSuccessValue>{apiName}</CreateSuccessValue>
      <CreateSuccessName>{_t('api.key')}</CreateSuccessName>
      <CreateSuccessValue>
        {apiKey}
        <CopyToClipboard
          text={apiKey}
          onCopy={() => {
            trackClick(['CopyKey', '1']);
            message.success(_t('copy.succeed'));
          }}
        >
          <CopyIcon size={24} />
        </CopyToClipboard>
      </CreateSuccessValue>
      <CreateSuccessName>{_t('api.secret')}</CreateSuccessName>
      <CreateSuccessValueKeyValue>
        <div>{_t('api.key.notice')}</div>
        <div>
          {secret}
          <CopyToClipboard
            text={secret}
            onCopy={() => {
              trackClick(['CopyPassphrase', '1']);
              message.success(_t('copy.succeed'));
            }}
          >
            <CopyIcon size={24} />
          </CopyToClipboard>
        </div>
      </CreateSuccessValueKeyValue>
      <CreateSuccessName>{_t('rkc4nZwYVAXzB2zeQHe7Vu')}</CreateSuccessName>
      <CreateSuccessValue>
        {useType === 'broker'
          ? _t('mEif9UdGtVdQLQjAa3Fdvh')
          : !brokerId
            ? _t('iKXfeRek5LRN96cYtAeXv6')
            : _t('pyH9ucvqsWXAU83y5tDdSB')}
      </CreateSuccessValue>

      {useType === 'broker' ? null : (
        <>
          <CreateSuccessName>{_t('api.auth')}</CreateSuccessName>
          <CreateSuccessValue>{authList}</CreateSuccessValue>

          <CreateSuccessName>{_t('api.auth.ip.limit')}</CreateSuccessName>
          <CreateSuccessValue>
            {brokerId ? (
              _t('71gFh9oR7w3SKMkAh8EdCE')
            ) : (
              <>
                {ipWhitelistStatus === 0 ? (
                  <ListItemNolimit>{_t('api.NoIp')}</ListItemNolimit>
                ) : (
                  map(limitIPList, (ip) => (
                    <IpTag ip={ip} key={ip} className="create_success__tag" />
                  ))
                )}
              </>
            )}
          </CreateSuccessValue>
        </>
      )}
      <CreateSuccessBtn data-testid="btn" fullWidth onClick={handleConfirm}>
        {_t('margin.confirm')}
      </CreateSuccessBtn>
    </StyledDialog>
  );
};

export default withRouter()(
  connect(({ api_key }) => ({
    createSuccessVisible: api_key.createSuccessVisible,
    createSuccessData: api_key.createSuccessData,
  }))(CreateSuccess),
);
