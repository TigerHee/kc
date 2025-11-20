const url = '/account/kyc/home';
const KYC_MODAL_INSPECTOR_ID = '[data-inspector="account_kyc_verify_modal"]';

/** 拦截 kyc 状态查询 */
const interceptResult = (callback) => {
  cy.intercept('/_api/kyc/web/kyc/result/personal*', callback).as('result')
}

describe(`【${url}】`, () => {
  beforeEach(() => {
    cy.login();
  });

  it('kyc 未认证', () => {
    interceptResult((req) => {
      req.reply((res) => {
        // 状态：kyc 未认证
        res.body.data.type = 0;
        res.body.data.verifyStatus = -1;
        res.body.data.primaryVerifyStatus = 0;
      });
    });
    cy.visit(url);
    // 跳回入口页
    cy.url().should(curUrl => {
      const path = new URL(curUrl).pathname;
      expect(path.endsWith('/account/kyc')).to.be.true;
    });
  });

  it('kyc 取消认证', () => {
    interceptResult((req) => {
      req.reply((res) => {
        // 状态：kyc 认证失败
        res.body.data.type = 0;
        res.body.data.verifyStatus = 2;
        res.body.data.primaryVerifyStatus = 0;
      });
    });
    cy.visit(url);
    cy.wait('@result');
    cy.get('[data-testid="back"]').click();
    // 跳回入口页
    cy.url().should(curUrl => {
      const path = new URL(curUrl).pathname;
      expect(path.endsWith('/account/kyc')).to.be.true;
    });
  });

  it('kyc 认证中', () => {
    interceptResult((req) => {
      req.reply((res) => {
        // 状态：kyc 认证中
        res.body.data.type = 0;
        res.body.data.verifyStatus = 0;
        res.body.data.primaryVerifyStatus = 0;
      });
    });
    cy.visit(url);
    cy.wait('@result');
    cy.get('.KuxButton-contained').click();
    cy.get('[data-inspector="inspector_home_banner"]').should('exist');
  });

  it('kyc 认证成功', () => {
    interceptResult((req) => {
      req.reply((res) => {
        // 状态：kyc 认证成功
        res.body.data.type = 0;
        res.body.data.verifyStatus = 1;
        res.body.data.primaryVerifyStatus = 0;
        res.body.data.regionType = 3;
      });
    });
    cy.visit(url);
    cy.wait('@result');
    cy.get('.KuxButton-contained').click();
    cy.url().should('include', '/assets/coin');
  });

  it('kyc 认证失败', () => {
    interceptResult((req) => {
      req.reply((res) => {
        // 状态：kyc 认证失败
        res.body.data.type = 0;
        res.body.data.verifyStatus = 2;
        res.body.data.primaryVerifyStatus = 0;
      });
    });
    cy.visit(url);
    cy.wait('@result');
    cy.get('.KuxButton-containedPrimary').click();
    cy.url().should('include', '/account/kyc/setup/country-of-issue');
  });
});