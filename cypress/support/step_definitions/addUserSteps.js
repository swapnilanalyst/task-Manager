import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import AddUserPage from "../../support/pageObjects/AddUserPage";
import { faker } from "@faker-js/faker";
import LoginPage from "../../support/pageObjects/LoginPage";
import { getEnvConfig } from "../../utils/envHelper";

const addUserPage = new AddUserPage();
const loginPage = new LoginPage(); // Instantiate LoginPage
const env = getEnvConfig();

Given("I am logged in and on the dashboard page", () => {
  // Reusing loginPage methods from LoginPage to perform login
  loginPage.visit();
  loginPage.enterEmail(env.users.valid.email); // Use the valid email from the env config
  loginPage.enterPassword(env.users.valid.password); // Use the valid password from the env config
  loginPage.clickLoginButton();
  cy.wait(2000) // Assuming you have a clickLoginButton() method in LoginPage
  cy.url().should("include", "/dashboard"); // Verify that we are redirected to the dashboard
  // dashboard.clickSideBarButton(); // Click the sidebar button to ensure the menu is visible
});

When("I click on the account button", () => {
  addUserPage.clickAccountButton();
});

When("I click on Add Users from the list", () => {
  addUserPage.clickAddUserOption();
});

When("I click on the New User button", () => {
  addUserPage.clickNewUserButton();
});

When("I fill in all user details", () => {
  const userData = {
    fullName: faker.person.fullName(),
    email: faker.internet.email(),
    mobileNumber: faker.string.numeric(10),
    jobTitle: faker.person.jobTitle(),
  };
  addUserPage.fillUserForm(userData);
});

When("I click on the submit button", () => {
  addUserPage.clickSubmitButton();
});

Then("I should see a success message for user creation", () => {
  cy.contains('Create success!', { timeout: 10000 }).should("be.visible");
});
