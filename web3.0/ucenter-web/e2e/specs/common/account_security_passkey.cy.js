import { createCheckElementEnable, getFormDataValue } from './utils';

const url = '/account/security/passkey';
const inspectorId = 'account_security_passkey';
const MOCK_ID = '67a6d6363733070001ad3e6d';
const checkButtonEnable = createCheckElementEnable();


const interceptPasskeyList = (callback) => {
  cy.intercept('/_api/ucenter/passkey/list*', {
    success: true,
    code: '200',
    data: [
      {
        id: MOCK_ID,
        createdAt: 1738987062000,
        updatedAt: 1747898747000,
        credentialNickname: 'MacOS',
        lastUsedAt: 1747898747000,
        lastUsedIp: '203.116.182.154',
        system: 'MacOS',
        deviceInfo: {
          lastBrowser: 'Chrome',
          lastDevice: 'Mac',
        },
        location: 'Singapore Singapore',
      },
    ],
  }).as('passkeyList');
  cy.wait('@passkeyList').then(callback);
};

describe(`【${url}】`, () => {
  beforeEach(() => {
    cy.login();
    cy.visit(url);
  });
  it('创建 passkey', () => {
    checkButtonEnable(inspectorId);
  });
  it('编辑 passkey', () => {
    interceptPasskeyList(() => {
      cy.get('.ICEdit2_svg__icon').click();
      cy.get('#credentialNickname input').clear().type('hello');
      cy.intercept('/_api/ucenter/passkey/update/nickname*', {
        success: true,
        code: '200',
      }).as('updateNickname');
      cy.get('.KuxDialog-root .KuxButton-contained').click();
      cy.wait('@updateNickname').then((interception) => {
        const requestBody = interception.request.body;
        expect(getFormDataValue(requestBody, 'credentialNickname')).to.include('hello');
        expect(getFormDataValue(requestBody, 'id')).to.include(MOCK_ID);
      });
    });
  });
  it('删除 passkey', () => {
    interceptPasskeyList(() => {
      cy.get('.ICDelete_svg__icon').click();
      cy.intercept('/_api/ucenter/passkey/delete*', {
        code: '200',
        success: true
      }).as('deletePasskey');
      cy.get('.KuxDialog-root .KuxButton-contained').click();
      cy.validationCodePassed();
      cy.wait('@deletePasskey').then((interception) => {
        expect(interception.request.query.id).to.include(MOCK_ID);
      });
    });
  })
});
