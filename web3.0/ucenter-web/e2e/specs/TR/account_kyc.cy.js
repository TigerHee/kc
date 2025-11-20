import { checkRender } from '../common/utils';
const url = '/account/kyc';

describe(`【${url}】`, () => {
  beforeEach(() => cy.login());
  it(`@level:p0 ${url} route test`, () => {
    cy.visit(url);

    // 页面 正常渲染
    checkRender('[data-inspector="account_kyc_page"]');

    // FAQ 正常渲染
    checkRender('[data-inspector="account_kyc_faq"]');

    // 检查认证按钮是否存在并点击
    cy.get('body').then(($body) => {
      if ($body.find('[data-inspector="account_kyc_open_modal_btn"]').length > 0) {
        // 按钮存在，点击它
        cy.get('[data-inspector="account_kyc_open_modal_btn"]').click();
      } else {
        // 如果按钮不存在，输出日志信息
        cy.log('KYC open button not found');
      }
    });
  });
});
