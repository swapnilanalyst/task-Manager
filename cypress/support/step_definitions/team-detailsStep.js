import {When,Then,} from "@badeball/cypress-cucumber-preprocessor";
import TeamManagementPage from "../../support/pageObjects/TeamManagementPage";
import { assertValueNotInList,assertValueInList,assertValidation} from "../../utils/helpers";

const teamPage = new TeamManagementPage();

When("I click on team {string}", (input) => {
  const value = isNaN(input) ? input : Number(input);
  teamPage.clickAnyTeam(value);
});

Then("I should be navigated to that team's details page", () => {
  cy.url().should("include", "/dashboard/team-details");
});

When("I should see the team name on the details page header", () => {
  teamPage.getPageTitle().then((title) => {
    cy.log(`Team Details Page Title: ${title}`);

    teamPage.VerifyPageTitle(title);
  });
});

When("I should see the list of team members", () => {
  teamPage.printEmployeeList();
});

Then("I should see the Select All checkbox", () => {
  cy.get(teamPage.locators.selectAllCheckbox).check({ force: true });
});

When("I should see the top Remove User From Team button", () => {
  cy.get(teamPage.locators.removeUserBtn).should("be.visible");
});

When("I should see the Add Members in team button", () => {
  cy.get(teamPage.locators.addMemberInTeamBtn).should("be.visible");
});

When("I select one member card from the list", () => {
  teamPage.printEmployeeList();
  teamPage.getMemberCard(1).find("label > span").click({ force: true });
});

Then("the top Remove User From Team button should be enabled", () => {
  cy.get(teamPage.locators.removeUserBtn).should("be.enabled");
});

Then("I click on the top Remove User From Team button", () => {
  cy.get(teamPage.locators.removeUserBtn).click({ multiple: true });
  teamPage.getToast("Employee remove from team");
});

Then("that member should be removed from the team list", () => {
  cy.wait(1000); // wait for UI to update
  cy.get("@selectedMemberName").then((name) => {
    assertValueNotInList(teamPage.locators.allCards, name);
  });
});

When("I click on the Select All checkbox", () => {
  cy.get(teamPage.locators.selectAllCheckbox).check({ force: true });
});

Then("all member cards should be selected", () => {
  teamPage.areAllMembersSelected().should("be.checked");
});

// ----------------- REMOVE MEMBER FROM CARD BUTTON -----------------

When("I note any member name from the list", () => {
  teamPage.printEmployeeList();
});

When("I click on Remove User From Team button on that member card", () => {
  teamPage.clickRemoveUserFromTeam("1");
});

Then("I confirm member removal", () => {
  cy.contains("button", "Delete").click();
  teamPage.getToast("Employee remove from team");
});

Then("that member should not be visible in the team list anymore", () => {
  cy.wait(1000); // wait for UI to update
  cy.get("@selectedMemberName").then((name) => {
    assertValueNotInList(teamPage.locators.allCards, name);
  });
});

//  ----------------- ADD MEMBER TO TEAM -----------------
When("I open a team details page from the team list", () => {
  teamPage.clickAnyTeam(0);
});
When("I click on the Add Members in team button", () => {
  cy.get(teamPage.locators.addMemberInTeamBtn).click();
});

When("I select any member from the Add Members popup", () => {
  teamPage.getAddEmpList(1).find(".MuiCheckbox-root").click({ force: true });
});

When("I confirm adding member to the team", () => {
  cy.contains("button", "Save").click();
});
Then("I should see a success message for adding member", () => {
  teamPage.getToast("Employee added in team");
});

Then("the added member should be visible in the team members list", () => {
  cy.wait(1000);
  cy.get("@selectedMemberName").then((name) => {
    assertValueInList(teamPage.locators.allCards, name);
  });
});

// ----------------- PRINT / LOG MEMBER LIST -----------------

When("I print all team members from the details page", () => {
  teamPage.printEmployeeList();
});

Then("I should see at least one member in the printed list", () => {
  assertValidation(teamPage.locators.emmployeeList, 0, "gt");
});
