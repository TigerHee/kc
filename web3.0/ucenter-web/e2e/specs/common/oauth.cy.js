import { checkRender, createCheckElementEnable } from './utils';

const url = '/oauth';
const inspectorId = 'oauth_page';
const confirmBtnSelector = 'button.oauth_authorize_submit';
const agreeCheckboxSelector = '.oauth_authorize_agree input[type="checkbox"]';

const checkConfirmBtnDisable = () =>
  createCheckElementEnable(confirmBtnSelector, false)(inspectorId);
const checkConfirmBtnEnable = () => createCheckElementEnable(confirmBtnSelector)(inspectorId);
const clickElement = (selector) => cy.get(`[data-inspector="${inspectorId}"] ${selector}`).click();
const intercept = (path, data) =>
  cy.intercept(`${path}*`, {
    statusCode: 200,
    body: {
      success: true,
      code: '200',
      data,
    },
  });

describe(`【${url}】`, () => {
  it('no login', () => {
    cy.visit(url);
    // 未登陆时展示登陆界面
    checkRender(`[data-inspector="${inspectorId}"] #loginFormContainer`);
  });
});

describe('is login', () => {
  beforeEach(() => {
    cy.login();
    cy.visit(url);
  });

  it('have notice, have security verify', () => {
    checkRender(`[data-inspector="${inspectorId}"]`);
    // 未同意前，【确认授权】按钮不可用
    checkConfirmBtnDisable();
    clickElement(agreeCheckboxSelector);
    // 同意后，【确认授权】按钮可用
    checkConfirmBtnEnable();
    // 拦截auth-check接口，【确认授权】前需要弹窗提示
    const notice = 'test';
    intercept('/_oauth/auth-check', {
      showNotice: true,
      noticeList: [notice],
    });
    clickElement(confirmBtnSelector);
    // 检查 notice
    cy.get('.KuxDialog-content>div>div').should('have.text', notice);
    const MOCK_TOKEN = '1234567890';
    cy.intercept('/_api/risk-validation-center/v1/security/validation/combine*', {
      code: '200',
      success: true,
      data: { needVerify: false, token: MOCK_TOKEN, best: [], others: [], transactionId: '' },
    }).as('riskValidation');
    // 再次拦截auth-code接口，安全认证后会再次调用，返回重定向地址
    intercept('/_oauth/v2/auth-code', {
      location: '/account',
    }).as('authCode');
    // 点击确认，发起auth-code接口请求
    cy.get('.KuxDialog-content button.KuxButton-contained').click();
    cy.wait('@riskValidation')
      .then(() => {
        return cy.wait('@authCode');
      })
      .then(() => {
        cy.url().should((curUrl) => {
          const path = new URL(curUrl).pathname;
          // 检查重定向后的url
          expect(path.endsWith('/account')).to.be.true;
        });
      });
  });

  it('no notice, no security verify', () => {
    // 拦截auth-check接口，【确认授权】前不需要弹窗提示
    intercept('/_oauth/auth-check', {
      showNotice: false,
      noticeList: [],
    });
    const MOCK_TOKEN = '1234567890';
    cy.intercept('/_api/risk-validation-center/v1/security/validation/combine*', {
      code: '200',
      success: true,
      data: { needVerify: false, token: MOCK_TOKEN, best: [], others: [], transactionId: '' },
    }).as('riskValidation');
    // 再次拦截auth-code接口，安全认证后会再次调用，返回重定向地址
    intercept('/_oauth/v2/auth-code', {
      location: '/account',
    }).as('authCode');
    checkRender(`[data-inspector="${inspectorId}"]`);
    checkConfirmBtnDisable();
    clickElement(agreeCheckboxSelector);
    checkConfirmBtnEnable();
    clickElement(confirmBtnSelector);
    cy.wait('@riskValidation')
      .then(() => {
        return cy.wait('@authCode');
      })
      .then(() => {
        cy.url().should((curUrl) => {
          const path = new URL(curUrl).pathname;
          // 检查重定向后的url
          expect(path.endsWith('/account')).to.be.true;
        });
      });
  });
});
