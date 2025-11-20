import { getFormDataValue, getSiteConfig } from './utils';

export const url = '/account/security/email';
const replaceUrl = '/account/security';
const MOCK_EMAIL = 'demo@kc.com';
const MOCK_CODE = '666666';

const checkBindEmail = () => {
  cy.intercept('/_api/ucenter/bind-email/code*', {
    code: '200',
    success: true
  }).as('sendCode');
  cy.intercept('/_api/ucenter/user/email/update*', {
    code: '200',
    success: true
  }).as('bindEmail');
  getSiteConfig(url, (siteConfig) => {
    if (siteConfig.securityConfig.emailBindOpt) {
      cy.validationCodePassed();
      cy.get('#email input').type('demo@kc.com');
      cy.get('#code .KuxInput-suffix').click();
      cy.wait('@sendCode').then((interception) => {
        const requestBody = interception.request.body;
        expect(getFormDataValue(requestBody, 'email')).to.include(MOCK_EMAIL);
        expect(getFormDataValue(requestBody, 'bizType')).to.include('UPDATE_EMAIL');
        cy.get('#code input').type(MOCK_CODE);
        cy.get('.KuxButton-contained').click();
        cy.wait('@bindEmail').then((interception) => {
          const requestBody = interception.request.body;
          expect(getFormDataValue(requestBody, 'email')).to.include(MOCK_EMAIL);
          expect(getFormDataValue(requestBody, 'code')).to.include(MOCK_CODE);
        });
      });
    } else {
      cy.url().should(curUrl => {
        const path = new URL(curUrl).pathname;
        expect(path.endsWith(replaceUrl)).to.be.true;
      });
    }
  })
}

describe(`【${url}】`, () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/account/security');
  });

  it('绑定邮箱', () => {
    cy.securityMethodsNone();
    checkBindEmail();
  });

  it('修改邮箱', () => {
    cy.securityMethodsAll();
    checkBindEmail();
  });
});
