const url = '/account/api/verify/123';
describe(`【${url}】`, () => {
  beforeEach(() => cy.login());
  it(`${url} route test`, () => {
    cy.visit(url);
    cy.get('[data-inspector="verify_api_email"]').should('exist');
  });
});
