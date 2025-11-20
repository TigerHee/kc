/**
 * Owner: chelsey.fan@kupotech.com
 */
import loadable from '@loadable/component';
import { tenantConfig } from 'config/tenant';

const routes = [
  {
    path: '/',
    component: loadable(() =>
      import(/* webpackChunkName: 'layouts__index' */ './layouts/index.js'),
    ),
    routes: [
      {
        path: '/account',
        component: loadable(() =>
          import(/* webpackChunkName: 'p__account___layout' */ './pages/account/_layout.js'),
        ),
        routes: [
          {
            path: '/account',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(/* webpackChunkName: 'p__account__index' */ './pages/account/index.js'),
            ),
          },
          {
            path: '/account/kyb/setup',
            activeSiteConfig: () => ['KC_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__kyb__setup__index' */ './pages/account/kyb/setup.js'
              ),
            ),
          },
          {
            path: '/account/kyb/home',
            activeSiteConfig: () => ['KC_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__kyb__home__index' */ './pages/account/kyb/home.js'
              ),
            ),
          },
          {
            path: '/account/kyb/certification',
            activeSiteConfig: () => ['KC_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__kyb__certification__index' */ './pages/account/kyb/certification.js'
              ),
            ),
          },
          {
            path: '/account/kyc',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__kyc__index' */ './pages/account/kyc/index.js'
              ),
            ),
          },
          {
            path: '/account/kyc/setup/method',
            activeSiteConfig: () => ['KC_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__kyc__setup__method__index' */ './pages/account/kyc/setup/method.js'
              ),
            ),
          },
          {
            path: '/account/kyc/setup/country-of-issue',
            activeSiteConfig: () => ['KC_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__kyc__setup__countryOfIssue__index' */ './pages/account/kyc/setup/country-of-issue.js'
              ),
            ),
          },
          {
            path: '/account/kyc/setup/ocr',
            activeSiteConfig: () => ['KC_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__kyc__setup__ocr__index' */ './pages/account/kyc/setup/ocr.js'
              ),
            ),
          },
          {
            path: '/account/kyc/setup/identity-type',
            activeSiteConfig: () =>
              ['KC_ROUTE'].includes(tenantConfig.siteRoute) &&
              tenantConfig.kyc.siteRegion === 'global',
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__kyc__setup__identityType__index' */ './pages/account/kyc/setup/identity-type.js'
              ),
            ),
          },
          {
            path: '/account/kyc/home',
            activeSiteConfig: () => ['KC_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__kyc__home__index' */ './pages/account/kyc/home.js'
              ),
            ),
          },
          {
            path: '/account/kyc/migrate',
            activeSiteConfig: () => ['KC_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__kyc__migrate__index' */ './pages/account/kyc/migrate/index.js'
              ),
            ),
          },
          {
            path: '/account/kyb/migrate',
            activeSiteConfig: () => ['KC_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__kyb__migrate__index' */ './pages/account/kyb/migrate/index.js'
              ),
            ),
          },
          {
            path: '/account/kyc/personal-kyc1',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__kyc__personal-kyc1__index' */ './pages/account/kyc/personal-kyc1/index.js'
              ),
            ),
          },
          {
            path: '/account/kyc/personal-kyc2',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__kyc__personal-kyc2__index' */ './pages/account/kyc/personal-kyc2/index.js'
              ),
            ),
          },
          {
            path: '/account/kyc/institutional-kyc',
            activeSiteConfig: () => ['KC_ROUTE', 'TR_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__kyc__institutional-kyc__index' */ './pages/account/kyc/institutional-kyc/index.js'
              ),
            ),
          },
          {
            path: '/account/kyc/tax',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__kyc__tax' */ './pages/account/kyc/tax/index.js'
              ),
            ),
          },
          {
            path: '/account/kyc/update',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__kyc__update' */ './pages/account/kyc/update/index.js'
              ),
            ),
          },
          {
            path: '/account/security',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__security__index' */ './pages/account/security/index.js'
              ),
            ),
          },
          {
            path: '/account/api',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TH_ROUTE', 'TR_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__api__index' */ './pages/account/api/index.js'
              ),
            ),
          },
          {
            path: '/account/api/activation',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TH_ROUTE', 'TR_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__api__activation__index' */ './pages/account/api/activation/index.js'
              ),
            ),
          },
          {
            path: '/account/api/create',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TH_ROUTE', 'TR_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__api__create__index' */ './pages/account/api/create/index.js'
              ),
            ),
          },
          {
            path: '/account/api/create/security',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TH_ROUTE', 'TR_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__api__create__security__index' */ './pages/account/api/create/security/index.js'
              ),
            ),
          },
          {
            path: '/account/api/edit',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TH_ROUTE', 'TR_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__api__edit__index' */ './pages/account/api/edit/index.js'
              ),
            ),
          },
          {
            path: '/account/api/edit/postsecurity',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TH_ROUTE', 'TR_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__api__edit__postsecurity__index' */ './pages/account/api/edit/postsecurity/index.js'
              ),
            ),
          },
          {
            path: '/account/api/edit/presecurity',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TH_ROUTE', 'TR_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__api__edit__presecurity__index' */ './pages/account/api/edit/presecurity/index.js'
              ),
            ),
          },
          {
            path: '/account/api/verify/:verifyId',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TH_ROUTE', 'TR_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__api__verify__verifyId__index' */ './pages/account/api/verify/[verifyId]/index.js'
              ),
            ),
          },
          {
            path: '/account/download',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__download__index' */ './pages/account/download/index.js'
              ),
            ),
          },
          {
            path: '/account/sub',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__sub__index' */ './pages/account/sub/index.js'
              ),
            ),
          },
          {
            path: '/account/escrow-account',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__sub__index' */ './pages/account/escrow-account/index.js'
              ),
            ),
          },
          {
            path: '/account/sub/history/:type',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__sub__history__type$' */ './pages/account/sub/history/[type$].js'
              ),
            ),
          },
          {
            path: '/account/security/phone',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__security__phone__index' */ './pages/account/security/phone/index.js'
              ),
            ),
          },
          {
            path: '/account/security/unbind-phone',
            activeSiteConfig: () => ['KC_ROUTE', 'TR_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__security__unbind-phone__index' */ './pages/account/security/unbind-phone/index.js'
              ),
            ),
          },
          {
            path: '/account/security/g2fa',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__security__g2fa__index' */ './pages/account/security/g2fa/index.js'
              ),
            ),
          },
          {
            path: '/account/security/email',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__security__email__index' */ './pages/account/security/email/index.js'
              ),
            ),
          },
          {
            path: '/account/security/unbind-email',
            activeSiteConfig: () => ['KC_ROUTE', 'TR_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__security__unbind-email__index' */ './pages/account/security/unbind-email/index.js'
              ),
            ),
          },
          {
            path: '/account/security/protect',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__security__protect__index' */ './pages/account/security/protect/index.js'
              ),
            ),
          },
          {
            path: '/account/security/forgetWP',
            routes: [
              {
                path: '/account/security/forgetWP',
                activeSiteConfig: () =>
                  ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE'].includes(tenantConfig.siteRoute),
                exact: true,
                component: loadable(() =>
                  import(
                    /* webpackChunkName: 'p__account__security__forgetWP__index' */ './pages/account/security/forgetWP/index.js'
                  ),
                ),
              },
            ],
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__security__forgetWP___layout' */ './pages/account/security/forgetWP/_layout.js'
              ),
            ),
          },
          {
            path: '/account/security/updatepwd',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__security__updatepwd__index' */ './pages/account/security/updatepwd/index.js'
              ),
            ),
          },
          {
            path: '/account/security/passkey',
            exact: true,
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE'].includes(tenantConfig.siteRoute),
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__security__passkey__index' */ './pages/account/security/passkey/index.js'
              ),
            ),
          },
          {
            path: '/account/security/deleteAccount',
            routes: [
              {
                path: '/account/security/deleteAccount',
                activeSiteConfig: () =>
                  ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE'].includes(tenantConfig.siteRoute),
                exact: true,
                component: loadable(() =>
                  import(
                    /* webpackChunkName: 'p__account__security__deleteAccount__index' */ './pages/account/security/deleteAccount/index.js'
                  ),
                ),
              },
            ],
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__security__deleteAccount___layout' */ './pages/account/security/deleteAccount/_layout.js'
              ),
            ),
          },
          {
            path: '/account/security/safeWord',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__security__wordType__index' */ './pages/account/security/safeWord/index.js'
              ),
            ),
          },
          {
            path: '/account/security/score',
            activeSiteConfig: () => window._SITE_CONFIG_.functions.security_guard,
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__security__score__index' */ './pages/account/security/score/index.js'
              ),
            ),
          },
          {
            // 已废弃，安全码使用 /account/security/safeWord
            path: '/account/security/:wordType',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__security__wordType__index' */ './pages/account/security/[wordType]/index.js'
              ),
            ),
          },
          {
            path: '/account/assets/:sub',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TH_ROUTE', 'TR_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account-sub__assets__sub__index' */ './pages/account/assets/[sub]/index.js'
              ),
            ),
          },
          {
            path: '/account/transfer',
            activeSiteConfig: () => ['KC_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__transfer__index' */ './pages/account/transfer/index.js'
              ),
            ),
          },
          {
            path: '/account/guidance-zbx',
            activeSiteConfig: () => ['KC_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account__transfer__index' */ './pages/account/guidance-zbx/index.js'
              ),
            ),
          },
        ],
      },
      {
        path: '/account-sub',
        component: loadable(() =>
          import(
            /* webpackChunkName: 'p__account-sub___layout' */ './pages/account-sub/_layout.js'
          ),
        ),
        routes: [
          {
            path: '/account-sub/api-manager/create/security/:sub',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TH_ROUTE', 'TR_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account-sub__api-manager__create__security__sub__index' */ './pages/account-sub/api-manager/create/security/[sub]/index.js'
              ),
            ),
          },
          {
            path: '/account-sub/api-manager/create/:sub',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TH_ROUTE', 'TR_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account-sub__api-manager__create__sub__index' */ './pages/account-sub/api-manager/create/[sub]/index.js'
              ),
            ),
          },
          {
            path: '/account-sub/api-manager/edit/postsecurity/:sub',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TH_ROUTE', 'TR_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account-sub__api-manager__edit__postsecurity__sub__index' */ './pages/account-sub/api-manager/edit/postsecurity/[sub]/index.js'
              ),
            ),
          },
          {
            path: '/account-sub/api-manager/edit/presecurity/:sub',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TH_ROUTE', 'TR_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account-sub__api-manager__edit__presecurity__sub__index' */ './pages/account-sub/api-manager/edit/presecurity/[sub]/index.js'
              ),
            ),
          },
          {
            path: '/account-sub/api-manager/edit/:sub',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TH_ROUTE', 'TR_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account-sub__api-manager__edit__sub__index' */ './pages/account-sub/api-manager/edit/[sub]/index.js'
              ),
            ),
          },
          {
            path: '/account-sub/api-manager/:sub',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TH_ROUTE', 'TR_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account-sub__api-manager__sub__index' */ './pages/account-sub/api-manager/[sub]/index.js'
              ),
            ),
          },
          {
            path: '/account-sub/assets/:sub',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TH_ROUTE', 'TR_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__account-sub__assets__sub__index' */ './pages/account-sub/assets/[sub]/index.js'
              ),
            ),
          },
        ],
      },
      {
        path: '/ucenter',
        component: loadable(() =>
          import(/* webpackChunkName: 'p__ucenter___layout' */ './pages/ucenter/_layout.js'),
        ),
        routes: [
          {
            path: '/ucenter/signin',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE', 'CL_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(/* webpackChunkName: 'p__ucenter__signin' */ './pages/ucenter/signin.js'),
            ),
          },
          {
            path: '/ucenter/signup',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(/* webpackChunkName: 'p__ucenter__signup' */ './pages/ucenter/signup.js'),
            ),
          },
          {
            path: '/ucenter/reset-password',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE', 'CL_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__ucenter__reset-password' */ './pages/ucenter/reset-password.js'
              ),
            ),
          },
          {
            path: '/ucenter/reset-g2fa',
            routes: [
              {
                path: '/ucenter/reset-g2fa/:token',
                activeSiteConfig: () =>
                  ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE', 'CL_ROUTE'].includes(tenantConfig.siteRoute),
                exact: true,
                component: loadable(() =>
                  import(
                    /* webpackChunkName: 'p__ucenter__reset-g2fa__token' */ './pages/ucenter/reset-g2fa/[token].js'
                  ),
                ),
              },
            ],
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__ucenter__reset-g2fa___layout' */ './pages/ucenter/reset-g2fa/_layout.js'
              ),
            ),
          },
          {
            path: '/ucenter/rebind-phone',
            routes: [
              {
                path: '/ucenter/rebind-phone/:token',
                activeSiteConfig: () =>
                  ['KC_ROUTE', 'TH_ROUTE', 'TR_ROUTE', 'CL_ROUTE'].includes(tenantConfig.siteRoute),
                exact: true,
                component: loadable(() =>
                  import(
                    /* webpackChunkName: 'p__ucenter__rebind-phone__token' */ './pages/ucenter/rebind-phone/[token].js'
                  ),
                ),
              },
            ],
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__ucenter__rebind-phone___layout' */ './pages/ucenter/rebind-phone/_layout.js'
              ),
            ),
          },
          {
            path: '/ucenter/reset-security',
            routes: [
              {
                path: '/ucenter/reset-security',
                activeSiteConfig: () =>
                  ['KC_ROUTE', 'TH_ROUTE', 'TR_ROUTE', 'CL_ROUTE'].includes(tenantConfig.siteRoute),
                exact: true,
                component: loadable(() =>
                  import(
                    /* webpackChunkName: 'p__ucenter__reset-security' */ './pages/ucenter/reset-security/index.js'
                  ),
                ),
              },
              {
                path: '/ucenter/reset-security/token/:token',
                activeSiteConfig: () =>
                  ['KC_ROUTE', 'TH_ROUTE', 'TR_ROUTE', 'CL_ROUTE'].includes(tenantConfig.siteRoute),
                exact: true,
                component: loadable(() =>
                  import(
                    /* webpackChunkName: 'p__ucenter__reset-security__token' */ './pages/ucenter/reset-security/token/[token].js'
                  ),
                ),
              },
              {
                path: '/ucenter/reset-security/address/:address',
                activeSiteConfig: () =>
                  ['KC_ROUTE', 'TH_ROUTE', 'TR_ROUTE', 'CL_ROUTE'].includes(tenantConfig.siteRoute),
                exact: true,
                component: loadable(() =>
                  import(
                    /* webpackChunkName: 'p__ucenter__reset-security__address' */ './pages/ucenter/reset-security/address/[address].js'
                  ),
                ),
              },
            ],
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__ucenter__reset-security__layout' */ './pages/ucenter/reset-security/_layout.js'
              ),
            ),
          },
        ],
      },
      {
        path: '/authorize-result',
        component: loadable(() =>
          import(
            /* webpackChunkName: 'p__authorize-result___layout' */ './pages/authorize-result/_layout.js'
          ),
        ),
        routes: [
          {
            path: '/authorize-result',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE', 'CL_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__authorize-result__index' */ './pages/authorize-result/index.js'
              ),
            ),
          },
        ],
      },
      {
        path: '/kyc-advance-result',
        activeSiteConfig: () =>
          ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE'].includes(tenantConfig.siteRoute),
        component: loadable(() =>
          import(
            /* webpackChunkName: 'p__kyc-advance-result__index' */ './pages/kyc-advance-result/index.js'
          ),
        ),
      },
      {
        path: '/restrict', // 全部放开
        component: loadable(() =>
          import(/* webpackChunkName: 'p__restrict__index' */ './pages/restrict/index.js'),
        ),
      },
      {
        path: '/utransfer',
        activeSiteConfig: () =>
          ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE', 'CL_ROUTE'].includes(tenantConfig.siteRoute),
        exact: true,
        component: loadable(() =>
          import(/* webpackChunkName: 'p__utransfer__index' */ './pages/utransfer/index.js'),
        ),
      },
      {
        path: '/oauth',
        activeSiteConfig: () =>
          ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE'].includes(tenantConfig.siteRoute),
        exact: true,
        component: loadable(() =>
          import(/* webpackChunkName: 'p__oauth__index' */ './pages/oauth/index.js'),
        ),
      },
      {
        path: '/freezing',
        activeSiteConfig: () =>
          ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE'].includes(tenantConfig.siteRoute),
        exact: true,
        component: loadable(() =>
          import(/* webpackChunkName: 'p__freezing__index' */ './pages/freezing/index.js'),
        ),
      },
      {
        path: '/freeze',
        routes: [
          {
            path: '/freeze/apply',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE', 'CL_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(
                /* webpackChunkName: 'p__freeze__apply__index' */ './pages/freeze/apply/index.js'
              ),
            ),
          },
          {
            path: '/freeze',
            activeSiteConfig: () =>
              ['KC_ROUTE', 'TR_ROUTE', 'TH_ROUTE', 'CL_ROUTE'].includes(tenantConfig.siteRoute),
            exact: true,
            component: loadable(() =>
              import(/* webpackChunkName: 'p__freeze__index' */ './pages/freeze/index.js'),
            ),
          },
        ],
        component: loadable(() =>
          import(/* webpackChunkName: 'p__freeze___layout' */ './pages/freeze/_layout.js'),
        ),
      },
      {
        path: '/account-compliance',
        activeSiteConfig: () =>
          ['KC_ROUTE', 'TH_ROUTE', 'TR_ROUTE'].includes(tenantConfig.siteRoute),
        exact: true,
        component: loadable(() =>
          import(
            /* webpackChunkName: 'p__account__compliance__index' */ './pages/compliance/index.js'
          ),
        ),
      },
    ],
  },
];

export default routes;
