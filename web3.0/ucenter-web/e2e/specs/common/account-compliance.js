import { checkRender } from './utils';
const url = '/account-compliance';

export const checkAccountCompliance = (list = []) => {
  list.forEach((complianceType) => {
    describe(`【${url} 标准: ${complianceType}】`, () => {
      beforeEach(() => {
        cy.login();
        // 监听 /flow/pre 请求
        cy.intercept('POST', '/_api/compliance-center-flow/compliance/flow/pre*').as(
          'postComplianceFlow',
        );
      });
      it(`@level:p0 ${url} ${complianceType} route test`, () => {
        cy.visit(`${url}?complianceType=${complianceType}`);

        // 等待POST请求完成
        cy.wait('@postComplianceFlow');

        // 检查页面正常渲染
        checkRender('[data-inspector="account_compliance_page"]');

        // 检查页面中有正常渲染中台page
        cy.get('[data-pageid]').should('exist');
      });
    });
  });
};
