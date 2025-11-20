/* eslint-disable no-undef */

const url = '/';

describe(`【${url}】`, () => {
  beforeEach(() => {
    // 日本用户访问
    cy.countryJP();
    cy.complianceFree();
  });

  it(`${url} footer 泰国站`, () => {
    cy.waitForSSG(url);
    // 检查泰国站footer
    cy.get('[data-inspector="inspector_footer_markets_amount"]').should('not.exist');
    // 检查泰国站footer copyRight
    cy.get('[data-inspector="inspector_footer_copyright"]').should('not.contain', '2017');
  });
});
