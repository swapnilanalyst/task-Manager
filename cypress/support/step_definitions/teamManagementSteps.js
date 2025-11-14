import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import TeamManagementPage from "../../support/pageObjects/TeamManagementPage";
import LoginPage from "../../support/pageObjects/LoginPage";
import { getEnvConfig } from "../../utils/envHelper";
import { fa, faker } from "@faker-js/faker";

const teamPage = new TeamManagementPage();
const loginPage = new LoginPage();
const env = getEnvConfig();

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
 teamPage.getPageTitle().then((pageTitle) => {
    expect(pageTitle.trim()).to.equal("Team Management");
    cy.log(`Page title verified: ${pageTitle.trim()}`);
  });
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
  const teamName = `Team-${faker.company.buzzNoun()}`;
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
      cy.get('.toast-message').should('contain', 'Team created successfully!');
      cy.log("Empty form submitted");

    }
  });
});


Then("I should see a success message for team creation", () => {
    teamPage.getToast();

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
  teamPage.getToast();
  cy.wait(1000); // wait for processing
});

When("I enter the same team name again", () => {
  const teamName = Cypress.env("existingTeamName");

  cy.get("input[placeholder='Enter team name...']")
    .clear()
    .type(teamName);
});

Then("I should see a duplicate team error", () => {
  cy.contains("already exists").should("be.visible").invoke("text").then((text) => {
    cy.log(`Validation message: ${text}`);
  });
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
  teamPage.getTeamRows().should("have.length", 0).invoke('text').then((text) => {
    cy.log(`Team list after deletion: ${text}`);
  } );
});

/* --- Search --- */
When("I search for {string}", (text) => {
  teamPage.searchTeam(text);
});

Then("all visible teams should contain {string}", (text) => {
  teamPage.getTeamRows().each(($row) => {
    const rowText = $row.text().toLowerCase();
    expect(rowText).to.include(text.toLowerCase());
  });
});

/* --- Add Member --- */
When("I open a team named {string}", (name) => {
  teamPage.clickTeamByName(name);
});

When("I click the add member button", () => {
  teamPage.clickAddMember();
});

When("I select a member from the list", () => {
  cy.contains("li", "A").click();  // simple selection
});

Then("I should see that member added to the team", () => {
  cy.contains("A").should("be.visible");
});

/* --- Rows per page --- */
When("I set team rows per page to {int}", (n) => {
  teamPage.selectRowsPerPage(n);
});

Then("I should see at most {int} team rows", (n) => {
  teamPage.getTeamRows().should("have.length.at.most", n);
});

/* --- Tabs --- */
When("I open the {string} tab", (label) => {
  cy.contains(label).click();
});

Then("I should see the all members list", () => {
  cy.contains("Members").should("be.visible");
});

Then("I should see the roles section", () => {
  cy.contains("Permissions").should("be.visible");
});
