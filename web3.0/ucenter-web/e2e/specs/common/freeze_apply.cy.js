const url = '/freeze/apply';
const replaceUrl = '/freeze';

const interceptFrozen = () => {
  cy.intercept('/_api/ucenter/user/locale*', {
    code: '4111',
    data: '0',
    msg: '',
    success: false,
  });
  cy.intercept('/_api/ucenter/is-frozen*', {
    code: '200',
    success: true,
    data: {
      email: 'cy**@**.com',
      frozen: true,
      remainingTime: null,
    },
  });
  cy.intercept('/_api/ucenter/user-info*', (req) => {
    req.reply((res) => {
      // 3 是用户冻结态
      res.body.data.status = 3;
    });
  });
};

describe(`【${url}】`, () => {
  beforeEach(() => {
    cy.login();
  });

  it(`直接访问重定向到【${replaceUrl}】`, () => {
    interceptFrozen();
    cy.visit(url);
    cy.url().should((curUrl) => {
      const path = new URL(curUrl).pathname;
      expect(path.endsWith(replaceUrl)).to.be.true;
    });
  });
});
