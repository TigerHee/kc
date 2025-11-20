/* eslint-disable no-undef */

const url = '/';

describe(`【${url}】`, () => {
  beforeEach(() => {
    // 日本用户访问
    cy.countryJP();
    cy.complianceFree();
  });

  it(`${url} 土耳其 header`, () => {
    cy.waitForSSG(url);
    // 检查主站header search不展示
    cy.get('[data-inspector="inspector_header_search"]').should('exist');
    cy.get('[data-inspector="header_login"]').should('exist');
    cy.get('[data-inspector="header_signup"]').should('exist');

    // inspector_header_theme
    cy.get('[data-inspector="inspector_header_download_box"]').should('exist');
    cy.get('[data-inspector="inspector_header_theme"]').should('not.exist');
  });
});
