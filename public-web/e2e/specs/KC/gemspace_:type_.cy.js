describe("/gemspace 页面测试", () => {
  it("gemspace ongoing 页面正常工作 @level:p1", () => {
    cy.visit("/gemspace/ongoing");

    cy.document().its("body").should("not.be.empty");

    cy.get('#gemspacePage').should('exist');

    cy.get('div[data-inspector="inspector_gemspace_banner"]').should("exist");

    cy.get('section[data-inspector="inspector_gemspace_content"]').should("exist");

    cy.get('div[data-inspector="inspector_gemspace_tab"]').should("exist");

    cy.get('section[data-inspector="inspector_gemspace_faq"]').should("exist");

  });

  it("gemspace newlisting 页面正常工作 @level:p1", () => {
    cy.visit("/gemspace/newlisting");

    cy.document().its("body").should("not.be.empty");

    cy.get('#gemspacePage').should('exist');

    cy.get('div[data-inspector="inspector_gemspace_banner"]').should("exist");

    cy.get('section[data-inspector="inspector_gemspace_content"]').should("exist");

    cy.get('div[data-inspector="inspector_gemspace_tab"]').should("exist");

    cy.get('section[data-inspector="inspector_gemspace_newlisting_table"]').should("exist");

    cy.get('section[data-inspector="inspector_gemspace_faq"]').should("exist");

  });
});
