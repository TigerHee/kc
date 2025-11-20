const url = '/account/api/edit/presecurity';
describe(`【${url}】`, () => {
  beforeEach(() => cy.login());
  it(`${url} route test`, () => {
    cy.visit(url);
    cy.get('[data-inspector="api_edit_presecurity_page"]').should('exist');
  });
});
