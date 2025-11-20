import { checkRender } from '../common/utils';

const url = '/account/sub/history/transfer';
const mockSiteConfig = (supportSubAccount) =>
  cy.intercept('/_api/ucenter/site-config*', {
    statusCode: 200,
    body: {
      success: true,
      code: '200',
      data: {
        accountConfig: {
          siteType: 'turkey',
          siteLogoUrl: '',
          bindingLimits: [],
          accountTypes: ['phone', 'email'],
          supportExtAccounts: [],
          supportSubAccount,
          supportRCode: false,
          subUserPermissions: [],
        },
      },
    },
  });

describe(`【${url}】`, () => {
  beforeEach(() => cy.login());
  it(`多站点配置不支持子账号`, () => {
    mockSiteConfig(false);
    cy.visit(url);

    cy.url().should((currentUrl) => {
      const path = new URL(currentUrl).pathname;
      expect(path.endsWith('/account')).to.be.true;
    });
  });

  it(`多站点配置支持子账号`, () => {
    mockSiteConfig(true);
    cy.visit(url);
    checkRender('[data-inspector="account_sub_history_page"]');
  });
});
