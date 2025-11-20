import { checkRender, interceptCountryCode, interceptUpload, interceptCheckValidations } from './utils';

const url = '/ucenter/rebind-phone/login';

const interceptResult = () => {
  cy.intercept('/_api/ucenter/apply/rebind-phone-result*', {
    code: '200',
    success: true,
    data: {}
  }).as('result')
}

const interceptApply = () => {
  cy.intercept('/_api/ucenter/rebind-phone/apply*', {
    code: '200',
    success: true,
    data: {},
  }).as('apply');
};

const interceptVerifyCode = () => {
  cy.intercept('/_api/ucenter/verify-validation-code*', {
    code: '200',
    success: true,
  })
}

const interceptQuestion = () => {
  cy.intercept('/_api/ucenter/self/security/query/question/REBINDING_PHONE/login*', {
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
  }).as('question');
};

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

const checkBindNewPhone = () => {
  cy.get(`[data-inspector="country-selector"]`).click();
  cy.get('.KuxSelect-panelContainer').should('exist');
  cy.wait(100);
  cy.get('.KuxSelect-optionItem').first().click();
  cy.get('#phone input').type('123456789000');
  cy.get('#code input').type('666666');
  cy.get('.KuxButton-containedPrimary').click();
  cy.wait('@apply').then(() => {
    checkRender('[data-inspector="finish_wait"]');
  });
}

describe(`【${url}】`, () => {
  beforeEach(() => {
    cy.login();
    cy.visit(url);
  });
  
  describe('只有交易密码', () => {
    it('通过交易密码重置手机号', () => {  
      interceptResult(); 
      interceptCheckValidations([['self_question'], ['withdraw_password']]);
      interceptCountryCode();
      interceptApply();

      cy.wait('@checkValidations')
        .then(() => {
          cy.get('[data-inspector="select_type_trade"]').click();
          cy.get('.KuxButton-containedPrimary').click();
          // 通过安全验证
          cy.validationCodePassed();
          cy.get('[data-inspector="sec_form_submit"]').click();
          checkUpload(checkBindNewPhone);
        });
    });
    it('忘记交易密码', () => {
      interceptResult();
      interceptCheckValidations([['self_question'], ['withdraw_password']]);
      interceptQuestion();
      interceptVerifyCode();
      interceptCountryCode();
      interceptApply();

      cy.wait('@checkValidations')
        .then(() => {
          cy.get('[data-inspector="select_type_trade_unavailable"]').click();
          cy.get('.KuxButton-containedPrimary').click();
          cy.wait('@question').then(() => {
            cy.get('[data-inspector="question-option-9"]').click();
            cy.get('[data-inspector="question-option-17"]').click();
            cy.get('[data-inspector="question-option-NONE"]').click();
            cy.get('.KuxButton-containedPrimary').click();
            checkUpload(checkBindNewPhone);
          });
        });
    });
  });

  describe('有绑定邮箱', () => {
    it('通过邮箱重置手机号', () => {
      interceptResult();
      interceptCheckValidations([['my_email']]);
      interceptApply();

      cy.validationCodePassed();
      cy.get('[data-inspector="sec_form_submit"]').click();

      cy.wait('@verifyCode')
        .then(() => checkUpload(checkBindNewPhone));
    })
  })
});