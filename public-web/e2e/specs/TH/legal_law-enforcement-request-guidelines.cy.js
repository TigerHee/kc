const url = '/legal/law-enforcement-request-guidelines';
describe(`【${url}】`, () => {
  it(`${url} route test`, () => {
    cy.visit(url);
    cy.url().should('include', '/404');
  });
});
