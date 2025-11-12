import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import RegistrationPage from "../pageObjects/RegistrationPage";
import {getVerifyLink, fetchCredentials} from "../../utils/helpers";
import Chance from "chance";

const registrationPage = new RegistrationPage();

const chance = new Chance();

let email,
  username,
  phone,
  addRess,
  userEmailPrefix,
  extractedEmail,
  extractedPass,
  href;

Given("I am on the registration page", () => {
  registrationPage.visit();
});

// ---------- BASIC FIELD TESTS (TC_01 to TC_13) ----------

Then("all fields should be visible", () => {
  Object.values(registrationPage.locators).forEach((locator) => {
    if (!locator.includes("error")) cy.get(locator).should("be.visible");
  });
});

When("I click Create Organization without filling fields", () => {
  registrationPage.clickCreateOrganization();
});

Then("mandatory field validation messages should be displayed", () => {
  cy.get(registrationPage.locators.errorMsg).should(
    "have.length.greaterThan",
    0
  );
});

When("I enter invalid email {string}", (invalidEmail) => {
  cy.get(registrationPage.locators.email).type(invalidEmail);
  registrationPage.clickCreateOrganization();
});

Then("I should see invalid email error message", () => {
  cy.contains("Email must be a valid email address!").should("exist");
});

// ---------- SUCCESSFUL REGISTRATION FLOW (TC_14–TC_16) ----------

When("I fill valid organization details", () => {
  const timestamp = Date.now();
  email = `user${timestamp}@mailinator.com`;
  // email = `redv@mailinator.com`;
  username = chance.name();
  phone = chance.phone();
  addRess = chance.address();
  userEmailPrefix = email.split("@")[0];

  registrationPage.fillOrgDetails({
    orgName: username,
    email,
    mobileNumber: phone,
    address: addRess,
    country: "India",
    pincode: "452001",
    industryType: "CypressTesting",
    website: "https://company.com",
  });
});

When("I submit the registration form", () => {
  registrationPage.clickCreateOrganization();
});

Then("a success alert should appear", () => {
  registrationPage.verifyAlertSuccess();
});

Then("workspace setup modal should appear", () => {
  registrationPage.setupWorkspace();
});

When("I verify the account via Mailinator", () => {
  getVerifyLink(userEmailPrefix).then((url) => cy.visit(url));
});

Then("Thank You page should be visible", () => {
  cy.url().should("include", "/thank-you");
  cy.contains("Thank you!").should("be.visible");
});

When("I fetch login credentials from Mailinator", () => {
  fetchCredentials(userEmailPrefix).then(({ email, password, loginUrl }) => {
    cy.task("setAuth", { user: email, pass: password });
    cy.task("saveLoginHref", loginUrl);
  });
});

When("I check Mailinator for {string}", (subject) => {
  cy.mailinatorWaitForEmail(userEmailPrefix, subject);
});


Then("I should be able to login successfully", () => {
  cy.task("getLoginHref").then((href) => {
    cy.task("getAuth").then(({ user, pass }) => {
      cy.visit(href);
      cy.get("input[name='email']").clear().type(user);   // use task data
      cy.get("input[name='password']").clear().type(pass); // use task data
      cy.get("button[type='submit']").click();

      cy.url().should("include", "/dashboard");
      cy.contains("Welcome").should("be.visible");
    });
  });
})
Then("All Steps Completed page should be visible", () => {
  cy.log("All Steps Completed Successfully");
});
