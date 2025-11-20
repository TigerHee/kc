const url = '/legal/requests';
describe(`【${url}】`, () => {
  it(`${url} route test`, () => {
    cy.visit(url);
    cy.get('form button').should('exist');
  });
});
