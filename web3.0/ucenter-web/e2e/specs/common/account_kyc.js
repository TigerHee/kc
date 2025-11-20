export const checkPageRedirectToKyc = (url) => {
  describe(`【${url}】`, () => {
    beforeEach(() => cy.login());
    it(`${url} route test`, () => {
      cy.visit(url);

      // 检查页面被重定向到kyc首页
      cy.url().should('include', '/account/kyc');
    });
  });
};
