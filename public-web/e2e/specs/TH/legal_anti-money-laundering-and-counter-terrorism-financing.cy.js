const url = '/legal/anti-money-laundering-and-counter-terrorism-financing';
describe(`【${url}】`, () => {
  it(`${url} route test`, () => {
    cy.visit(url);
    cy.url().should('include', '/404');
  });
});
