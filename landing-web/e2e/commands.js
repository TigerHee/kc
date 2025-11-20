
// fillForm
Cypress.Commands.add('fillForm', (formData) => {
  Object.keys(formData).forEach((key) => {
    cy.get(`[name="${key}"]`).type(formData[key]);
  });
});