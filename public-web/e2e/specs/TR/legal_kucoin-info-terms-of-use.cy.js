const url = '/legal/kucoin-info-terms-of-use';
describe(`【${url}】`, () => {
  it(`${url} route test`, () => {
    cy.visit(url);
    cy.url().should('include', '/404');
  });
});
