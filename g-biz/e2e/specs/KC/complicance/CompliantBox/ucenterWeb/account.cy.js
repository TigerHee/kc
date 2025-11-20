/* eslint-disable no-undef */

// ucenter-web 展业中台合规巡检基础配置
const ucenterWebSpmConfig = {
  'compliance.account.rightBanner.1': true,
  'compliance.account.rightAnnouncements.1': true,
};

const accountPage = '/account';

describe(`【${accountPage}】ucenter-web 已登录合规检查`, () => {
  beforeEach(() => {
    cy.setComplianceApi({
      ...ucenterWebSpmConfig,
    });
    cy.login();
  });

  it(`${accountPage} ucenter-web展业元素检查`, () => {
    cy.waitForSSG(accountPage);
    // compliance.account.rightBanner.1
    cy.get('[data-inspector="account_overview_banner"]').should('not.exist');
    // compliance.account.rightAnnouncements.1
    cy.get('[data-inspector="account_overview_announcements"]').should('not.exist');
  });
});
