/* eslint-disable no-undef */

describe('CDN根据IP封禁巡检', () => {
  beforeEach(() => {
    cy.complianceFree();
  });

  it(`中国大陆 CDN封禁`, () => {
    const url = '/restrict?code=CN&ip=11.22.33.44';
    cy.waitForSSG(url);
    // inspector_cdn_restrict_IP
    cy.get('[data-inspector="inspector_cdn_restrict_IP"]').should('exist');
    cy.get('[data-inspector="inspector_cdn_restrict_cn"]').should('exist');
  });

  it(`美国纽约 CDN封禁`, () => {
    const url = '/restrict?code=US-NY&ip=11.22.33.44';
    cy.waitForSSG(url);
    cy.get('[data-inspector="inspector_cdn_restrict_IP"]').should('exist');
    cy.get('[data-inspector="inspector_cdn_restrict_us-ny"]').should('exist');
  });

  it(`PAGE_COMPLIANCE CDN封禁`, () => {
    const url = '/restrict?code=PAGE_COMPLIANCE&ip=11.22.33.44';
    cy.waitForSSG(url);
    cy.get('[data-inspector="inspector_cdn_restrict_IP"]').should('exist');
    cy.get('[data-inspector="inspector_cdn_restrict_PAGE_COMPLIANCE"]').should('exist');
  });

  it(`CDN_FORBIDDEN CDN封禁`, () => {
    const url = '/restrict?code=CDN_FORBIDDEN&ip=11.22.33.44';
    cy.waitForSSG(url);
    cy.get('[data-inspector="inspector_cdn_restrict_IP"]').should('exist');
    cy.get('[data-inspector="inspector_cdn_restrict_CDN_FORBIDDEN"]').should('exist');
  });
});
