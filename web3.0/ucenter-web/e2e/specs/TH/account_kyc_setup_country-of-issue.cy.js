const url = '/account/kyc/setup/country-of-issue';

describe(`【${url}】`, () => {
  beforeEach(() => {
    cy.login();
  });

  it('非主站未开放此功能', () => {
    cy.visit(url);
    cy.url().should('include', '/404');
  });
});