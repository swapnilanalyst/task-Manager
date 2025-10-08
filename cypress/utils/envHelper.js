// cypress/utils/envHelper.js
export function getEnvConfig() {
  const activeEnv = Cypress.env("activeEnv");
  return Cypress.env("environments")[activeEnv];
}
