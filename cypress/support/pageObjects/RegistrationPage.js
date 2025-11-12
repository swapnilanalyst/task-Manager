export class RegistrationPage {
  locators = {
    orgName: "input[name='organizationName']",
    email: "input[name='email']",
    mobileNumber: "input[name='mobileNumber']",
    address: "input[name='address']",
    country: "input[placeholder='Choose a country']",
    state: "input[name='state']",
    city: "input[name='city']",
    pincode: "input[name='pincode']",
    industryType: "input[name='industryType']",
    website: "input[name='website']",
    createOrganizationBtn: "button[type='submit']",
    countryCodeButton: "#country-list-button",
    errorMsg: ".MuiFormHelperText-root.Mui-error",
    saveWorkspace: "button[type='submit']",
  };

  visit() {
    cy.visit("http://taskmanager.salesninjacrm.com/sign-up");
  }

  fillOrgDetails(data) {
    if (data.orgName) cy.get(this.locators.orgName).type(data.orgName);
    if (data.email) cy.get(this.locators.email).type(data.email);
    if (data.mobileNumber)
      cy.get(this.locators.mobileNumber).type(data.mobileNumber);
    if (data.address) cy.get(this.locators.address).type(data.address);
    if (data.country) {
      cy.get(this.locators.country).click().type(data.country);
      cy.get('ul[role="listbox"]').contains(data.country).click();
    }
    if (data.state) cy.get(this.locators.state).type(data.state);
    if (data.city) cy.get(this.locators.city).type(data.city);
    if (data.pincode) cy.get(this.locators.pincode).type(data.pincode);
    if (data.industryType)
      cy.get(this.locators.industryType).type(data.industryType);
    if (data.website) cy.get(this.locators.website).type(data.website);
  }

 clickCreateOrganization() {
    cy.wait(2000); // brief wait to ensure button is interactable
  cy.wrap(null).then(() => {
    return cy.contains("Create Organization", { timeout: 5000 })
      .should('be.visible')
      .click({ force: true });
  });
}

  verifyAlertSuccess() {
    cy.get(".MuiAlert-root", { timeout: 10000 })
      .should("be.visible")
      .and("contain.text", "Your account has been successfully created.")
      .and("contain.text", "Please check your email for verification.");
  }

  setupWorkspace() {
    cy.get("div[role='dialog']", { timeout: 10000 })
      .should("be.visible")
      .and("contain.text", "Welcome to Task Manager !");
    cy.get('input[type="text"]').type("Cypress Workspace");
    cy.get(this.locators.saveWorkspace).contains("Save").click({ force: true });
  }
}

export default RegistrationPage;
