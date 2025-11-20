import { isEqual } from 'lodash';

const url = '/account/kyc/setup/country-of-issue';
const inspectorId = '[data-inspector="account_kyc_setup_countryOfIssue_page"]';

describe(`【${url}】`, () => {
  beforeEach(() => {
    cy.intercept('/_api/kyc/kyc/site/regions*').as('regions');
    cy.intercept('/_api/kyc/web/kyc/state/list*').as('stateList');
    cy.intercept('/_api/kyc/web/kyc/compliance/getComplianceTempValue*', {
      success: true,
      code: '200',
      data: '{}'
    });
    cy.intercept('/_api/kyc/web/kyc/compliance/saveComplianceTempValue*', {
      code: '200',
      success: true,
      data: null
    }).as('postResult');
    cy.login();
  });

  it ('选择无州省信息的国家（JP）', () => {
    cy.visit(url);
    cy.get(inspectorId).should('exist');
    cy.wait('@regions').then(() => {
      cy.get(`${inspectorId} #regionCode`).click();
      cy.get('#regionCode_popper input').type('JP');
      cy.get('.custom_select_options').first().click();
      cy.get(`${inspectorId} .KuxButton-contained`).click();
      cy.wait('@postResult').then((interception) => {
        const requestBody = interception.request.body;
        expect(isEqual(JSON.parse(requestBody.tempValue), { region: 'JP', type: 1 })).to.be.true;
        cy.url().should('include', '/account/kyc/setup/identity-type');
      })
    });
  });

  it ('选择有州省信息的国家（CA）', () => {
    cy.visit(url);
    cy.get(inspectorId).should('exist');
    cy.wait('@regions').then(() => {
      cy.get(`${inspectorId} #regionCode`).click();
      cy.get('#regionCode_popper input').type('CA');
      cy.get('.custom_select_options').first().click();
      cy.wait('@stateList').then(({ response }) => {
        const { code: stateCode } = response.body.data.stateData.find(state => !state.limitState);
        cy.get(`${inspectorId} #userState`).click();
        cy.get('#userState_popper input').type(stateCode);
        cy.get('.custom_select_options').first().click();
        cy.get(`${inspectorId} .KuxButton-contained`).click();
        cy.wait('@postResult').then((interception) => {
          const requestBody = interception.request.body;
          expect(isEqual(JSON.parse(requestBody.tempValue), { region: 'CA', userState: stateCode, type: 1 })).to.be.true;
          cy.url().should('include', '/account/kyc/setup/identity-type');
        })
      })
    });
  });
});