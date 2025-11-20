describe("/gempool/:coin 页面测试", () => {
  it("gempool detail 页面正常工作 @level:p1", () => {
    cy.visit("/gempool/BN");

    cy.document().its("body").should("not.be.empty");

    cy.get("#gempoolDetailPage").should("exist");

    cy.get('div[data-inspector="inspector_gempoolDetail_banner"]').should(
      "exist"
    );

    cy.get('section[data-inspector="inspector_gempoolDetail_pools"]').should(
      "exist"
    );
  });
});
