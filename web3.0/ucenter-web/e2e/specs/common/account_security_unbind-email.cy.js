import { getSiteConfig } from './utils';

export const url = '/account/security/unbind-email';
const replaceUrl = '/account/security';

const checkReplaceUrl = () => {
  cy.url().should(curUrl => {
    const path = new URL(curUrl).pathname;
    expect(path.endsWith(replaceUrl)).to.be.true;
  });
};

export const checkUnbindEmail = () => {
  cy.intercept('/_api/ucenter/user/email/unbind*', {
    code: '200',
    success: true,
    data: { status: 'success' }
  }).as('unbindEmail')
  getSiteConfig(url, (siteConfig) => {
    if (!siteConfig.securityConfig.emailBindOpt) {
      return checkReplaceUrl();
    }
    cy.validationCodePassed();
    cy.wait('@unbindEmail').then(checkReplaceUrl);
  })
}
