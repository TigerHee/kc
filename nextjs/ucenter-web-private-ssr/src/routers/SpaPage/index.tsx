'use client';
import { RTL_LANGUAGES } from '@/config/base';
import { getCurrentLang, getCurrentLocale } from 'kc-next/boot';
import { IS_CLIENT_ENV } from 'kc-next/env';
import { getCurrentBaseName } from 'kc-next/i18n';
import { safeDynamic } from '@/tools/safeDynamic';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

// 重要：如果要禁用客户端组件的预渲染，可以使用ssr以下选项设置false Error rendering page:  Error: Cancel rendering route
// https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading#nextdynamic

const OauthPage = safeDynamic(() => import(/* webpackChunkName: "p__oauth__index" */ '@/pages/oauth/index'), { ssr: false });
const AccountPage = safeDynamic(() => import(/* webpackChunkName: "p__account__index" */ '@/pages/account/index'), { ssr: false });
const AccountSecurityPage = safeDynamic(() => import(/* webpackChunkName: "p__account__security__index" */ '@/pages/account/security/index'), {
  ssr: false,
});
const AccountSecurityPhonePage = safeDynamic(() => import(/* webpackChunkName: "p__account__security__phone__index" */ '@/pages/account/security/phone/index'), {
  ssr: false,
});
const AccountSecurityUnbindPhonePage = safeDynamic(
  () => import(/* webpackChunkName: "p__account__security__unbind-phone__index" */ '@/pages/account/security/unbind-phone/index'),
  { ssr: false },
);
const AccountSecurityG2faPage = safeDynamic(() => import(/* webpackChunkName: "p__account__security__g2fa__index" */ '@/pages/account/security/g2fa/index'), {
  ssr: false,
});
const AccountSecurityEmailPage = safeDynamic(() => import(/* webpackChunkName: "p__account__security__email__index" */ '@/pages/account/security/email/index'), {
  ssr: false,
});
const AccountSecurityUnbindEmailPage = safeDynamic(
  () => import(/* webpackChunkName: "p__account__security__unbind-email__index" */ '@/pages/account/security/unbind-email/index'),
  { ssr: false },
);
const AccountSecurityProtectPage = safeDynamic(
  () => import(/* webpackChunkName: "p__account__security__protect__index" */ '@/pages/account/security/protect/index'),
  { ssr: false },
);
const AccountSecurityUpdatepwdPage = safeDynamic(
  () => import(/* webpackChunkName: "p__account__security__updatepwd__index" */ '@/pages/account/security/updatepwd/index'),
  { ssr: false },
);
const AccountSecurityPasskeyPage = safeDynamic(
  () => import(/* webpackChunkName: "p__account__security__passkey__index" */ '@/pages/account/security/passkey/index'),
  { ssr: false },
);
const AccountSecurityDeleteAccountPage = safeDynamic(
  () => import(/* webpackChunkName: "p__account__security__deleteAccount__index" */ '@/pages/account/security/deleteAccount/index'),
  { ssr: false },
);
const AccountSecuritySafeWordPage = safeDynamic(
  () => import(/* webpackChunkName: "p__account__security__safeWord__index" */ '@/pages/account/security/safeWord/index'),
  { ssr: false },
);
const AccountSecurityWordTypePage = safeDynamic(
  () => import(/* webpackChunkName: "p__account__security__wordType__index" */ '@/pages/account/security/[wordType]/index'),
  { ssr: false },
);
const AccountSecurityScorePage = safeDynamic(() => import(/* webpackChunkName: "p__account__security__score__index" */ '@/pages/account/security/score/index'), {
  ssr: false,
});
const ApiManagePage = safeDynamic(() => import(/* webpackChunkName: "p__account__api__index" */ '@/pages/account/api'), { ssr: false });
const ApiManageActivationPage = safeDynamic(() => import(/* webpackChunkName: "p__account__api__activation__index" */ '@/pages/account/api/activation'), {
  ssr: false,
});
const ApiManageCreatePage = safeDynamic(() => import(/* webpackChunkName: "p__account__api__create__index" */ '@/pages/account/api/create'), { ssr: false });
const ApiManageCreateSecurityPage = safeDynamic(
  () => import(/* webpackChunkName: "p__account__api__create__security__index" */ '@/pages/account/api/create/security'),
  { ssr: false },
);
const ApiManageEditPage = safeDynamic(() => import(/* webpackChunkName: "p__account__api__edit__index" */ '@/pages/account/api/edit'), { ssr: false });
const ApiManageEditPostSecurityPage = safeDynamic(
  () => import(/* webpackChunkName: "p__account__api__edit__postsecurity__index" */ '@/pages/account/api/edit/postsecurity'),
  { ssr: false },
);
const ApiManageEditPreSecurityPage = safeDynamic(
  () => import(/* webpackChunkName: "p__account__api__edit__presecurity__index" */ '@/pages/account/api/edit/presecurity'),
  { ssr: false },
);
const ApiManageVerifyPage = safeDynamic(() => import(/* webpackChunkName: "p__account__api__verify__verifyId__index" */ '@/pages/account/api/verify/[verifyId]'), {
  ssr: false,
});
const KycPage = safeDynamic(() => import(/* webpackChunkName: "p__account__kyc__index" */ '@/pages/account/kyc/index'), { ssr: false });
const KycSetupCountryOfIssuePage = safeDynamic(
  () => import(/* webpackChunkName: "p__account__kyc__setup__country-of-issue__index" */ '@/pages/account/kyc/setup/country-of-issue/index'),
  { ssr: false },
);
const KycSetupIdentityTypePage = safeDynamic(
  () => import(/* webpackChunkName: "p__account__kyc__setup__identity-type__index" */ '@/pages/account/kyc/setup/identity-type/index'),
  { ssr: false },
);
const KycSetupMethodPage = safeDynamic(() => import(/* webpackChunkName: "p__account__kyc__setup__method__index" */ '@/pages/account/kyc/setup/method/index'), {
  ssr: false,
});
const KycSetupOcrPage = safeDynamic(() => import(/* webpackChunkName: "p__account__kyc__setup__ocr__index" */ '@/pages/account/kyc/setup/ocr/index'), {
  ssr: false,
});
const KycHomePage = safeDynamic(() => import(/* webpackChunkName: "p__account__kyc__home__index" */ '@/pages/account/kyc/home/index'), { ssr: false });
const KycMigratePage = safeDynamic(() => import(/* webpackChunkName: "p__account__kyc__migrate__index" */ '@/pages/account/kyc/migrate/index'), {
  ssr: false,
});
const KycTaxPage = safeDynamic(() => import(/* webpackChunkName: "p__account__kyc__tax" */ '@/pages/account/kyc/tax'), { ssr: false });
const KycUpdatePage = safeDynamic(() => import(/* webpackChunkName: "p__account__kyc__update" */ '@/pages/account/kyc/update'), { ssr: false });
const KybSetupPage = safeDynamic(() => import(/* webpackChunkName: "p__account__kyb__setup__index" */ '@/pages/account/kyb/setup/index'), { ssr: false });
const KybCertificationPage = safeDynamic(() => import(/* webpackChunkName: "p__account__kyb__certification__index" */ '@/pages/account/kyb/certification/index'), {
  ssr: false,
});
const KybHomePage = safeDynamic(() => import(/* webpackChunkName: "p__account__kyb__home__index" */ '@/pages/account/kyb/home/index'), { ssr: false });
const KycInstitutionalKycPage = safeDynamic(
  () => import(/* webpackChunkName: "p__account__kyc__institutional-kyc__index" */ '@/pages/account/kyc/institutional-kyc/index'),
  { ssr: false },
);
const KybMigratePage = safeDynamic(() => import(/* webpackChunkName: "p__account__kyb__migrate__index" */ '@/pages/account/kyb/migrate/index'), {
  ssr: false,
});
// const AccountSubPage = safeDynamic(() => import(/* webpackChunkName: "p__account__sub__index" */ '@/pages/account/sub/index'), { ssr: false });
const AccountSubApiManagerPage = safeDynamic(
  () => import(/* webpackChunkName: "p__account-sub__api-manager__sub__index" */ '@/pages/account-sub/api-manager/[sub]/index'),
  { ssr: false },
);
const AccountSubApiManagerCreatePage = safeDynamic(
  () => import(/* webpackChunkName: "p__account-sub__api-manager__create__sub__index" */ '@/pages/account-sub/api-manager/create/[sub]/index'),
  { ssr: false },
);
const AccountSubApiManagerCreateSecurityPage = safeDynamic(
  () => import(/* webpackChunkName: "p__account-sub__api-manager__create__security__sub__index" */ '@/pages/account-sub/api-manager/create/security/[sub]/index'),
  { ssr: false },
);
const AccountSubApiManagerEditPage = safeDynamic(
  () => import(/* webpackChunkName: "p__account-sub__api-manager__edit__sub__index" */ '@/pages/account-sub/api-manager/edit/[sub]/index'),
  { ssr: false },
);
const AccountSubApiManagerEditPreSecurityPage = safeDynamic(
  () => import(/* webpackChunkName: "p__account-sub__api-manager__edit__presecurity__sub__index" */ '@/pages/account-sub/api-manager/edit/presecurity/[sub]/index'),
  { ssr: false },
);
const AccountSubApiManagerEditPostSecurityPage = safeDynamic(
  () => import(/* webpackChunkName: "p__account-sub__api-manager__edit__postsecurity__sub__index" */ '@/pages/account-sub/api-manager/edit/postsecurity/[sub]/index'),
  { ssr: false },
);
const SubHistoryPage = safeDynamic(() => import(/* webpackChunkName: "p__account__sub__history__type__index" */ '@/pages/account/sub/history/[type]/index'), {
  ssr: false,
});
const ResetSecurityPage = safeDynamic(() => import(/* webpackChunkName: "p__ucenter__reset-security__index" */ '@/pages/ucenter/reset-security/index'), {
  ssr: false,
});
const ResetSecurityWithTokenPage = safeDynamic(
  () => import(/* webpackChunkName: "p__ucenter__reset-security__token__token__index" */ '@/pages/ucenter/reset-security/token/[token]/index'),
  { ssr: false },
);
const ResetSecurityWithAddressPage = safeDynamic(
  () => import(/* webpackChunkName: "p__ucenter__reset-security__address__address__index" */ '@/pages/ucenter/reset-security/address/[address]/index'),
  { ssr: false },
);
const GuidanceZBXPage = safeDynamic(() => import(/* webpackChunkName: "p__account__guidance-zbx" */ '@/pages/account/guidance-zbx'), { ssr: false });
const EscrowAccountPage = safeDynamic(() => import(/* webpackChunkName: "p__account__escrow-account" */ '@/pages/account/escrow-account'), {
  ssr: false,
});
const FreezeIndex = safeDynamic(() => import(/* webpackChunkName: "p__freeze" */ '@/pages/freeze'), {
  ssr: false,
});
const FreezeApply = safeDynamic(() => import(/* webpackChunkName: "p__freeze__apply" */ '@/pages/freeze/apply'), {
  ssr: false,
});
const Freezing = safeDynamic(() => import(/* webpackChunkName: "p__freezing" */ '@/pages/freezing'), {
  ssr: false,
});
const AuthorizeResult = safeDynamic(() => import(/* webpackChunkName: "p__authorize-result" */ '@/pages/authorize-result'), {
  ssr: false,
});
const Download = safeDynamic(() => import(/* webpackChunkName: "p__account__download" */ '@/pages/account/download'), {
  ssr: false,
});
const UTransferPage = safeDynamic(() => import(/* webpackChunkName: "p__utransfer" */ '@/pages/utransfer/index'), {
  ssr: false,
});

function RedirectTo404() {
  useEffect(() => {
    const path = window.location.pathname;
    // 如果已经在 /404 页,防止无限循环
    // 处理spa 404 跳转main-web
    if (!path.includes('/404')) {
      window.location.href = `${getCurrentBaseName()}/404?from=${encodeURIComponent(path)}`;
    }
  }, []);
  return null;
}
// 设置文档语言属性
if (IS_CLIENT_ENV) {
  if (document && document.documentElement) {
    document.documentElement.setAttribute('lang', getCurrentLocale());
    document.documentElement.setAttribute(
      'dir',
      RTL_LANGUAGES.includes(getCurrentLang()) ? 'rtl' : 'ltr',
    );
  }
}

export const routerConfig = [
  {
    path: '/oauth',
    component: () => <OauthPage />,
  },
  {
    path: '/account',
    component: () => <AccountPage />,
  },
  {
    path: '/account/security',
    component: () => <AccountSecurityPage />,
  },
  {
    path: '/account/security/phone',
    component: () => <AccountSecurityPhonePage />,
  },
  {
    path: '/account/security/unbind-phone',
    component: () => <AccountSecurityUnbindPhonePage />,
  },
  {
    path: '/account/security/g2fa',
    component: () => <AccountSecurityG2faPage />,
  },
  {
    path: '/account/security/email',
    component: () => <AccountSecurityEmailPage />,
  },
  {
    path: '/account/security/unbind-email',
    component: () => <AccountSecurityUnbindEmailPage />,
  },
  {
    path: '/account/security/protect',
    component: () => <AccountSecurityProtectPage />,
  },
  {
    path: '/account/security/updatepwd',
    component: () => <AccountSecurityUpdatepwdPage />,
  },
  {
    path: '/account/security/passkey',
    component: () => <AccountSecurityPasskeyPage />,
  },
  {
    path: '/account/security/deleteAccount',
    component: () => <AccountSecurityDeleteAccountPage />,
  },
  {
    path: '/account/security/safeWord',
    component: () => <AccountSecuritySafeWordPage />,
  },
  {
    path: '/account/security/:wordType',
    component: () => <AccountSecurityWordTypePage />,
  },
  {
    path: '/account/security/score',
    component: () => <AccountSecurityScorePage />,
  },
  {
    path: '/account/api',
    component: () => <ApiManagePage />,
  },
  {
    path: '/account/api/activation',
    component: () => <ApiManageActivationPage />,
  },
  {
    path: '/account/api/create',
    component: () => <ApiManageCreatePage />,
  },
  {
    path: '/account/api/create/security',
    component: () => <ApiManageCreateSecurityPage />,
  },
  {
    path: '/account/api/edit',
    component: () => <ApiManageEditPage />,
  },
  {
    path: '/account/api/edit/postsecurity',
    component: () => <ApiManageEditPostSecurityPage />,
  },
  {
    path: '/account/api/edit/presecurity',
    component: () => <ApiManageEditPreSecurityPage />,
  },
  {
    path: '/account/api/verify/:verifyId',
    component: () => <ApiManageVerifyPage />,
  },
  {
    path: '/account/kyc',
    component: () => <KycPage />,
  },
  {
    path: '/account/kyc/setup/country-of-issue',
    component: () => <KycSetupCountryOfIssuePage />,
  },
  {
    path: '/account/kyc/setup/identity-type',
    component: () => <KycSetupIdentityTypePage />,
  },
  {
    path: '/account/kyc/setup/method',
    component: () => <KycSetupMethodPage />,
  },
  {
    path: '/account/kyc/setup/ocr',
    component: () => <KycSetupOcrPage />,
  },
  {
    path: '/account/kyc/home',
    component: () => <KycHomePage />,
  },
  {
    path: '/account/kyc/migrate',
    component: () => <KycMigratePage />,
  },
  {
    path: '/account/kyc/tax',
    component: () => <KycTaxPage />,
  },
  {
    path: '/account/kyc/update',
    component: () => <KycUpdatePage />,
  },
  {
    path: '/account/kyb/setup',
    component: () => <KybSetupPage />,
  },
  {
    path: '/account/kyb/certification',
    component: () => <KybCertificationPage />,
  },
  {
    path: '/account/kyb/home',
    component: () => <KybHomePage />,
  },
  {
    path: '/account/kyc/institutional-kyc',
    component: () => <KycInstitutionalKycPage />,
  },
  {
    path: '/account/kyb/migrate',
    component: () => <KybMigratePage />,
  },
  /** @todo 等模块联邦迁移后，再放开这个路由 */
  // {
  //   path: '/account/sub',
  //   component: () => <AccountSubPage />,
  // },
  {
    path: '/account-sub/api-manager/:sub',
    component: () => <AccountSubApiManagerPage />,
  },
  {
    path: '/account-sub/api-manager/create/:sub',
    component: () => <AccountSubApiManagerCreatePage />,
  },
  {
    path: '/account-sub/api-manager/create/security/:sub',
    component: () => <AccountSubApiManagerCreateSecurityPage />,
  },
  {
    path: '/account-sub/api-manager/edit/:sub',
    component: () => <AccountSubApiManagerEditPage />,
  },
  {
    path: '/account-sub/api-manager/edit/presecurity/:sub',
    component: () => <AccountSubApiManagerEditPreSecurityPage />,
  },
  {
    path: '/account-sub/api-manager/edit/postsecurity/:sub',
    component: () => <AccountSubApiManagerEditPostSecurityPage />,
  },
  {
    path: '/account/sub/history/:type',
    component: () => <SubHistoryPage />,
  },
  {
    path: '/ucenter/reset-security',
    component: () => <ResetSecurityPage />,
  },
  {
    path: '/ucenter/reset-security/token/:token',
    component: () => <ResetSecurityWithTokenPage />,
  },
  {
    path: '/ucenter/reset-security/address/:address',
    component: () => <ResetSecurityWithAddressPage />,
  },
  // 清退账户引导页
  {
    path: '/account/guidance-zbx',
    component: () => <GuidanceZBXPage />,
  },
  // 清退账户资产托管页
  {
    path: '/account/escrow-account',
    component: () => <EscrowAccountPage />,
  },
  {
    path: '/account/download',
    component: () => <Download />,
  },
  {
    path: '/authorize-result',
    component: () => <AuthorizeResult />,
  },
  {
    path: '/freezing',
    component: () => <Freezing />,
  },
  {
    path: '/freeze/apply',
    component: () => <FreezeApply />,
  },
  {
    path: '/freeze',
    component: () => <FreezeIndex />,
  },
  {
    path: '/utransfer',
    component: () => <UTransferPage />,
  }
];

export default function SpaPage() {
  console.warn('check 2: 进入路由');
  return (
    <Routes>
      {routerConfig.map((item) => (
        <Route key={item.path} path={item.path} element={item.component()} />
      ))}
      {/* SPA 404 需要到 main-web 单独处理,否则用error page */}
      <Route path="*" element={<RedirectTo404 />} />
    </Routes>
  );
}
