import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import LoginPage from "../pageObjects/LoginPage";
import { getEnvConfig } from "../../utils/envHelper";

const loginPage = new LoginPage();
const env = getEnvConfig();
const validUser = env.users.valid;
const invalidUser = env.users.invalid;

Given("I am on the login page", () => {
  loginPage.visit();
});

When("I enter valid email and password", () => {
  loginPage.enterEmail(validUser.email);
  loginPage.enterPassword(validUser.password);
});

When("I enter valid email and invalid password", () => {
  loginPage.enterEmail(validUser.email);
  loginPage.enterPassword(invalidUser.password);
});

When("I enter unregistered email and valid password", () => {
  loginPage.enterEmail(invalidUser.email);
  loginPage.enterPassword(validUser.password);
});

When("I leave both fields empty", () => {
  loginPage.clearEmail();
  loginPage.clearPassword();
});

When("I fill only the email field", () => {
  loginPage.enterEmail(validUser.email);
  loginPage.clearPassword();
});

When("I fill only the password field", () => {
  loginPage.clearEmail();
  loginPage.enterPassword(validUser.password);
});

When("I click on the login button", () => {
  loginPage.clickLoginButton();
});

Then("I should be redirected to the dashboard", () => {
  cy.url().should("include", "/dashboard");
});

Then("I should see the welcome message", () => {
  cy.contains("Welcome").should("be.visible");
});

// Invalid credentials (wrong password)
Then("I should see invalid email or password error", () => {
  cy.get(".minimal__snackbar__title")
    .should("be.visible")
    .and("contain.text", "Invalid email or password.");
});

// Unregistered email
Then("I should see email not registered error", () => {
  cy.get(".minimal__snackbar__title")
    .should("be.visible")
    .and("contain.text", "Email is not registered.");
});

// Empty fields
Then("I should see required field validation message", () => {
  cy.contains("Email is required").should("be.visible");
  cy.contains("Password is required").should("be.visible");
});

// Missing password only
Then("I should see password required message", () => {
  cy.contains("Password is required").should("be.visible");
});

// Missing email only
Then("I should see email required message", () => {
  cy.contains("Email is required").should("be.visible");
});
