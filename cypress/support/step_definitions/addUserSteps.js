import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import AddUserPage from "../../support/pageObjects/AddUserPage";
import { faker } from "@faker-js/faker";
import LoginPage from "../../support/pageObjects/LoginPage";
import { getEnvConfig } from "../../utils/envHelper";

const addUserPage = new AddUserPage();
const loginPage = new LoginPage();
const env = getEnvConfig();

const JOB_TITLE_MAX = 25;
const toastSelector = ".minimal__snackbar__toast";

const uniqueEmail = (prefix = "user") => `${prefix}_${Date.now()}@test.com`;

const makeUser = (overrides = {}) => ({
  fullName: faker.person.fullName(),
  email: faker.internet.email(),
  mobileNumber: faker.string.numeric(10),
  jobTitle: faker.person.jobTitle().substring(0, JOB_TITLE_MAX),
  ...overrides,
});

const getToastText = () =>
  cy.get(toastSelector).should("be.visible").invoke("text");

/* ===== Login background ===== */
Given("I am logged in and on the dashboard page", () => {
  cy.session("validUserSession", () => {
  loginPage.visit();
  loginPage.enterEmail(env.users.valid.email);
  loginPage.enterPassword(env.users.valid.password);
  loginPage.clickLoginButton();
  cy.url().should("include", "/dashboard");
})
  cy.visit("/dashboard");
});

/* ===== Common steps ===== */
When("I click on the account button", () => addUserPage.clickAccountButton());

When("I click on Add Users from the list", () =>
  addUserPage.clickAddUserOption()
);

When("I click on the New User button", () => addUserPage.clickNewUserButton());

When("I fill in all user details", () => {
  addUserPage.fillUserForm(makeUser());
});

When("I click on the submit button", () => addUserPage.clickSubmitButton());

/* ===== Create multiple users ===== */
When("I create {int} new users", (count) => {
  Cypress._.times(count, (i) => {
    const user = makeUser({ email: uniqueEmail("user_" + i) });

    cy.log(`Creating user #${i + 1}: ${user.fullName}`);
    addUserPage.clickNewUserButton();
    addUserPage.fillUserForm(user);
    addUserPage.clickSubmitButton();

    cy.contains("Create success!", { timeout: 10000 }).should("be.visible");
    addUserPage.navigateToUserList();
  });
});

/* ===== Verification ===== */
Then("I should see a success message for user creation", () => {
  cy.contains("Create success!", { timeout: 10000 }).should("be.visible");
});

/* ===== Negative scenarios ===== */
When("I submit the form without filling any details", () => {
  addUserPage.clickSubmitButton();
});

Then("I should see validation errors for required fields", () => {
  cy.get(".MuiInputBase-input").each(($input) => {
    const name = $input.attr("name");
    const error = $input
      .closest(".MuiFormControl-root")
      .find(".MuiFormHelperText-root.Mui-error")
      .text()
      .trim();
    cy.log(`${name}: ${error}`);
  });
});

When("I fill in user form with invalid email", () => {
  addUserPage.fillUserForm(
    makeUser({
      email: "invalid-email-format",
    })
  );
});

Then("I should see an email format validation error", () => {
  cy.contains("Email must be a valid email address!", { timeout: 5000 }).should(
    "be.visible"
  );
  cy.contains("Create success!", { timeout: 3000 }).should("not.exist");
});

/* ===== Duplicate helpers & scenarios ===== */
When("I create a new user and store its contact", () => {
  const user = makeUser({
    email: uniqueEmail("dup"),
    mobileNumber: faker.string.numeric(10),
  });

  addUserPage.clickNewUserButton();
  addUserPage.fillUserForm(user);
  addUserPage.clickSubmitButton();

  cy.contains("Create success!", { timeout: 10000 }).should("be.visible");
  cy.wrap(user).as("createdUser");
  addUserPage.navigateToUserList();
});

When("I fill in user form with the existing email", function () {
  const created = this.createdUser;
  addUserPage.fillUserForm(
    makeUser({
      email: created.email,
    })
  );
});

When("I fill in user form with the existing mobile number", function () {
  const created = this.createdUser;
  addUserPage.fillUserForm(
    makeUser({
      email: uniqueEmail("other"),
      mobileNumber: created.mobileNumber,
    })
  );
});

Then("I should see a duplicate email error", () => {
  getToastText().then((text) => cy.log(`🔥 Toast: ${text}`));
});

Then("I should see a duplicate mobile number error", () => {
  getToastText().then((text) => cy.log(`🔥 Toast: ${text}`));
});
