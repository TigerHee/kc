describe('best-crypto-exchanges-award-2021-kucoin 页面测试 未登录', () => {
    it('best-crypto-exchanges-award-2021-kucoin 页面正常工作', () => {
        cy.visit('/best-crypto-exchanges-award-2021-kucoin');
        cy.get("[data-inspector='forbes_advisor_page']").should('exist');
        cy.get("[data-inspector='forbes_advisor_page_head']").should('exist');
        cy.get("[data-inspector='forbes_advisor_page_main']").should('exist');
    });
});

describe('best-crypto-exchanges-award-2021-kucoin 页面测试 已登录', () => {
    beforeEach(() => {
      cy.login();
    });
  
    it('best-crypto-exchanges-award-2021-kucoin 页面正常工作', () => {
        cy.visit('/best-crypto-exchanges-award-2021-kucoin');
        cy.get("[data-inspector='forbes_advisor_page']").should('exist');
        cy.get("[data-inspector='forbes_advisor_page_head']").should('exist');
        cy.get("[data-inspector='forbes_advisor_page_main']").should('exist');
    });
  })
  