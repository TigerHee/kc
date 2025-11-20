import { checkRender } from './utils';

const url = '/restrict';
const inspectorId = 'restrict_page';
const IP = '99.99.99.99';
const CODE_LIST = ['CN', 'US-NY', 'PAGE_COMPLIANCE', 'CDN_FORBIDDEN'];

const checkNumOfElemGT0 = (selector) => {
  cy.get(`[data-inspector="${inspectorId}"] ${selector}`).should('have.length.greaterThan', 0);
};
const checkNumOfElemEQ0 = (selector) => {
  cy.get(`[data-inspector="${inspectorId}"] ${selector}`).should('have.length', 0);
};
const checkElemContent = (selector, content) => {
  cy.get(`[data-inspector="${inspectorId}"] ${selector}`).should('have.text', content);
};

describe(`【${url}】`, () => {
  CODE_LIST.map((code) => {
    it(`【${url}?code=${code}】`, () => {
      cy.visit(`${url}?code=${code}`);
      checkRender(`[data-inspector="${inspectorId}"]`);
      checkNumOfElemGT0('.restrict-title');
      checkNumOfElemGT0('.restrict-desc');
      checkNumOfElemEQ0('.restrict-ip');
    });

    it(`【${url}?code=${code}&ip=${IP}】`, () => {
      cy.visit(`${url}?code=${code}&ip=${IP}`);
      checkRender(`[data-inspector="${inspectorId}"]`);
      checkNumOfElemGT0('.restrict-title');
      checkNumOfElemGT0('.restrict-desc');
      checkNumOfElemGT0('.restrict-ip');
      checkElemContent('.restrict-ip>span', IP);
    });
  });
});
