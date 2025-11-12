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
    mobileNumber: "input[name='mobileNumber']",
    designation: "input[name='jobTitle']",
    joiningDate: "input[name='joiningDate']",

    countryCode: "#country-list-button",
    countrySearchInput: 'input[placeholder="Search..."]',

    submitButton: "button[type='submit']",
    toast: ".minimal__snackbar__toast",
  };

  /* ------------------- Common Clicks ------------------- */

  clickAccountButton() {
    cy.get(this.locators.accountButton).click();
  }

  clickAddUserOption() {
    cy.get(this.locators.addUserOption).click();
  }

  clickNewUserButton() {
    cy.get(this.locators.newUserButton).click();
  }

  /* ------------------- Form Filling ------------------- */

  fillUserForm({ fullName, email, mobileNumber, jobTitle, joiningDate } = {}) {
    if (fullName) cy.get(this.locators.fullName).clear().type(fullName);
    if (email) cy.get(this.locators.email).clear().type(email);

    if (mobileNumber) {
      cy.get(this.locators.countryCode).click();
      cy.get(this.locators.countrySearchInput).clear().type("India");
      cy.contains("India")
        .filter(':not(:contains("British Indian Ocean Territory"))')
        .first()
        .click();

      cy.get(this.locators.mobileNumber).clear().type(mobileNumber);
    }

    if (jobTitle) {
      cy.get(this.locators.designation)
        .clear()
        .type(jobTitle)
        .invoke("val")
        .should("have.length.at.most", 30);
    }

    if (joiningDate) {
      selectDate(joiningDate);
      highlightElement(this.locators.joiningDate, "lightgreen");
    }
  }

  /* ------------------- Buttons ------------------- */

  clickSubmitButton() {
    cy.get(this.locators.submitButton).click();
  }

  navigateToUserList() {
    cy.visit("/dashboard/user/list");
  }

  /* ------------------- Helpers ------------------- */

  clearForm() {
    cy.get(this.locators.fullName).clear();
    cy.get(this.locators.email).clear();
    cy.get(this.locators.mobileNumber).clear();
    cy.get(this.locators.designation).clear();
    cy.get(this.locators.joiningDate).clear({ force: true });
  }

  getToastText() {
    return cy.get(this.locators.toast).should("be.visible").invoke("text");
  }


  // +++ locators (append)
list = {
 container: ".minimal__layout__main > .MuiContainer-root",     // scroll container
  table: "table.MuiTable-root",           // actual table
  rows: "tbody.MuiTableBody-root > tr", 
  search: "input[placeholder='Search...']",
  rowsPerPage: ".MuiTablePagination-toolbar div[role='combobox']",
  tab: '[role="tab"]'

};

// +++ methods (append)
getUserListTable() {
  return cy.get(this.list.container).find(this.list.table);
}

getUserRows() {
  return cy.get(this.list.container).find(this.list.rows);
}
searchUsers(text) {
  cy.get(this.list.search).clear().type(text);
}
setRowsPerPage(n) {
  cy.get(this.list.rowsPerPage).click({ force: true });
  cy.contains("li[role='option']", String(n)).click();
}
openUserTab(label) {
  cy.contains(this.list.tab, label).click();
}
}



export default AddUserPage;
