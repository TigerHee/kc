import { checkRender, interceptUpload } from './utils';

const url = '/freeze';
const inspectorId = 'unfreeze_page';
const applyBtnInspectorId = 'unfreeze_apply_button';

const interceptFrozen = (timeout) => {
  cy.intercept('/_api/ucenter/user/locale*', {
    code: '4111',
    data: timeout.toString(),
    msg: '',
    success: false,
  });
  cy.intercept('/_api/ucenter/is-frozen*', {
    code: '200',
    success: true,
    data: {
      email: "cy**@**.com",
      frozen: true,
      remainingTime: 0
    }
  });
  cy.intercept('/_api/ucenter/user-info*', (req) => {
    req.reply((res) => {
      // 3 是用户冻结态
      res.body.data.status = 3;
    });
  });
};

const interceptApply = () => {
  cy.intercept('/_api/ucenter/unforbidden/apply*', {
    code: '200',
    success: true,
    data: {}
  })
}

describe(`【${url}】`, () => {
  beforeEach(() => {
    cy.login();
    cy.requiredValidationsAll();
  });

  it('已过24h，可申请解冻', () => {
    interceptFrozen(0);
    interceptApply();
    cy.visit(url);
    checkRender(`[data-inspector="${inspectorId}"]`);
    // 申请按钮可用
    cy.get(`[data-inspector="${applyBtnInspectorId}"]`).should('not.be.disabled');
    cy.get(`[data-inspector="${applyBtnInspectorId}"]`).click();
    // 跳到解冻申请页面前需要安全认证
    cy.validationCodePassed();
    // 检查解冻申请页面是否正确渲染
    cy.url().should('include', '/freeze/apply');
    checkRender(`[data-inspector="account_security_forget"]`);
    interceptUpload('#frontPic', () => {
      interceptUpload('#backPic', () => {
        interceptUpload('#handPic', () => {
          cy.wait(100);
          cy.get('[data-testid="authentication-submit"]').click();
          checkRender('[data-inspector="applyUnfreeze_wait"]');
        })
      })
    });
  });

  it('未过24h，不可申请解冻', () => {
    interceptFrozen(86400000);
    cy.visit(url);
    checkRender(`[data-inspector="${inspectorId}"]`);
    cy.get(`[data-inspector="${applyBtnInspectorId}"]`).should('be.disabled');
  });
});
