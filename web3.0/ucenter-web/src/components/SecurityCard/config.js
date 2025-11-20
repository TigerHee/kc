/**
 * Owner: sean.shi@kupotech.com
 */
import { Divider, Switch } from '@kux/design';
import {
  AccountfreezeThinIcon,
  AnticodeThinIcon,
  EmailThinIcon,
  FreezeaccountThinIcon,
  GaThinIcon,
  IpThinIcon,
  LoginpasswordThinIcon,
  PasskeyThinIcon,
  PhoneThinIcon,
  SubaccountThinIcon,
  TradingpasswordThinIcon,
} from '@kux/iconpack';
import { Tag } from '@kux/mui';
import ExternalBindingsDialog from 'components/ExternalBindingsDialog';
import { renderConfig } from 'components/ExternalBindingsDialog/config';
import { tenantConfig } from 'config/tenant';
import { Fragment } from 'react';
import { _t, _tHTML } from 'tools/i18n';
import { composeSpmAndSave, trackClick } from 'utils/ga';
import { ButtonWrapper as Button, SecNameLabel } from './styled';

export const externalBindingsId = 'externalBindings';

const showSecurityList = (list) => {
  return list.filter((item) => item.show);
};

const sortSecurityList = (list) => {
  return list.sort((a, b) => {
    // 返回小于0，a 排在 b 前面
    // 返回大于0，a 排在 b 后面
    // 返回0，a 和 b 顺序不变
    // 如果置顶，排在最前面
    if (a.isFixTop) {
      return -1;
    }
    if (b.isFixTop) {
      return 1;
    }
    // 如果都设置，则按照原来的顺序
    if (a.isSetting && b.isSetting) {
      return 0;
    }
    // 如果a设置，b未设置，则a排在后面
    if (a.isSetting) {
      return 1;
    }
    // 如果b设置，a未设置，则b排在后面
    if (b.isSetting) {
      return -1;
    }
    // 如果都不设置，则按照原来的顺序
    return 0;
  });
};

export const getSecurityList = ({
  multiSiteConfig,
  sm,
  isSub,
  securtyStatus,
  externalBindings,
  phone,
  email,
  loginSafeWord,
  mailSafeWord,
  withdrawalSafeWord,
  freezeSelf,
  updateLoginIp,
  isExternalOpen,
  setIsExternalOpen,
}) => {
  const btnSize = 'basic';
  const switchSize = !sm ? 'small' : 'basic';
  const firstGroup = sortSecurityList(
    showSecurityList([
      {
        // 名称
        id: 'passkey',
        // 是否固定在顶部
        isFixTop: true,
        // 是否展示
        show: !isSub && multiSiteConfig?.securityConfig?.passkeyOpt,
        // 是否设置
        isSetting: securtyStatus.PASSKEY,
        isDouble: true,
        // 图标
        icon: <PasskeyThinIcon className={'icon'} />,
        // 跳转路径，如果没有 renderOperate，则需要设置 path
        path: '/account/security/passkey',
        // 名称
        name: _t('059323d78f664000ac1e'),
        // 描述
        renderDesc: () => {
          return <span>{_tHTML('dc1c9744ead94000a9f9', { a: '/support/36658009244057' })}</span>;
        },
        // 标签
        renderTag: () => {
          return (
            <SecNameLabel className="ml-8" style={{ display: 'flex' }}>
              <Tag>{_t('8a4b6d00c9934000a43b')}</Tag>
            </SecNameLabel>
          );
        },
        renderOperate: ({ handleNext }) => {
          return (
            <Button
              data-inspector="passkeyBtn"
              onClick={() => {
                trackClick(['Passkey', '1']);
                handleNext();
              }}
              size={btnSize}
              type="outlined"
            >
              {_t('setting')}
            </Button>
          );
        },
      },
      {
        id: 'google2fa',
        show: multiSiteConfig?.securityConfig?.google2faOpt,
        isSetting: securtyStatus.GOOGLE2FA,
        icon: <GaThinIcon className={'icon'} />,
        path: '/account/security/g2fa',
        name: _t('validation.g2fa'),
        isDouble: true,
        renderDesc: () => {
          return <span>{_tHTML('g2fa.tip')}</span>;
        },
        renderOperate: ({ item: { isSetting, path }, handleNext }) => {
          return (
            <Button
              data-inspector={isSetting ? 'editG2FABtn' : 'bindG2FABtn'}
              size={btnSize}
              type="outlined"
              onClick={() => {
                if (isSetting) {
                  composeSpmAndSave(path, ['Modify2FA', '1']);
                  trackClick(['Modify2FA', '1']);
                } else {
                  trackClick(['Bind2FA', '1']);
                  composeSpmAndSave(path, ['Bind2FA', '1']);
                }
                handleNext();
              }}
            >
              {isSetting ? _t('modify') : _t('setting')}
            </Button>
          );
        },
      },
      {
        id: 'email',
        show: multiSiteConfig?.securityConfig?.emailBindOpt,
        isSetting: securtyStatus.EMAIL,
        icon: <EmailThinIcon className={'icon'} />,
        path: '/account/security/email',
        unbindPath: '/account/security/unbind-email',
        settingContent: email,
        notSettingContent: _t('kc_safe_thrid_account_not_bind'),
        isDouble: true,
        name: _t('email.bind.title'),
        renderDesc: () => {
          return <span>{_t('email.tip')}</span>;
        },
        // 右侧操作按钮
        renderOperate: ({ item: { isSetting, path, unbindPath }, handleNext }) => {
          return isSetting ? (
            <>
              {
                // 只有主站展示解绑，其他站点都不展示
                tenantConfig.account.showUnbindEmail && (
                  <Button
                    data-inspector="unbindEmailBtn"
                    size={btnSize}
                    type="outlined"
                    onClick={() => {
                      trackClick(['UnbindEmail', '1']);
                      composeSpmAndSave(unbindPath, ['UnbindEmail', '1']);
                      handleNext(unbindPath);
                    }}
                  >
                    {_t('7oFkVW86phUwcUdqMDVGX3')}
                  </Button>
                )
              }
              <Button
                data-inspector="editEmailBtn"
                size={btnSize}
                type="outlined"
                className="rightBtn"
                onClick={() => {
                  trackClick(['ModifyEmail', '1']);
                  composeSpmAndSave(path, ['ModifyEmail', '1']);
                  handleNext(path);
                }}
              >
                {_t('modify')}
              </Button>
            </>
          ) : (
            <Button
              data-inspector="bindEmailBtn"
              size={btnSize}
              type="outlined"
              onClick={() => {
                trackClick(['BindEmail', '1']);
                composeSpmAndSave(path, ['BindEmail', '1']);
                handleNext(path);
              }}
            >
              {_t('gzvJV1f3KwZNV2hLgyo78R')}
            </Button>
          );
        },
      },
      {
        id: 'phone',
        show: multiSiteConfig?.securityConfig?.phoneBindOpt,
        isSetting: securtyStatus.SMS,
        icon: <PhoneThinIcon className={'icon'} />,
        path: '/account/security/phone',
        unbindPath: '/account/security/unbind-phone',
        settingContent: phone,
        notSettingContent: _t('kc_safe_thrid_account_not_bind'),
        isDouble: true,
        name: _t('phone.bind.title'),
        renderDesc: () => {
          return <span>{_tHTML('phone.tip')}</span>;
        },
        // 右侧操作按钮
        renderOperate: ({ item: { isSetting, path, unbindPath }, handleNext }) => {
          return isSetting ? (
            <>
              {
                // 泰国站不展示解绑手机，其他站点才展示解绑手机
                tenantConfig.account.showUnbindPhone && (
                  <Button
                    data-inspector="unbindPhoneBtn"
                    size={btnSize}
                    type="outlined"
                    onClick={() => {
                      trackClick(['UnbindPhone', '1']);
                      composeSpmAndSave(unbindPath, ['UnbindPhone', '1']);
                      handleNext(unbindPath);
                    }}
                  >
                    {_t('7oFkVW86phUwcUdqMDVGX3')}
                  </Button>
                )
              }
              <Button
                data-inspector="editPhoneBtn"
                size={btnSize}
                type="outlined"
                className="rightBtn"
                onClick={() => {
                  trackClick(['ModifyPhone', '1']);
                  composeSpmAndSave(path, ['ModifyPhone', '1']);
                  handleNext();
                }}
              >
                {_t('modify')}
              </Button>
            </>
          ) : (
            <Button
              data-inspector="bindPhoneBtn"
              size={btnSize}
              type="outlined"
              onClick={() => {
                trackClick(['BindPhone', '1']);
                composeSpmAndSave(path, ['BindPhone', '1']);
                handleNext();
              }}
            >
              {_t('gzvJV1f3KwZNV2hLgyo78R')}
            </Button>
          );
        },
      },
      {
        id: 'withdrawPwd',
        show: multiSiteConfig?.securityConfig?.withdrawPwdOpt,
        isSetting: securtyStatus.WITHDRAW_PASSWORD,
        isDouble: true,
        icon: <TradingpasswordThinIcon className={'icon'} />,
        path: '/account/security/protect',
        name: _t('trade.code'),
        renderDesc: () => {
          return <span>{_t('trade.code.tip')}</span>;
        },
        renderOperate: ({ item: { isSetting }, handleNext }) => {
          return (
            <Button
              data-inspector="withdrawPwdBtn"
              size={btnSize}
              type="outlined"
              onClick={() => {
                handleNext();
              }}
            >
              {isSetting ? _t('modify') : _t('setting')}
            </Button>
          );
        },
      },
      {
        id: 'loginPwd',
        show: multiSiteConfig?.securityConfig?.loginPwdOpt,
        isSetting: securtyStatus.PASSWORD,
        icon: <LoginpasswordThinIcon className={'icon'} />,
        isDouble: true,
        path: '/account/security/updatepwd',
        name: _t('login.password'),
        renderDesc: () => {
          return <span>{_t('login.password.tip')}</span>;
        },
        renderTag: () => {
          return null;
        },
        renderOperate: ({ item: { isSetting }, handleNext }) => {
          return (
            <Button
              data-inspector="loginPwdBtn"
              size={btnSize}
              type="outlined"
              onClick={() => {
                handleNext();
              }}
            >
              {isSetting ? _t('modify') : _t('setting')}
            </Button>
          );
        },
      },
    ]),
  );
  const secondGroup = showSecurityList([
    {
      id: 'safeWord',
      show: !isSub && multiSiteConfig?.securityConfig?.antiPhishingCodeOpt,
      isSetting: loginSafeWord || mailSafeWord || withdrawalSafeWord,
      icon: <AnticodeThinIcon className={'icon'} />,
      path: '/account/security/safeWord',
      name: _t('5fa8db7ae1fe4000a11b'),
      renderDesc: () => {
        return <span>{_t('b1500403de674800a7da')}</span>;
      },
      renderOperate: ({ item: { isSetting }, handleNext }) => {
        return (
          <Button
            data-inspector="safeWordBtn"
            size={btnSize}
            type="outlined"
            onClick={() => {
              handleNext();
            }}
          >
            {isSetting ? _t('modify') : _t('setting')}
          </Button>
        );
      },
    },
    {
      // 三方账号绑定
      id: externalBindingsId,
      show: !isSub && multiSiteConfig?.securityConfig?.extAccountBindOpt,
      isSetting: false,
      icon: <SubaccountThinIcon className={'icon'} />,
      path: '',
      name: _t('9YoftXrci66tYdGUbwa8uH'),
      renderDesc: () => {
        if (externalBindings?.length > 0) {
          return externalBindings?.map(({ extPlatform, extAccount }, index) => {
            const renderData = renderConfig[extPlatform];
            return (
              <Fragment key={extPlatform}>
                {index > 0 && <Divider direction="vertical" />}
                <span>{renderData?.label}: </span>
                <span>{extAccount}</span>
              </Fragment>
            );
          });
        }
        return <span>{_t('dW6eCAP7anSzPFfwm47jwm')}</span>;
      },
      renderOperate: ({ item: { isSetting } }) => {
        return (
          <>
            <Button
              data-inspector="externalBindingsBtn"
              size={btnSize}
              type="outlined"
              onClick={() => setIsExternalOpen(true)}
            >
              {isSetting ? _t('bkhDiopwNmAofoAzFSf6TX') : _t('gzvJV1f3KwZNV2hLgyo78R')}
            </Button>
            {/* 设置弹窗 */}
            <ExternalBindingsDialog
              open={isExternalOpen}
              onCancel={() => setIsExternalOpen(false)}
            />
          </>
        );
      },
    },
    {
      id: 'loginIp',
      // 为空，表示永远展示，不需要多站点控制
      show: !isSub,
      isSetting: securtyStatus.LOGIN_IP_PROTECT,
      icon: <IpThinIcon className={'icon'} />,
      path: '',
      name: _t('account.security.ip.switch'),
      renderDesc: () => {
        return <span>{_t('account.security.ip.tips')}</span>;
      },
      renderTag: () => {
        return (
          <SecNameLabel className="ml-8" style={{ display: 'flex' }}>
            <Tag>{_t('account.security.ip.subtips')}</Tag>
          </SecNameLabel>
        );
      },
      renderOperate: ({ item: { isSetting } }) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Switch onChange={updateLoginIp} checked={isSetting} size={switchSize} />
          </div>
        );
      },
    },
  ]);
  const thirdGroup = showSecurityList([
    {
      id: 'freeze',
      show: true,
      icon: <AccountfreezeThinIcon className={'icon'} />,
      name: _t('account.freeze.title'),
      path: '',
      renderLabel: () => null,
      renderDesc: () => {
        return <span>{_t('account.freeze.des')}</span>;
      },
      renderOperate: () => {
        return (
          <Button
            data-inspector="freezeSelfBtn"
            size={btnSize}
            onClick={freezeSelf}
            type="outlined"
          >
            {_t('account.freeze.opt')}
          </Button>
        );
      },
    },
    {
      id: 'deleteAccount',
      show: !isSub,
      icon: <FreezeaccountThinIcon className={'icon'} />,
      name: _t('account.del.title'),
      renderDesc: () => {
        return <span>{_t('account.del.reason.tip2')}</span>;
      },
      path: '/account/security/deleteAccount',
      renderOperate: ({ handleNext }) => {
        return (
          <Button
            data-inspector="deleteAccountBtn"
            size={btnSize}
            onClick={() => {
              trackClick(['deleteAccount', '1']);
              handleNext();
            }}
            type="outlined  "
          >
            {_t('account.del.btn.ok')}
          </Button>
        );
      },
      renderLabel: () => null,
    },
  ]);

  return [firstGroup, secondGroup, thirdGroup];
};
