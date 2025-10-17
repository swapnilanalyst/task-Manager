// 📘 AddUserPage.js
import {
  waitForElementVisibility,
  selectDate,
  highlightElement,
} from "../../utils/helpers";

class AddUserPage {
  locators = {
    accountButton: "button[aria-label='Account button']",
    addUserOption: "a[href='/dashboard/user/list']",
    newUserButton: "a[href='/dashboard/user/new']",
    fullName: "input[name='fullName']",
    email: "input[name='email']",
    countryCode: "#country-list-button",
    mobileNumber: "input[name='mobileNumber']",
    designation: "input[name='jobTitle']",
    joiningDate: "input[name='joiningDate']",
    submitButton: "button[type='submit']",
  };

  // 🔹 Click on account button
  clickAccountButton() {
    waitForElementVisibility(this.locators.accountButton);
    cy.get(this.locators.accountButton).click();
  }

  // 🔹 Open Add User section
  clickAddUserOption() {
    waitForElementVisibility(this.locators.addUserOption);
    cy.get(this.locators.addUserOption).click();
  }

  // 🔹 Click "New User" button
  clickNewUserButton() {
    waitForElementVisibility(this.locators.newUserButton);
    cy.get(this.locators.newUserButton).click();
  }

  // 🔹 Fill the Add User form
  fillUserForm({ fullName, email, mobileNumber, jobTitle, joiningDate }) {
    // Basic details
    cy.get(this.locators.fullName).clear().type(fullName);
    cy.get(this.locators.email).clear().type(email);

    // Select Country (using contains for dynamic country name)
    cy.get(this.locators.countryCode)
      .click()
      .get('input[placeholder="Search..."]')
      .type("India");
    cy.contains("India")
      .filter(':not(:contains("British Indian Ocean Territory"))')
      .click();

    // Mobile + Designation
    cy.get(this.locators.mobileNumber).clear().type(mobileNumber);
    cy.get(this.locators.designation).clear().type(jobTitle);

    // 🔹 Use reusable date selector from helpers
    waitForElementVisibility(this.locators.joiningDate);
    selectDate("16/10/2025"); // Example: "16/10/2025"

    // 🔹 Highlight after filling for debug (optional)
    highlightElement(this.locators.joiningDate, "lightgreen");
  }

  // 🔹 Submit form
  clickSubmitButton() {
    waitForElementVisibility(this.locators.submitButton);
    cy.get(this.locators.submitButton).click();
  }
}

export default AddUserPage;
