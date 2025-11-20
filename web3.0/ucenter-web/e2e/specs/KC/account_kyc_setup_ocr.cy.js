const url = '/account/kyc/setup/ocr';

describe(`【${url}】`, () => {
  beforeEach(() => {
    cy.login();
  });

  it('渲染证件提示页', () => {
    cy.visit(url);
    cy.get('[data-inspector="account_kyc_setup_ocr"]').should('exist');
  });
});