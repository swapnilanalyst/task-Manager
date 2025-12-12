// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import 'cypress-xpath'
import 'cypress-iframe';
import "@shelex/cypress-allure-plugin";


// const softAssert = require("chai-soft-assert");
// chai.use(softAssert);

Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes('unrecognized expression')) {
    return false; // Prevent Cypress from failing the test
  }
});

Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('Failed to execute \'send\' on \'WebSocket\'')) {
    // Ignore this specific WebSocket error
    return false;
  }
});

import { getEnvConfig } from "../utils/envHelper";

// after(() => {
//   const env = getEnvConfig();

//   const envData = {
//     Tester: "Swapnil Gupta",
//     Environment: Cypress.env("activeEnv"),
//     BaseURL: env.baseUrl,
//     LoginPath: env.loginPath,
//     Browser: Cypress.browser.name,
//     Platform: "Cypress",
//   };

//   cy.task("writeAllureEnv", envData);
// });

