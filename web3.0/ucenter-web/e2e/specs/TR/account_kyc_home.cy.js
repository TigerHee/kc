const url = '/account/kyc/home';

describe(`【${url}】`, () => {
  beforeEach(() => {
    cy.login();
    cy.visit(url);
  });

  it('非主站未开放此功能', () => {
    cy.url().should('include', '/404');
  });
});