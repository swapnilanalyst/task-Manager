import { getCardByTarget } from  "../../utils/helpers";

class TeamManagementPage {
  locators = {
    pageTitle: ".css-yihcqv > .MuiBox-root",
    teamsTab: "button[role='tab']:contains('Teams')",
    allMembersTab: "button[role='tab']:contains('All Members')",
    allMembersList: ".MuiGrid-root.MuiGrid-container",
    rolesTab: "button[role='tab']:contains('Roles & Permissions')",
    createTeamBtn: "button:contains('Create Team')",
    inviteMemberBtn: "button:contains('Invite Member')",
    searchBox: "input[placeholder='Search...']",
    teamNameInput: "input[placeholder='Enter team name...']",
    descriptionInput: "textarea[placeholder='Describe what this team does...']",
    submitTeamBtn: ".MuiDialogActions-root button:nth-of-type(2)",
    tableRows: "tbody tr",
    teamNamesList: 'a[href*="/dashboard/team-details"]',
    deleteIcon: ".MuiTableCell-alignRight > .MuiButtonBase-root",
    addMemberBtn: "td:nth-child(3) button",
    toast: ".minimal__snackbar__title",
    rowsPerPageDropdown: ".MuiTablePagination-toolbar div[role='combobox']",

    //Team Details Page Locators

    emmployeeList: ".MuiListItemText-root > .MuiTypography-root",
    selectAllCheckbox: "label:contains('Select All') input[type='checkbox']",
    allCards:'.MuiBox-root.css-0',
    addEmpList: '.MuiTableBody-root .MuiTableRow-root',
    removeUserBtn: ".MuiContainer-root > :nth-child(2) > .MuiButtonBase-root",
    addMemberInTeamBtn: "button:contains('Add Members in team')",
    noDataMessage: 'h6.css-1jpn170',
    removeMemberCardButton: ':nth-child(1) > .MuiPaper-root > .css-p6b8dt > .MuiButtonBase-root',
    
  };

  getPageTitle() {
    return cy.get(this.locators.pageTitle).invoke("text");
  }

  VerifyPageTitle(expectedTtile) {
    return cy
      .get(this.locators.pageTitle)
      .invoke("text")
      .then((title) => {
        const actualTitle = title.trim();
        if (actualTitle === expectedTtile) {
          expect(actualTitle).to.eq(expectedTtile);
          cy.log(`Title Verified: ${actualTitle}`);
        } else {
          throw new Error(`❌ Toast message mismatch!
              Expected: "${expectedTtile}"
              Found: "${actualTitle}"`);
        }
      });
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

  getTeamNames() {
    return cy
      .get(this.locators.teamNamesList, { timeout: 10000 })
      .filter(":visible");
  }

  // Get only one team whose name contains given text
  getTeamByName(teamText) {
    const search = teamText.toLowerCase();
    return this.getTeamNames().filter((index, el) => {
      return el.innerText.toLowerCase().includes(search);
    });
  }

  clickAnyTeam(team) {
    cy.get(this.locators.teamNamesList).then(($teams) => {
      // 👉 Case 1: If NUMBER → use index
      if (typeof team === "number") {
        cy.wrap($teams.eq(team)).click();
        return;
      }

      // 👉 Case 2: If STRING → use case-insensitive regex match
      const regex = new RegExp(team, "i");
      cy.wrap($teams).contains(regex).click();
    });
  }

  clickTeamByName(name) {
    const regex = new RegExp(name, "i"); // i = ignore case
    cy.get(this.locators.teamNamesList).contains(regex).click();
  }

  clickAddMember() {
    cy.get(this.locators.addMemberBtn).first().click();
  }

  selectRowsPerPage(n) {
    cy.get(this.locators.rowsPerPageDropdown).click();
    cy.contains("li[role='option']", String(n)).click();
  }

  deleteFirstTeam() {
    cy.get(this.locators.deleteIcon).click();
    cy.contains("Delete").click();
  }

  getToast(expectedMessage) {
    return cy
      .get(this.locators.toast)
      .invoke("text")
      .then((toastText) => {
        const actual = toastText.trim();
        if (actual === expectedMessage) {
          expect(actual).to.eq(expectedMessage);
          cy.log(`Toast message verified: ${actual}`);
        } else {
          throw new Error(`❌ Toast message mismatch!
              Expected: "${expectedMessage}"
              Found: "${actual}"`);
        }
      });
  }

  //Team Details Page Methods

  getEmployeeList() {
    return cy.get(this.locators.emmployeeList);
  }

  selectAnyMember(index) {
 
  return cy.get('.MuiBox-root.css-0')
    .eq(index)
    .find('label > span')
    .click({ force: true });

}


 printEmployeeList() {
  this.getEmployeeList()
    .should('have.length.gt', 0) // ensure list is actually present
    .then(($list) => {
      const employees = [];

      // Iterate safely
      Cypress.$($list).each((i, el) => {
        employees.push(el.innerText.trim());
      });

      cy.log(`Employees: ${employees.join(", ")}`);
      console.table(employees);
    });
}


  verifyEmployeeInList(selectedMember) {
    selectedMember = String(selectedMember).trim(); // FIX

    return this.getEmployeeList().then(($list) => {
      const employees = [...$list].map((e) => e.innerText.trim());

      console.table(employees);
      cy.log(`Employees: ${employees.join(", ")}`);

      const found = employees.some(
        (emp) => emp.toLowerCase() === selectedMember.toLowerCase()
      );

      expect(
        found,
        `Employee "${selectedMember}" NOT found.\nActual list: ${employees.join(
          ", "
        )}`
      ).to.be.true;
    });
  }

  getAllMemberList() {
    cy.get(this.locators.allMembersList).then(($list) => {
      const members = [...$list].map((e) => e.innerText.trim());
      console.table(members);
      cy.log(`All Members: ${members.join(", ")}`);
    });
  }

  verifyNoData() {
    cy.get(this.locators.noDataMessage)
      .should("be.visible")
      .and("have.text", "No data");
  }

areAllMembersSelected() {
  return cy.get("div.MuiBox-root.css-glnfdb input[type='checkbox']");
}

getMemberCard(target) {
    return getCardByTarget(this.locators.allCards, target);
  }
getAddEmpList(target) {
    return getCardByTarget(this.locators.addEmpList, target);
  }

  // yaha expected action perform karoge
  clickRemoveUserFromTeam(target) {
    this.getMemberCard(target)
      .contains("button", "Remove User From Team")
      .click();
  }


clickRemoveOnSelectedMember() {
  cy.get(this.locators.removeMemberCardButton).click();

}

}

export default TeamManagementPage;
