const url = '/ucenter/reset-password';
describe(`【${url}】`, () => {
  it(`${url} route test`, () => {
    cy.visit(url);
    cy.get('[data-inspector="reset_password_page"]').should('exist');
  });
});
