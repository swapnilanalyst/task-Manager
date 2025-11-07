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
    errorArea: ".form-error, .error, .invalid-feedback",
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
    cy.get(this.locators.fullName).clear().type(fullName);
    cy.get(this.locators.email).clear().type(email);

    // Country select (India)
    cy.get(this.locators.countryCode)
      .click()
      .get('input[placeholder="Search..."]')
      .type("India");
    cy.contains("India")
      .filter(':not(:contains("British Indian Ocean Territory"))')
      .click();

    cy.get(this.locators.mobileNumber).clear().type(mobileNumber);
    cy.get(this.locators.designation).clear().type(jobTitle).invoke('val').should('have.length.at.most', 30);


    // Date selection
    waitForElementVisibility(this.locators.joiningDate);
    selectDate(joiningDate || "06/11/2025");

    highlightElement(this.locators.joiningDate, "lightgreen");
  }

  // 🔹 Submit form
  clickSubmitButton() {
    waitForElementVisibility(this.locators.submitButton);
    cy.get(this.locators.submitButton).click();
  }

  // 🔹 Navigate back to user list page
  navigateToUserList() {
    cy.visit("/dashboard/user/list");
  }
  // Clear all inputs in the form (useful before blank-submit tests)
  clearForm() {
    cy.get(this.locators.fullName).clear();
    cy.get(this.locators.email).clear();
    // close country dropdown if open and reset - safe to click
    cy.get('body').click(0,0);
    cy.get(this.locators.mobileNumber).clear();
    cy.get(this.locators.designation).clear();
    // If joiningDate is populated, clear it
    cy.get(this.locators.joiningDate).then(($el) => {
      if ($el && $el.val()) {
        cy.get(this.locators.joiningDate).clear();
      }
    });
  }



}

export default AddUserPage;
