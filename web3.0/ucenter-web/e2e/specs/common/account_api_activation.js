const url = '/account/api/activation';
describe(`【${url}】`, () => {
  beforeEach(() => cy.login());
  it(`${url} route test`, () => {
    cy.visit(url);
    cy.get('[data-inspector="api_activation_page"]').should('exist');
  });
});
