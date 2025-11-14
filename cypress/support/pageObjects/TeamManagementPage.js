class TeamManagementPage {
  locators = {
    pageTitle: ".css-yihcqv > .MuiBox-root",
    teamsTab: "button[role='tab']:contains('Teams')",
    allMembersTab: "button[role='tab']:contains('All Members')",
    rolesTab: "button[role='tab']:contains('Roles & Permissions')",

    createTeamBtn: "button:contains('Create Team')",
    inviteMemberBtn: "button:contains('Invite Member')",

    searchBox: "input[placeholder='Search...']",

    teamNameInput: "input[placeholder='Enter team name...']",
    descriptionInput: "textarea[placeholder='Describe what this team does...']",
    submitTeamBtn: ".MuiDialogActions-root button:nth-of-type(2)",

    tableRows: "tbody tr",
    deleteIcon: ".MuiTableCell-alignRight > .MuiButtonBase-root",
    addMemberBtn: "td:nth-child(3) button",
    toast: ".minimal__snackbar__title",

    rowsPerPageDropdown: ".MuiTablePagination-toolbar div[role='combobox']",
  };

  getPageTitle() {
    return cy.get(this.locators.pageTitle).invoke("text");
  }

  visitTeamManagement() {
    cy.visit("/dashboard/team-management");
  }

  clickCreateTeam() {
    cy.get(this.locators.createTeamBtn).click();
  }

  enterTeamName(name) {
    cy.get(this.locators.teamNameInput).clear().type(name);
  }
  enterDescription(description) {
    cy.get(this.locators.descriptionInput).clear().type(description);
  }

  submitTeamForm() {
  return cy.get(this.locators.submitTeamBtn);
}

  searchTeam(name) {
    cy.get(this.locators.searchBox).clear().type(name);
  }

  getTeamRows() {
    return cy.get(this.locators.tableRows);
  }

  deleteFirstTeam() {
    cy.get(this.locators.deleteIcon).click();
    cy.contains('Delete').click();
  }

  clickTeamByName(name) {
    cy.contains("td a", name).click();
  }

  clickAddMember() {
    cy.get(this.locators.addMemberBtn).first().click();
  }

  selectRowsPerPage(n) {
    cy.get(this.locators.rowsPerPageDropdown).click();
    cy.contains("li[role='option']", String(n)).click();
  }

  getToast() {
    return cy.get(this.locators.toast).invoke("text").then((toastText) => {
        const expected = "Team created successfully!";
        const actual = toastText.trim();

        if (actual === expected) {
          expect(actual).to.eq(expected);
          cy.log(`Toast message verified: ${actual}`);
        } else {
          throw new Error(`❌ Toast message mismatch!
              Expected: "${expected}"
              Found: "${actual}"`);
        }
      });
  }
}

export default TeamManagementPage;
