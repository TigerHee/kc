import { checkRender, getSiteConfig } from './utils';

const url = '/account/security/g2fa';
const replaceUrl = '/account/security';

const checkBindG2FA = () => {
  cy.intercept('/_api/ucenter/user/google2fa*', {
    code: '200',
    success: true,
  });
  cy.intercept('/_api/ucenter/user/google2fa/update*', {
    code: '200',
    success: true,
  }).as('bind');

  getSiteConfig(url, (siteConfig) => {
    if (!siteConfig.securityConfig.google2faOpt) {
      cy.url().should(curUrl => {
        const path = new URL(curUrl).pathname;
        expect(path.endsWith(replaceUrl)).to.be.true;
      });
      return;
    }
    cy.validationCodePassed();
    checkRender('[data-inspector="bind-g2fa-form-qrcode"] canvas');
    checkRender('[data-inspector="bind-g2fa-form-code"]');
    checkRender('[data-inspector="bind-g2fa-form-copy"]');
    cy.get('#code input').type('666666');
    cy.get('[data-inspector="bind-g2fa-confirm"]').click();
    cy.wait('@bind');
  });
}

describe(`【${url}】`, () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/account/security');
  });
  it('谷歌验证绑定', () => {
    checkBindG2FA();
  });
});
