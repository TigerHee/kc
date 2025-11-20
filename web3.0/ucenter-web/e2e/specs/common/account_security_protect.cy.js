import { checkRender, createCheckElementEnable, getSiteConfig } from './utils';
import { set } from 'lodash';

export const url = '/account/security/protect';
const replaceUrl = '/account/security';
const inspectorId = 'account_security_protect';
const checkInputEnable = createCheckElementEnable('input');
const checkButtonEnable = createCheckElementEnable();

export function checkPageCanUse(isGlobal = false) {
  beforeEach(() => cy.login());

  it(`未设置过密码`, () => {
    cy.securityMethodsNone();
    (isGlobal
      ? cy.visit(url)
      : cy.getSiteConfig(url, (req) => {
          req.reply((res) => {
            set(res.body, 'data.securityConfig.withdrawPwdOpt', true);
          });
        })
    )
      .then(() => {
        return cy.wait('@securityMethods');
      })
      .then(() => {
        checkRender(`[data-inspector="${inspectorId}"]`);

        cy.validationCodePassed();

        checkInputEnable(inspectorId);
        checkButtonEnable(inspectorId);
      });
  });

  it(`已设置过密码`, () => {
    cy.securityMethodsAll();
    (isGlobal ? cy.visit(url) : cy.getSiteConfig(url))
      .then(() => {
        return cy.wait('@securityMethods');
      })
      .then(() => {
        checkRender(`[data-inspector="${inspectorId}"]`);

        checkInputEnable(inspectorId);
        checkButtonEnable(inspectorId);
      });
  });
}

const interceptSet = () => {
  cy.intercept('/_api/ucenter/user/withdraw-password*', {
    code: '200',
    success: true,
    data: {}
  }).as('set')
}

const interceptUpdate = () => {
  cy.intercept('/_api/ucenter/user/withdraw-password/update*', {
    code: '200',
    success: true,
    data: {}
  }).as('update')
}

const checkReplaceUrl = () => {
  cy.url().should(curUrl => {
    const path = new URL(curUrl).pathname;
    expect(path.endsWith(replaceUrl)).to.be.true;
  });
}

const checkSetPwd = () => {
  cy.securityMethodsNone();
  getSiteConfig(url, siteConfig => {
    if(!siteConfig.securityConfig.withdrawPwdOpt) {
      return checkReplaceUrl();
    }
    cy.validationCodePassed();

    checkRender('.KuxDialog-root');
    cy.get('.KuxDialog-root .KuxButton-containedPrimary').click();
    interceptSet();
    cy.get('#password input:password').type('456321');
    cy.get('#passwordr input:password').type('456321');
    cy.get('#SetForm .KuxButton-containedPrimary').click();
    cy.wait('@set').then(checkReplaceUrl);
  })
}

const checkUpdatePwd = () => {
  cy.securityMethodsAll();
  getSiteConfig(url, siteConfig => {
    if(!siteConfig.securityConfig.withdrawPwdOpt) {
      return checkReplaceUrl();
    }

    checkRender('.KuxDialog-root');
    cy.get('.KuxDialog-root .KuxButton-containedPrimary').click();
    
    interceptUpdate();
    cy.get('#UpdateForm_passwordo input:password').type('666666')
    cy.get('#UpdateForm_password input:password').type('456321');
    cy.get('#UpdateForm_passwordr input:password').type('456321');
    cy.get('#UpdateForm .KuxButton-containedPrimary').click();
    return cy.wait('@update').then(checkReplaceUrl);
  });
}

describe(`【${url}】`, () => {
  beforeEach(() => {
    cy.login();
  });
  
  it('设置交易密码', () => {
    checkSetPwd();
  })

  it('修改交易密码', () => {
    checkUpdatePwd();
  })
});
