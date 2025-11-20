import { set } from 'lodash';

const url = '/account/security/safeWord';
const replaceUrl = '/account/security';
const inspectorId = 'account_security_safeword';

describe(`【${url}】`, () => {
  beforeEach(() => cy.login());

  it(`siteConfig.securityConfig.antiPhishingCodeOpt is true`, () => {
    cy.getSiteConfig(url, (req) => {
      req.reply((res) => {
        set(res.body, 'data.securityConfig.antiPhishingCodeOpt', true);
      });
    }).then(() => {
      cy.get(`[data-inspector="${inspectorId}"]`).should('exist');
    });
  });

  it(`siteConfig.securityConfig.antiPhishingCodeOpt is false`, () => {
    cy.getSiteConfig(url, (req) => {
      req.reply((res) => {
        set(res.body, 'data.securityConfig.antiPhishingCodeOpt', false);
      });
    }).then(() => {
      cy.url().should((curUrl) => {
        const path = new URL(curUrl).pathname;
        expect(path.endsWith(replaceUrl)).to.be.true;
      });
    });
  });
});
