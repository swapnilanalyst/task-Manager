import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import TeamManagementPage from "../../support/pageObjects/TeamManagementPage";
import LoginPage from "../../support/pageObjects/LoginPage";
import { getEnvConfig } from "../../utils/envHelper";
import { fa, faker } from "@faker-js/faker";

const teamPage = new TeamManagementPage();
const loginPage = new LoginPage();
const env = getEnvConfig();
let selectedTeam = "";
let selectedMember = "";


Given("I am logged in and on the Team Management page", () => {
  cy.session("validUserSession", () => {
    loginPage.visit();
    loginPage.enterEmail(env.users.valid.email);
    loginPage.enterPassword(env.users.valid.password);
    loginPage.clickLoginButton();
    cy.url().should("include", "/dashboard");
  });

  teamPage.visitTeamManagement();
});

Then("I should see the Team Management page title", () => {
  teamPage.VerifyPageTitle("Team Management");
});

Then("I should see the Teams tab", () => {
  cy.contains("Teams").should("be.visible");
});

Then("I should see the Create Team button", () => {
  cy.contains("Create Team").should("be.visible");
});

Then("I should see the Invite Member button", () => {
  cy.contains("Invite Member").should("be.visible");
});

/* --- Create Team --- */
When("I click on the Create Team button", () => {
  teamPage.clickCreateTeam();
});

When("I enter a unique team name", () => {
  const teamName = `Team-${Date.now()}`;
  const description = faker.lorem.sentence();
  cy.wrap(teamName).as("teamName");
  teamPage.enterTeamName(teamName);
  cy.wrap(description).as("description");
  teamPage.enterDescription(description);
});

When("I submit the team form", () => {
  teamPage.submitTeamForm().click();
});

When("I submit the empty team form", () => {
  teamPage.submitTeamForm().then(($btn) => {
    const isDisabled = $btn.is(":disabled");

    if (isDisabled) {
      cy.log("Element is disabled → user cannot click it");
    } else {
      cy.wrap($btn).click();
      cy.get(".toast-message").should("contain", "Team created successfully!");
      cy.log("Empty form submitted");
    }
  });
});

Then("I should see a success message for team creation", () => {
  teamPage.getToast("Team created successfully!");
});

/* --- Blank name validation --- */
Then("I should see validation error for team name", () => {
  cy.contains("Team name is required").should("be.visible");
});

/* --- Duplicate team --- */
Given("a team already exists", () => {
  const name = `TeamDup_${Date.now()}`;
  cy.wrap(name).as("teamDup");
  Cypress.env("existingTeamName", name);
  teamPage.clickCreateTeam();
  teamPage.enterTeamName(name);
  teamPage.submitTeamForm().click();
  cy.wait(1000); // wait for processing
});

When("I enter the same team name again", () => {
  const teamName = Cypress.env("existingTeamName");

  cy.get("input[placeholder='Enter team name...']").clear().type(teamName);
});

Then("I should see a duplicate team error", () => {
 teamPage.getToast("Team name already exists");
});

/* --- Delete Team --- */
When("I delete that team", () => {
  cy.get("@teamDup").then((name) => {
    const expected = name;
    teamPage.searchTeam(name);
    teamPage
      .getTeamRows()
      .should("have.length", 1)
      .invoke("text")
      .then((actual) => {
        cy.log(`Expected: "${expected}"`);
        cy.log(`Found: "${actual.trim()}"`);

        expect(actual.trim()).to.include(expected);
        teamPage.deleteFirstTeam();
      });
  });
});

Then("the team should no longer appear in the list", () => {
  teamPage
    .getTeamRows()
    .should("have.length", 0)
    .invoke("text")
    .then((text) => {
      cy.log(`Team list after deletion: ${text}`);
    });
});

/* --- Search --- */
When("I search for {string}", (text) => {
  teamPage.searchTeam(text);
  cy.wait(2000);
});

Then("all visible teams should contain {string}", (text) => {
  teamPage.getTeamRows().each(($row) => {
    const rowText = $row.text().toLowerCase();
    expect(rowText).to.include(text.toLowerCase());
  });
});

/* --- Add Member --- */
When('each visible teams row should include {string} in list', (text) => {
  const search = text.toLowerCase();

  teamPage.getTeamNames().each(($el) => {
  const teamName = $el[0].innerText.trim().toLowerCase();

  selectedTeam = teamName;

  cy.log("Selected Team = " + selectedTeam);
  expect(teamName).to.include(search);
  });
});




When("I click the add member button", () => {
  teamPage.clickAddMember();
});

When("I select member {string} from the member list", (memberName) => {
   cy.get('[role="dialog"]').within(() => {
    // find the <td> that has the member’s name
    cy.contains('td.MuiTableCell-root', memberName)
      .parents('tr')                         // go to the row
      .within(() => {
        cy.get("td").eq(1).invoke("text").then((text) => {
        selectedMember = text.trim();      // ⭐ stored
        cy.log("Selected Member = " + selectedMember);
      });
        cy.get('input[type="checkbox"], [role="checkbox"]')
          .first()
          .click({ force: true });
          
      });
      cy.contains("button", "Save").click();
  });
  teamPage.getToast("Employee added in team")
});

When("I open the stored team from the list", () => {
  teamPage.clickTeamByName(selectedTeam);
});


Then("I should see that member added to the team", () => {

  // const regex = new RegExp(selectedMember, "i"); // i = ignore case
  teamPage.verifyEmployeeInList(selectedMember);
});



/* --- Rows per page --- */
When("I set team rows per page to {int}", (n) => {
  teamPage.selectRowsPerPage(n);
});

Then("I should see at most {int} team rows", (n) => {
  teamPage.getTeamRows().should("have.length.at.most", n);
  teamPage.getTeamNames().then(($names) => {
    cy.log(`Visible team names: ${$names.map((i, el) => el.innerText).get().join(", ")}`);
  });
});

/* --- Tabs --- */
When("Go to the {string} tab", (label) => {
  cy.contains(label).click();
});

Then("I should see the all members list", () => {
  cy.contains("Members").should("be.visible");
  teamPage.getAllMemberList();
});


Then("I should see the roles section", () => {
  cy.contains("Permissions").should("be.visible");
});
