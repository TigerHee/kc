import { getSiteConfig } from './utils';

const url = '/account/security/updatepwd';
const replaceUrl = '/account/security';

const MOCK_TOKEN = '1234567890';
// 检查是否跳转到安全设置页面
const checkReplaceUrl = () => {
  cy.url().should((curUrl) => {
    const path = new URL(curUrl).pathname;
    expect(path.endsWith(replaceUrl)).to.be.true;
  });
};

// 拦截修改密码接口
const interceptUpdate = () => {
  cy.intercept('/_api/ucenter/user/password/update*', {
    code: '200',
    success: true,
    data: {},
  }).as('updatePassword');
};

// 拦截设置密码接口
const interceptSet = () => {
  cy.intercept('/_api/ucenter/user/password*', {
    code: '200',
    success: true,
    data: {},
  }).as('setPassword');
};

// 拦截安全验证接口
const interceptVerify = () => {
  cy.intercept('/_api/risk-validation-center/v1/security/validation/combine*', {
    code: '200',
    success: true,
    data: { needVerify: false, token: MOCK_TOKEN, best: [], others: [], transactionId: '' },
  }).as('riskValidation');
};

describe(`【${url}】修改/设置密码页面`, () => {
  beforeEach(() => {
    cy.login();
  });

  it('成功修改密码', () => {
    interceptUpdate();
    getSiteConfig(url, (siteConfig) => {
      if (!siteConfig.securityConfig.loginPwdOpt) {
        return checkReplaceUrl();
      }
    });
    // 输入有效的密码组合
    cy.get('#oldPassword input:password').type('OldPassword123!');
    cy.get('#newPassword input:password').type('NewPassword123!');
    cy.get('#newPassword2 input:password').type('NewPassword123!');
    cy.get('[data-inspector="update_password_submit_btn"]').click();

    // 验证跳转
    checkReplaceUrl();
  });

  it('新旧密码相同时显示错误提示', () => {
    interceptUpdate();
    getSiteConfig(url, (siteConfig) => {
      if (!siteConfig.securityConfig.loginPwdOpt) {
        return checkReplaceUrl();
      }
    });
    const samePassword = 'Password123!';
    cy.get('#oldPassword input:password').type(samePassword);
    cy.get('#newPassword input:password').type(samePassword);
    cy.get('[data-inspector="password_error_msg"]').should('be.visible');
  });

  it('两次输入的新密码不一致时显示错误提示', () => {
    interceptUpdate();
    getSiteConfig(url, (siteConfig) => {
      if (!siteConfig.securityConfig.loginPwdOpt) {
        return checkReplaceUrl();
      }
    });
    cy.get('#newPassword input:password').type('NewPassword123!');
    cy.get('#newPassword2 input:password').type('DifferentPassword123!');
    cy.get('.KuxForm-itemError').should('be.visible');
  });

  it('密码不符合规则时显示错误提示', () => {
    interceptUpdate();
    getSiteConfig(url, (siteConfig) => {
      if (!siteConfig.securityConfig.loginPwdOpt) {
        return checkReplaceUrl();
      }
    });
    cy.get('#newPassword input:password').type('weak');
    cy.get('[data-inspector="password_error_msg"]').should('be.visible');
  });

  it('成功设置新密码', () => {
    // 模拟无密码状态
    cy.intercept('/_api/ucenter/user-info*', (req) => {
      req.reply((res) => {
        res.body.data.existLoginPsd = false;
      });
    });
    interceptSet();
    interceptVerify();
    getSiteConfig(url, (siteConfig) => {
      if (!siteConfig.securityConfig.loginPwdOpt) {
        return checkReplaceUrl();
      }
    });
    cy.get('#newPassword input:password').type('NewPassword123!');
    cy.get('#newPassword2 input:password').type('NewPassword123!');
    cy.get('.KuxButton-containedPrimary').click();

    // 等待安全验证
    cy.wait('@riskValidation');

    // 验证设置密码请求
    cy.wait('@setPassword')

    checkReplaceUrl();
  });

  it('设置密码时不显示旧密码输入框', () => {
    // 模拟无密码状态
    cy.intercept('/_api/ucenter/user-info*', (req) => {
      req.reply((res) => {
        res.body.data.existLoginPsd = false;
      });
    });
    interceptSet();
    interceptVerify();
    getSiteConfig(url, (siteConfig) => {
      if (!siteConfig.securityConfig.loginPwdOpt) {
        return checkReplaceUrl();
      }
    });
    cy.get('#oldPassword').should('not.exist');
  });
});
