import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import DashboardMenuPage from "../../support/pageObjects/dashboardMenuPage";
import LoginPage from "../../support/pageObjects/LoginPage";
import { getEnvConfig } from "../../utils/envHelper";

const dashboard = new DashboardMenuPage();
const loginPage = new LoginPage(); // Instantiate LoginPage
const env = getEnvConfig();

Given("I am logged into the Task Manager dashboard", () => {
  // Reusing loginPage methods from LoginPage to perform login
  cy.session("validUserSession", () => {
  loginPage.visit();
  loginPage.enterEmail(env.users.valid.email); // Use the valid email from the env config
  loginPage.enterPassword(env.users.valid.password); // Use the valid password from the env config
  loginPage.clickLoginButton(); // Assuming you have a clickLoginButton() method in LoginPage
  cy.url().should("include", "/dashboard"); // Verify that we are redirected to the dashboard
  // dashboard.clickSideBarButton(); // Click the sidebar button to ensure the menu is visible
});
  cy.visit("/dashboard"); // Ensure we are on the dashboard page
});

When("I check for the dashboard logo", () => {
  dashboard.clickSideBarButton();
  dashboard.getLogo();
});

Then("The logo should be visible", () => {
  dashboard.verifyLogoVisible();
});

When("I click on the logo", () => {
  dashboard.clickLogo();
});

Then("I should be redirected to the dashboard page", () => {
  cy.url().should("include", "/dashboard");
});

When("I get all the menu items", () => {
  dashboard.getMenuItems();
});

Then("Each menu item should have a valid URL", () => {
  dashboard.verifyMenuUrls();
});

When("I click on each menu item one by one", () => {
  dashboard.navigateThroughMenuItems();
});

Then("Each page should load successfully", () => {
  dashboard.verifyPageLoaded();
});

When("I click on {string}", (menuName) => {
  dashboard.clickMenu(menuName);
});

Then("I should not be redirected to the {string} page", (wrongPage) => {
  cy.url().should("not.include", wrongPage.toLowerCase());
});
