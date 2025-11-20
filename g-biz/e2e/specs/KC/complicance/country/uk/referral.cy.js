/* eslint-disable no-undef */

const url = '/referral';

describe(`【${url}】`, () => {
  beforeEach(() => {
    // 英国用户访问
    cy.countryGB();
    cy.complianceFree();
  });

  it(`${url} 英国用户访问 限时返佣页面 合规巡检`, () => {
    cy.waitForSSG(url);

    cy.url().should('include', '/forbidden');
  });
});
