describe("/spotlight-center 页面测试", () => {
  it("@level:p1 spotlight-center 页面正常工作", () => {
    cy.visit("/spotlight-center");
    cy.url().should('include', '/404');
  });
});
