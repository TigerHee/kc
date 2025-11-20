import { isEqual } from 'lodash';

const url = '/account/kyc/setup/identity-type';
const inspectorId = '[data-inspector="account_kyc_setup_identityType_page"]';

describe(`【${url}】`, () => {
  beforeEach(() => {
    cy.intercept('/_api/kyc/web/kyc/identityType/config*').as('config');
    cy.intercept('/_api/kyc/web/kyc/compliance/saveComplianceTempValue*', {
      code: '200',
      success: true,
      data: null
    }).as('postResult');
    cy.login();
  });

  it ('选择证件', () => {
    cy.intercept('/_api/kyc/web/kyc/compliance/getComplianceTempValue*', {
      success: true,
      code: '200',
      data: JSON.stringify({ type: 1, region: 'JP' })
    });
    cy.visit(url);
    cy.wait('@config').then(({ response }) => {
      const { recommendIdType: identityType } = response.body.data;
      cy.get('[data-inspector="identity_type_list"] :first-child')
        .should('have.attr', 'data-inspector')
        .and('include', `identity_type_${identityType}`);
      cy.get(`${inspectorId} .KuxButton-contained`).click();
      cy.wait('@postResult').then((interception) => {
        const requestBody = interception.request.body;
        expect(isEqual(JSON.parse(requestBody.tempValue), { region: 'JP', identityType, type: 1 })).to.be.true;
        cy.url().should('include', '/account/kyc/setup/method');
      })
    });
  });
});