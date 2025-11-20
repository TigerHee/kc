const url = '/authorize-result';
const inspectorId = 'authorize_result_page';
const verifyToken = 'xxxxx';
const STATUS_LIST = ['failed', 'success', 'expired'];

describe(`【${url}】`, () => {
  STATUS_LIST.forEach((status) => {
    it(`authorize ${status}`, () => {
      cy.intercept('/_api/ucenter/login-verify*', {
        success: true,
        code: '200',
        msg: 'success',
        retry: false,
        data: {
          status: status,
          loginInfo: null,
        },
      });
      cy.visit(`${url}?verifyToken=${verifyToken}`);
      cy.get(`[data-inspector="${inspectorId}"]`).should('have.attr', 'data-result', status);
    });
  });
});
