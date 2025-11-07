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
    countrySearchInput: 'input[placeholder="Search..."]',
    mobileNumber: "input[name='mobileNumber']",
    designation: "input[name='jobTitle']",
    joiningDate: "input[name='joiningDate']",
    submitButton: "button[type='submit']",
    toast: ".minimal__snackbar__toast",
    errorArea: ".form-error, .error, .invalid-feedback",
  };

  clickAccountButton() {
    waitForElementVisibility(this.locators.accountButton);
    cy.get(this.locators.accountButton).click();
  }

  clickAddUserOption() {
    waitForElementVisibility(this.locators.addUserOption);
    cy.get(this.locators.addUserOption).click();
  }

  clickNewUserButton() {
    waitForElementVisibility(this.locators.newUserButton);
    cy.get(this.locators.newUserButton).click();
  }

  /**
   * Fill Add User form.
   * Accepts an object with keys: fullName, email, mobileNumber, jobTitle, joiningDate
   */
  fillUserForm({ fullName, email, mobileNumber, jobTitle, joiningDate } = {}) {
    if (fullName !== undefined) {
      cy.get(this.locators.fullName).clear().type(fullName);
    }
    if (email !== undefined) {
      cy.get(this.locators.email).clear().type(email);
    }

    if (mobileNumber !== undefined) {
      // open country dropdown and select India (defensive: search then click)
      cy.get(this.locators.countryCode).click();
      cy.get(this.locators.countrySearchInput).clear().type("India");
      cy.contains("India")
        .filter(':not(:contains("British Indian Ocean Territory"))')
        .first()
        .click();

      cy.get(this.locators.mobileNumber).clear().type(mobileNumber);
    }

    if (jobTitle !== undefined) {
      cy.get(this.locators.designation)
        .clear()
        .type(jobTitle)
        .invoke("val")
        .should("have.length.at.most", 30);
    }

    if (joiningDate !== undefined) {
      waitForElementVisibility(this.locators.joiningDate);
      selectDate(joiningDate);
      highlightElement(this.locators.joiningDate, "lightgreen");
    }
  }

  clickSubmitButton() {
    waitForElementVisibility(this.locators.submitButton);
    cy.get(this.locators.submitButton).click();
  }

  navigateToUserList() {
    cy.visit("/dashboard/user/list");
  }

  /**
   * Clear visible form fields. Safe to call before a blank-submit test.
   */
  clearForm() {
    cy.get("body").click(0, 0); // close any open dropdowns
    cy.get(this.locators.fullName).clear();
    cy.get(this.locators.email).clear();
    cy.get(this.locators.mobileNumber).clear();
    cy.get(this.locators.designation).clear();
    cy.get(this.locators.joiningDate).then(($el) => {
      if ($el.length && $el.val()) {
        cy.wrap($el).clear();
      }
    });
  }

  // small helper for tests that check toast text
  getToastText() {
    return cy.get(this.locators.toast).should("be.visible").invoke("text");
  }
}

export default AddUserPage;
