import { getSiteConfig } from './utils';

export const url = '/account/security/unbind-phone';
const replaceUrl = '/account/security';

const checkReplaceUrl = () => {
  cy.url().should(curUrl => {
    const path = new URL(curUrl).pathname;
    expect(path.endsWith(replaceUrl)).to.be.true;
  });
};

export const checkUnbindPhone = () => {
  cy.intercept('/_api/ucenter/user/phone/unbind*', {
    code: '200',
    success: true,
    data: { status: 'success' }
  }).as('unbindPhone')
  getSiteConfig(url, (siteConfig) => {
    if (!siteConfig.securityConfig.phoneBindOpt) {
      return checkReplaceUrl();
    }
    cy.validationCodePassed();
    cy.wait('@unbindPhone').then(checkReplaceUrl);
  });
}
