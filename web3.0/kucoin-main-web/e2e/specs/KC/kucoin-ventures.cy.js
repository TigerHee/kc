describe('/kucoin-ventures 页面测试 未登录', () => {
  it('/kucoin-ventures 页面正常工作', () => {
    cy.visit('/kucoin-ventures');
    cy.get("[data-inspector='ventures_page']").should('exist');
    cy.get("[data-inspector='ventures_page_banner']").should('exist');
    cy.get("[data-inspector='ventures_story']").should('exist');
    cy.get("[data-inspector='ventures_portfolio']").should('exist');
  });
});

describe('/kucoin-ventures 页面测试 已登录', () => {
  beforeEach(() => {
    cy.login();
  });

  it('/kucoin-ventures 页面正常工作', () => {
    cy.visit('/kucoin-ventures');
    cy.get("[data-inspector='ventures_page']").should('exist');
    cy.get("[data-inspector='ventures_page_banner']").should('exist');
    cy.get("[data-inspector='ventures_story']").should('exist');
    cy.get("[data-inspector='ventures_portfolio']").should('exist');
  });
});
