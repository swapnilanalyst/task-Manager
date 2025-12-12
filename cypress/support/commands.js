// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
let softErrors = [];

Cypress.Commands.add("softAssert", (condition, message) => {
  try {
    expect(condition).to.be.true;
  } catch (err) {
    softErrors.push(message);
    cy.log("❌ Soft Assert Failed: " + message);
  }
});

Cypress.Commands.add("softAssertAll", () => {
  cy.then(() => {
    if (softErrors.length) {
      throw new Error("Soft Assertions Failed: \n" + softErrors.join("\n"));
    }
  });
});

