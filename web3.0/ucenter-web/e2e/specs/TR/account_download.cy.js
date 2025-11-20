const url = '/account/download';
describe(`【${url}】`, () => {
  beforeEach(() => cy.login());
  it(`${url} route test`, () => {
    cy.visit(url);
    cy.get('[data-inspector="account_download_page"]').should('exist');

    // 賬單導出按钮
    cy.get('[data-inspector="bill_export_btn"]').should('exist').click();
    // 賬單導出抽屉内容存在
    cy.get('[data-inspector="bill_export_drawer"]').should('exist');
  });
});
