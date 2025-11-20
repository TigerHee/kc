import { checkRender, interceptUpload, interceptCheckValidations } from "./utils";

export const url = '/ucenter/reset-g2fa/login';

const interceptResult = () => {
  cy.intercept('/_api/ucenter/apply/g2fa-result*', {
    code: '200',
    success: true,
    data: {}
  }).as('result')
}

const interceptQuestion = () => {
  cy.intercept('/_api/ucenter/self/security/query/question/REBINDING_GOOGLE_2FA/login*', {
    success: true,
    code: '200',
    items: [
      {
        id: '4',
        name: null,
        score: 40,
        options: [
          {
            id: '16',
            option: '>=500',
          },
          {
            id: '9',
            option: '0-20',
          },
          {
            id: '12',
            option: '100-200',
          },
          {
            id: '10',
            option: '20-50',
          },
          {
            id: '13',
            option: '300-300',
          },
          {
            id: '14',
            option: '300-400',
          },
          {
            id: '15',
            option: '400-500',
          },
          {
            id: '11',
            option: '50-100',
          },
        ],
      },
      {
        id: '6',
        name: null,
        score: 40,
        options: [
          {
            id: '18',
            option: '基础认证',
          },
          {
            id: '19',
            option: '基础认证失败',
          },
          {
            id: '20',
            option: '完成高级认证',
          },
          {
            id: '17',
            option: '没有认证',
          },
          {
            id: '21',
            option: '等待审核',
          },
          {
            id: '22',
            option: '高级认证失败',
          },
        ],
      },
      {
        id: '2',
        name: null,
        score: 30,
        options: [
          {
            id: 'NONE',
            option: 'NONE',
          },
          {
            id: 'OSMO1123',
            option: 'OSMO1123',
          },
          {
            id: 'XMR',
            option: 'XMR',
          },
          {
            id: 'CSP',
            option: 'CSP',
          },
          {
            id: 'LOKI',
            option: 'LOKI',
          },
          {
            id: 'HOT',
            option: 'HOT',
          },
          {
            id: 'NRG',
            option: 'NRG',
          },
          {
            id: 'FET',
            option: 'FET',
          },
        ],
      },
    ],
  }).as('question')
}

const interceptVerifyCode = () => {
  cy.intercept('/_api/ucenter/verify-validation-code*', {
    code: '200',
    success: true,
  })
}

const interceptReset = () => {
  cy.intercept('/_api/ucenter/g2fa/reset*', {
    code: '200',
    success: true,
    data: {}
  }).as('reset');
}

const checkUpload = (callback) => {
  // 上传身份证件
  interceptUpload('#frontPic', () => {
    interceptUpload('#backPic', () => {
      interceptUpload('#handPic', () => {
        cy.wait(100);
        cy.get('[data-testid="authentication-submit"]').click();
        callback();
      })
    });
  });
}

const interceptApply = () => {
  cy.intercept('/_api/ucenter/g2fa/apply*', {
    code: '200',
    success: true,
    data: {}
  })
}

const checkResetByPhone = () => {
  it('通过手机重置谷歌验证', () => {
    interceptResult();
    interceptReset();

    cy.wait('@checkValidations').then(() => {
      cy.get('[data-inspector="select_type_my_sms"]').click();
      cy.get('.KuxButton-containedPrimary').click();
      // 通过安全验证
      cy.validationCodePassed();
      cy.get('[data-inspector="sec_form_submit"]').click();
      cy.wait('@reset').then(() => {
        checkRender('[data-inspector="finish_auto_adoption"]');
      });
    });
  });
}

const checkResetByPhoneNotAvailable = () => {
  it('手机不可用', () => {
    interceptResult();
    interceptReset();
    interceptQuestion();
    interceptVerifyCode();
    interceptApply();

    cy.wait('@checkValidations').then(() => {
      cy.get('[data-inspector="select_type_self_question"]').click();
      cy.get('.KuxButton-containedPrimary').click();
      cy.wait('@question').then(() => {
        cy.get('[data-inspector="question-option-9"]').click();
        cy.get('[data-inspector="question-option-17"]').click();
        cy.get('[data-inspector="question-option-NONE"]').click();
        cy.get('.KuxButton-containedPrimary').click();
        checkUpload(() => checkRender('[data-inspector="finish_wait"]'));
      });
    });
  });
}

const checkResetByEmail = () => {
  it('通过邮箱重置交易密码', () => {
  
    interceptResult();
    interceptApply();

    cy.wait('@checkValidations').then(() => {
      cy.get('[data-inspector="select_type_my_email"]').click();
      cy.get('.KuxButton-containedPrimary').click();
      cy.validationCodePassed();
      cy.get('[data-inspector="sec_form_submit"]').click();
      checkUpload(() => checkRender('[data-inspector="finish_wait"]'));
    });
  })
}

const checkResetByPhoneAndTP = () => {
  it('通过手机和交易密码重置谷歌验证', () => {
    interceptResult();
    interceptReset();

    cy.wait('@checkValidations').then(() => {
      cy.get('[data-inspector="select_type_my_sms+withdraw_password"]').click();
      cy.get('.KuxButton-containedPrimary').click();
      cy.validationCodePassed();
      cy.wait('@reset').then(() => checkRender('[data-inspector="finish_auto_adoption"]'))
    });
  });
}

describe(`【${url}】`, () => {
  describe('仅绑定手机', () => {
    beforeEach(() => {
      cy.login();
      cy.visit(url);
      interceptCheckValidations([['my_sms'], ['self_question']]);
    });

    checkResetByPhone();

    checkResetByPhoneNotAvailable();
  });

  describe('仅绑定手机+邮箱', () => {
    beforeEach(() => {
      cy.login();
      cy.visit(url);
      interceptCheckValidations([['my_email'], ['my_sms']]);
    });

    checkResetByPhone();

    checkResetByEmail();
  });

  describe('仅绑定手机+交易密码', () => {
    beforeEach(() => {
      cy.login();
      cy.visit(url);
      interceptCheckValidations([['self_question'], ['my_sms', 'withdraw_password']]);
    });

    checkResetByPhoneAndTP();

    checkResetByPhoneNotAvailable();
  })

  describe('手机+邮箱+交易密码', () => {
    beforeEach(() => {
      cy.login();
      cy.visit(url);
      interceptCheckValidations([
        ['my_sms', 'withdraw_password'],
        ['my_email', 'withdraw_password'],
      ]);
    });

    checkResetByPhoneAndTP();

    it('通过邮箱和交易密码重置谷歌验证', () => {
      interceptResult();
      interceptReset();
      interceptApply();

      cy.wait('@checkValidations').then(() => {
        cy.get('[data-inspector="select_type_my_email+withdraw_password"]').click();
        cy.get('.KuxButton-containedPrimary').click();
        cy.validationCodePassed();
        checkUpload(() => checkRender('[data-inspector="finish_wait"]'));
      });
    });
  })
});