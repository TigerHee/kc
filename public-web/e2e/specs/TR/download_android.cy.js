const url = '/download/android';
describe(`【${url}】`, () => {
  it(`${url} route test`, () => {
    cy.visit(url);
    cy.url().should('include', '/404');
  });
});
