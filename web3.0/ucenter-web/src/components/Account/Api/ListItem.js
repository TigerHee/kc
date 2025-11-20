/**
 * Owner: willen@kupotech.com
 */
import { ICDeleteOutlined, ICEdit2Outlined } from '@kux/icons';
import { Dialog, styled, Tooltip, useResponsive } from '@kux/mui';
import SpanForA from 'components/common/SpanForA';
import { injectLocale } from 'components/LoadLocale';
import { withRouter } from 'components/Router';
import { tenantConfig } from 'config/tenant';
import { map } from 'lodash';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { _t, _tHTML } from 'tools/i18n';
import { trackClick } from 'utils/ga';
import { push } from 'utils/router';
import siteConfig from 'utils/siteConfig';

const List_item = styled.div`
  padding: 40px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cover4};
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 16px 0;
  }
  .list_item__title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 26px;
    margin-bottom: 20px;
    .versionText {
      width: 600px;
      a {
        color: ${({ theme }) => theme.colors.primary};
      }
    }
    .version1 {
      color: ${({ theme }) => theme.colors.secondary};
      background-color: ${({ theme }) => theme.colors.secondary8};
    }

    .version2 {
      color: ${({ theme }) => theme.colors.primary};
      background-color: ${({ theme }) => theme.colors.primary8};
    }
    .list_item__name {
      display: flex;
      align-items: center;
      span {
        &:first-child {
          color: ${({ theme }) => theme.colors.text};
          font-weight: 500;
          font-size: 20px;
          line-height: 130%;
          ${(props) => props.theme.breakpoints.down('sm')} {
            font-size: 16px;
          }
        }
        &:not(:first-child) {
          margin-left: 8px;
          padding: 0 4px;
          font-weight: 500;
          font-size: 12px;
          line-height: 20px;
          text-align: center;
          border-radius: 2px;
        }
      }
    }

    .list_item__btns {
      display: flex;
      align-items: center;

      a,
      .link_for_a {
        margin-left: 16px;
        color: ${({ theme }) => theme.colors.primary};
        font-weight: 500;
        font-size: 16px;
        line-height: 22px;
        ${(props) => props.theme.breakpoints.down('sm')} {
          font-size: 14px;
        }
        &:first-child {
          margin-left: 0;
        }
        svg {
          color: ${({ theme }) => theme.colors.text};
          vertical-align: middle;
        }
      }
    }
  }

  .list_item__body {
    .list_item__row {
      display: flex;
      margin-bottom: 16px;
      ${(props) => props.theme.breakpoints.down('sm')} {
        justify-content: space-between;
        margin-bottom: 8px;
      }
      &:last-child {
        margin-bottom: 0;
      }
      & > span:first-child {
        width: 120px;
        min-width: 120px;
        max-width: 120px;
        padding-right: 16px;
        color: ${({ theme }) => theme.colors.text40};
        font-weight: 400;
        font-size: 14px;
        line-height: 130%;
      }

      & > span:last-child {
        flex-grow: 1;
        color: ${({ theme }) => theme.colors.text};
        font-weight: 500;
        font-size: 14px;
        line-height: 130%;
        ${(props) => props.theme.breakpoints.down('sm')} {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          margin-left: 30px;
          text-align: right;
        }
      }

      .list_item__auth {
        display: inline-block;
        height: 22px;
        color: ${({ theme }) => theme.colors.text};
        line-height: 22px;
        border-bottom: 1px dashed ${({ theme }) => theme.colors.text20};
        cursor: pointer;

        & + .list_item__auth {
          margin-left: 24px;
        }
      }

      .list_item__nolimit {
        color: ${({ theme }) => theme.colors.text};
        font-weight: 500;
        font-size: 14px;
        line-height: 130%;
        ${(props) => props.theme.breakpoints.down('sm')} {
          text-align: right;
        }
        span {
          margin-left: 6px;
          color: ${({ theme }) => theme.colors.complementary};
          font-weight: 500;
          font-size: 14px;
          line-height: 130%;
        }
      }
      .list_item__tag_Wrapper {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        ${(props) => props.theme.breakpoints.down('sm')} {
          justify-content: flex-end;
        }
      }
      .list_item__tag {
        margin-right: 16px;
        color: ${({ theme }) => theme.colors.text};
        font-weight: 500;
        font-size: 14px;
        line-height: 130%;
        &:last-child {
          margin-right: 0;
        }
        ${(props) => props.theme.breakpoints.down('sm')} {
          margin-right: 0px;
          margin-left: 16px;
        }
      }
    }
  }
`;

const Del_dialog__notice = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 16px;
`;
const Del_dialog__key = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text60};
`;

const { DOCS_HOST } = siteConfig;

const ListItem = ({
  securityUrl,
  editUrl,
  activationUrl,
  apiName,
  apiVersion,
  apiKey,
  authGroupMap,
  permissionMap,
  ipWhitelistStatus, // ip白名单状态：0.禁用 1.启用
  ipWhitelist, // ip白名单
  isActivated, // 是否激活
  query,
  accountSub,
  brokerId,
  isLeadTradeApi,
}) => {
  const { sub } = query;
  const limitIPList = (ipWhitelist || '').split(',');
  const dispatch = useDispatch();

  const [delOpen, setDelOpen] = useState(false);

  const rv = useResponsive();
  const isH5 = !rv?.sm;

  // 获取校验类型
  const getVerifyType = async (bizType) => {
    const verifyType = await dispatch({
      type: 'security_new/get_verify_type',
      payload: { bizType },
    });
    return verifyType;
  };

  // 激活
  const goActivation = async (e) => {
    e.preventDefault();
    // 发送激活邮件
    await dispatch({
      type: 'api_key/sendActivationEmail',
      payload: { apiKey },
    });
    push(activationUrl);
  };

  // 编辑
  const goEdit = async (e) => {
    e.preventDefault();
    trackClick(['Edit', '1']);
    const _bizType = sub ? 'UPDATE_SUB_ACCOUNT_API' : 'UPDATE_API';
    const verifyType = await getVerifyType(_bizType);
    dispatch({
      type: 'api_key/cacheVerifyData',
      payload: { verifyType, bizType: _bizType },
    });
    if (verifyType && verifyType[0] && verifyType[0].length) {
      const url = `${securityUrl}&bizType=${_bizType}`;
      push(url);
    } else {
      await dispatch({
        type: 'api_key/getApiDetail',
        payload: { subName: sub, apiKey },
      });
      push(editUrl);
    }
  };

  // 打开删除弹窗
  const showDelDialog = (e) => {
    e.preventDefault();
    trackClick(['Delete', '1']);
    setDelOpen(true);
  };

  // 关闭删除弹窗
  const closeDelDialog = () => {
    setDelOpen(false);
  };

  // 确认删除
  const submitDel = () => {
    closeDelDialog();
    dispatch({
      type: 'api_key/deleteApi',
      payload: { id: apiKey, subName: sub, isLeadTradeApi },
    });
  };

  const authList = useMemo(() => {
    const authMap = tenantConfig.api.apiAuthMap(_t);
    // 交集则显示
    return map(authGroupMap, (value, key) => {
      if (value) {
        if (key === 'API_COMMON') {
          return (
            <Tooltip placement="top" title={authMap[key].desc} key={key} width={320}>
              <span className="list_item__auth">{authMap[key].name}</span>
            </Tooltip>
          );
        } else if (permissionMap && permissionMap[key]) {
          return (
            <Tooltip placement="top" title={authMap[key].desc} key={key} width={320}>
              <span className="list_item__auth">{authMap[key].name}</span>
            </Tooltip>
          );
        }
      }
    });
  }, [authGroupMap, permissionMap]);

  return (
    <List_item>
      <div className="list_item__title">
        <div className="list_item__name">
          <span>{apiName}</span>
          {apiVersion ? (
            apiVersion === 1 ? (
              <Tooltip
                placement="top-start"
                title={
                  <div className="versionText">
                    {_tHTML('api.version.help', { href: DOCS_HOST })}
                  </div>
                }
              >
                <span className="version1">V{apiVersion}</span>
              </Tooltip>
            ) : (
              <span className="version2">V{apiVersion}</span>
            )
          ) : null}
          {isActivated ? null : <span className="version1">{_t('api.manage.active.no')}</span>}
        </div>
        {!accountSub ? (
          <div className="list_item__btns">
            {isActivated ? (
              <SpanForA className="link_for_a" href="" onClick={goEdit}>
                <ICEdit2Outlined size={isH5 ? '16' : '24'} />
              </SpanForA>
            ) : (
              <SpanForA className="link_for_a" href="" onClick={goActivation}>
                {_t('api.manage.active.to')}
              </SpanForA>
            )}
            <SpanForA className="link_for_a" href="" onClick={showDelDialog}>
              <ICDeleteOutlined size={isH5 ? '16' : '24'} />
            </SpanForA>
          </div>
        ) : null}
      </div>
      <div className="list_item__body">
        <div className="list_item__row">
          <span>{_t('api.key')}</span>
          <span>{isActivated ? apiKey : _t('api.manage.active.has')}</span>
        </div>
        <div className="list_item__row">
          <span>{_t('rkc4nZwYVAXzB2zeQHe7Vu')}</span>
          <span>{!brokerId ? _t('iKXfeRek5LRN96cYtAeXv6') : _t('pyH9ucvqsWXAU83y5tDdSB')}</span>
        </div>
        <div className="list_item__row">
          <span>{_t('api.auth')}</span>
          <span>{authList}</span>
        </div>
        <div className="list_item__row">
          <span>{_t('api.auth.ip.limit')}</span>
          <span>
            {brokerId ? (
              <span className="list_item__nolimit">{_t('71gFh9oR7w3SKMkAh8EdCE')}</span>
            ) : (
              <>
                {ipWhitelistStatus === 0 ? (
                  <span className="list_item__nolimit">
                    {_t('api.NoIp')}
                    <span>{_t('api.auth.ip.suggest')}</span>
                  </span>
                ) : (
                  <div className="list_item__tag_Wrapper">
                    {map(limitIPList, (ip) => (
                      <div key={ip} className="list_item__tag">
                        {ip}{' '}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </span>
        </div>
      </div>

      <Dialog
        title={_t('delete')}
        open={delOpen}
        onCancel={closeDelDialog}
        onOk={submitDel}
        okText={_t('confirm')}
        cancelText={_t('cancel')}
        okButtonProps={{
          size: 'basic',
        }}
        cancelButtonProps={{
          size: 'basic',
        }}
        maxWidth={false}
      >
        <Del_dialog__notice>{_tHTML('api.delete.notice', { apiName })}</Del_dialog__notice>
        <Del_dialog__key>{apiKey}</Del_dialog__key>
      </Dialog>
    </List_item>
  );
};

export default withRouter()(injectLocale(ListItem));
