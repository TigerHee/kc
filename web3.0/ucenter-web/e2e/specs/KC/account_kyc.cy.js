import { checkRender } from '../common/utils';
const url = '/account/kyc';

const KYC_INSPECTOR_ID = '[data-inspector="account_kyc_personal"]';
const KYB_INSPECTOR_ID = '[data-inspector="account_kyc_institution"]';

const visitKycKybHomePage = () => {
  // 拦截 kyc 结果查询接口，覆写为未认证状态
  cy.intercept('/_api//kyc/web/kyc/result/personal*', (req) => {
    req.reply((res) => {
      res.body.data.type = -1;
      res.body.data.verifyStatus = -1;
      res.body.data.primaryVerifyStatus = -1;
    });
  }).as('kycResultPersonal');
  cy.visit(url);
  return cy.wait('@kycResultPersonal');
}

describe(`【${url}】`, () => {
  beforeEach(() => cy.login());
  it(`@level:p0 Authentication not started`, () => {
    visitKycKybHomePage().then(() => {
      // 页面 正常渲染
      checkRender('[data-inspector="account_kyc_page"]');
      // FAQ 正常渲染
      checkRender('[data-inspector="account_kyc_faq"]');
      // KYC 入口正常渲染
      checkRender(KYC_INSPECTOR_ID);
      // KYB 入口正常渲染
      checkRender(KYB_INSPECTOR_ID);
    });
  });

  it('@level:p0 KYC functionality available', () => {
    visitKycKybHomePage().then(() => {
      // 点击 KYC 认证
      cy.get(KYC_INSPECTOR_ID).click();
      // 跳到国家/证件选择页面
      cy.url().should('include', '/account/kyc/setup/country-of-issue');
    })
  });

  it(`@level:p0 KYB functionality available`, () => {
    visitKycKybHomePage().then(() => {
      // 点击 KYB 认证
      cy.get(KYB_INSPECTOR_ID).click();
      cy.url().should('include', '/account/kyb/setup');
    })
  });
});
