import { log } from "@badeball/cypress-cucumber-preprocessor";
import { getEnvConfig } from "../../utils/envHelper";

class LoginPage {
  locators = {
    email: "input[name='email']",
    password: "input[name='password']",
    loginButton: "button[type='submit']",
  };

  visit() {
    const env = getEnvConfig();
    cy.visit(`${env.baseUrl}${env.loginPath}`);
  }

  enterEmail(email) {
    cy.get(this.locators.email).clear().type(email);
  }

  enterPassword(password) {
    cy.get(this.locators.password).clear().type(password);
  }

  clearEmail() {
    cy.get(this.locators.email).clear();
  }

  clearPassword() {
    cy.get(this.locators.password).clear();
  }

  clickLoginButton() {
    cy.get(this.locators.loginButton).click();
  }

  loginWithValidCredentials() {

    cy.get(this.locators.email).clear().type(email);
    cy.get(this.locators.password).clear().type(password);
    cy.get(this.locators.loginButton).click();
  }
}

export default LoginPage;
