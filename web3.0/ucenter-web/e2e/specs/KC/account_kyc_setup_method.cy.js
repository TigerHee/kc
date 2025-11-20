const url = '/account/kyc/setup/method';

describe(`【${url}】`, () => {
  beforeEach(() => {
    cy.login();
    cy.visit(url);
  });

  it('当前设备继续认证', () => {
    cy.get('[data-inspector="account_kyc_setup_method_page"]').should('exist');
    cy.get('[data-inspector="kyc_method_current_device"]').click();
    cy.url().should('include', '/account/kyc/home');
  });
});