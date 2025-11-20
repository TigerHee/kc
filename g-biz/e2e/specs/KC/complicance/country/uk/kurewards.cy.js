/* eslint-disable no-undef */

const url = '/land/KuRewards';

describe(`【${url}】`, () => {
  beforeEach(() => {
    // 英国用户访问
    cy.countryGB();
    cy.complianceFree();
  });

  it(`${url} 英国用户访问 KuRewards 合规巡检`, () => {
    cy.waitForSSG(url);

    cy.url().should('include', '/forbidden');
  });

  it(`${url}/detail 英国用户访问 KuRewards/detail 合规巡检`, () => {
    cy.waitForSSG(`${url}/detail`);

    cy.url().should('include', '/forbidden');
  });

  it(`${url}/coupons 英国用户访问 KuRewards/coupons 合规巡检`, () => {
    cy.waitForSSG(`${url}/coupons`);

    cy.url().should('include', '/forbidden');
  });
});
