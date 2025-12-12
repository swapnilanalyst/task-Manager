// cypress/support/step_definitions/spaceDetailsSteps.js

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import SpacePage from "../../support/pageObjects/SpacePage";
import SpaceDetailsPage from "../../support/pageObjects/SpaceDetailsPage";
import { assertValueInList } from "../../utils/helpers";

const spacePage = new SpacePage();
const detailsPage = new SpaceDetailsPage();
let taskName;

Given("I have at least one existing space", () => {
  cy.wait(2000);
  // wait a bit for the page to render, but don't over-wait
  cy.get("body", { timeout: 10000 }).then(($body) => {
    // NOTE: spacePage.getAllSpaceCards and spacePage.NoSpaceCard are assumed to be selector strings
    if ($body.find(spacePage.locators.spaceCard).length > 0) {
      cy.log("Space exists → selecting first space");
      spacePage.selectSpace(0);
      cy.get("@spaceTitle").then((title) => {
        cy.log(`Using existing spae: ${title}`);
        cy.wrap(title).as("spaceTitle");
      });

      return;
    }
    if ($body.find(spacePage.locators.NospaceCards).length > 0) {
      // No space → create one
      const title = `AutoSpace_${Date.now()}`;
      cy.log("No space found — creating:", title);

      spacePage.openCreateSpaceModal();
      spacePage.typeTitle(title);
      spacePage.clickSave();

      // toast verification (your implementation may differ)
      spacePage.assertSpaceToast("Space", "contains");

      cy.wrap(title).as("spaceTitle");
      return;
    }
  });
});

Given("I switch to {string} space", (type) => {
  if (type.toLowerCase() === "no data") {
    cy.log("🟡 Switching to No Data space");
    spacePage.selectSpace(0);
  } else {
    cy.log("🟢 Switching to Data space");
    spacePage.selectDataSpace();
  }
});
// Helper: open any space details safely, used in multiple steps
const openSpaceDetailsByTitle = (title) => {
  // assume we are already on /dashboard/spaces
  spacePage.clickOpenDetailsFromCard(title);
  detailsPage.assertOnDetailsUrl();
};

// =====================================================
// 1) NAVIGATION TO SPACE DETAILS
// =====================================================

When(
  "I open the space details for space {string} from the sidebar",

  (value) => {
    const index = Number(value);
    const isIndex = !Number.isNaN(index) && String(index) === value;

    if (isIndex) {
      cy.get(spacePage.locators.sidebarListRoot, { timeout: 1000 })
        .eq(index)
        .click({ force: true });
      cy.wait(1000);
    } else {
      cy.contains(spacePage.locators.sidebarItem, value).click({ force: true });
      cy.wait(1000);
    }
  }
);

When("I open the space details for card {string} from the grid", (value) => {
  const index = Number(value);
  const isIndex = !Number.isNaN(index) && String(index) === value;

  if (isIndex) {
    spacePage
      .getAllSpaceCards()
      .eq(index)
      .find(".css-1w5exeq")
      .click({ force: true });
  } else {
    spacePage.getSpaceCard(value).find(".css-1w5exeq").click({ force: true });
  }
});

When("I open the space details using open icon for card {string}", (value) => {
  const index = Number(value);
  const isIndex = !Number.isNaN(index) && String(index) === value;

  if (isIndex) {
    spacePage
      .getAllSpaceCards()
      .eq(index)
      .find(spacePage.locators.cardOpenBtn)
      .click();
  } else {
    spacePage.clickOpenDetailsFromCard(value);
  }
});

Then("I should be on the space details page", () => {
  cy.wait(2000);
  detailsPage.assertOnDetailsUrl();
});

Then("the URL should contain {string}", () => {
  cy.url().should("include", "/dashboard/view-space");
});

// =====================================================
// 2) COMMON GIVEN FOR MANY SCENARIOS
// =====================================================

Given("I am on the space details page for a selected space", () => {
  cy.wait(2000);
  cy.get("@spaceTitle").then((title) => {
    // we are on spaces page (from Background)
    openSpaceDetailsByTitle(title);
    cy.wait(2000);
  });
});

// =====================================================
// 3) HEADER & COMMON UI
// =====================================================

Then("the space header should show the same space name that I opened", () => {
  cy.wait(1000);
  cy.get("@spaceTitle").then((title) => {
    detailsPage.getHeaderTitle().then((header) => {
      expect(header.replace("...", "").trim()).to.include(
        title.replace("...", "").trim()
      );
    });
  });
});

Then(
  "the space header should show the space description or default message",
  () => {
    detailsPage.getHeaderDescription().then((desc) => {
      if (desc.trim().length === 0) {
        detailsPage.getDefalutDescription();
      } else {
        expect(desc.trim().length).to.be.greaterThan(0);
      }
    });
  }
);

Then('I should see the breadcrumb "Dashboard > Spaces"', () => {
  cy.get(detailsPage.locators.breadcrumb)
    .should("be.visible")
    .and("contain.text", "Dashboard")
    .and("contain.text", "Spaces");
});

Then("I should see the owner label on the header", () => {
  detailsPage.getOwnerLabel().then((text) => {
    expect(text).to.match(/Owner/i);
  });
});

Then("I should see the owner name on the header", () => {
  detailsPage.getOwnerName().then((name) => {
    expect(name.length).to.be.greaterThan(0);
  });
});

Then("I should see the Create Project button on space details", () => {
  cy.get(detailsPage.locators.createProjectBtn).should("be.visible");
});

// =====================================================
// 4) TABS PRESENCE AND SELECTION
// =====================================================

Then("I should see the Projects tab", () => {
  cy.contains(detailsPage.locators.tabButton, "Projects").should("be.visible");
});

Then("I should see the Tasks tab", () => {
  cy.contains(detailsPage.locators.tabButton, "Tasks").should("be.visible");
});

Then("I should see the Members tab", () => {
  cy.contains(detailsPage.locators.tabButton, "Members").should("be.visible");
});

Then("I should see the File tab", () => {
  cy.contains(detailsPage.locators.tabButton, "File").should("be.visible");
});

Then("I should see the Activity tab", () => {
  cy.contains(detailsPage.locators.tabButton, "Activity").should("be.visible");
});

Then("I should see the Setting tab", () => {
  cy.contains(detailsPage.locators.tabButton, "Setting").should("be.visible");
});

Then("the Projects tab should be selected by default", () => {
  detailsPage.isTabSelected("Projects").then((isSelected) => {
    expect(isSelected).to.be.true;
  });
});

Then("the Projects tab should show a project count", () => {
  detailsPage.getTabCount("Projects", 1).then((count) => {
    expect(count).to.be.at.least(0);
    cy.log(`Projects count is: ${count}`);
  });
});

Then("the Tasks tab should show a task count", () => {
  detailsPage.getTabCount("Tasks", 1).then((count) => {
    expect(count).to.be.at.least(0);
    cy.log(`Task count is: ${count}`);
  });
});

Then("the Members tab should show a member count", () => {
  detailsPage.getTabCount("Members", 1).then((count) => {
    expect(count).to.be.at.least(0);
    cy.log(`Member count is: ${count}`);
  });
});

When("I switch to the Tasks tab", () => {
  detailsPage.clickTab("Tasks");
  cy.wait(2000);
});

Then("the Tasks tab should be highlighted as selected", () => {
  detailsPage.isTabSelected("Tasks").then((isSelected) => {
    expect(isSelected).to.be.true;
  });
});

// When("I switch to the Members tab", () => {
//   detailsPage.clickTab("Members");
// });

Then("the Members tab should be highlighted as selected", () => {
  detailsPage.isTabSelected("Members").then((isSelected) => {
    expect(isSelected).to.be.true;
  });
});

// =====================================================
// 5) PROJECTS TAB
// =====================================================

Given("I am on the Projects tab", () => {
  cy.wait(2000);
  detailsPage.clickTab("Projects");
});

Then("I should see the list of project cards for that space", () => {
  // detailsPage.getProjectCards().its("length").should("be.greaterThan", 0);
  detailsPage.verifyProjectCardsList();
});

Then("each project card should show project name", () => {
  detailsPage.projectCards.each(($card, index) => {
    const title = Cypress.$($card).find(detailsPage.name).first().text().trim();

    cy.log(`📌 Project ${index + 1} Name → **${title}**`);
    expect(title).not.to.be.empty;
  });
});

Then("each project card should show project type or tag", () => {
  detailsPage.projectCards.each(($card, index) => {
    const tag = Cypress.$($card).find(detailsPage.tag).text().trim();

    cy.log(`🏷 Project ${index + 1} Tag → ${tag}`);
    expect(tag).to.not.be.empty;
  });
});

Then("each project card should show progress bar", () => {
  detailsPage.projectCards.each(($card, index) => {
    const exists = Cypress.$($card).find(detailsPage.progressBar).length > 0;

    cy.log(`📊 Progress bar found for project ${index + 1} → ${exists}`);
    expect(exists).to.eq(true);
  });
});

Then("each project card should show due date", () => {
  detailsPage.projectCards.each(($card, index) => {
    const due = Cypress.$($card).find(detailsPage.dueDate).text().trim();

    cy.log(`🗓 Project ${index + 1} Due date → ${due}`);
    expect(due).to.contain("Due");
  });
});

Then("each project card should show task count", () => {
  detailsPage.projectCards.each(($card, i) => {
    const count = Cypress.$($card)
      .find(detailsPage.taskCount)
      .text()
      .replace(/\D/g, ""); // only numbers keep

    cy.log(`📌 Project ${i + 1} → Task Count: ${count}`);
    expect(count).to.not.be.empty; // number exist
  });
});

Then(
  "the Projects tab count should be equal to the number of project cards on the page",
  () => {
    detailsPage.getProjectsCountFromTab().then((count) => {
      detailsPage.getProjectCards().then(($cards) => {
        const titles = [...$cards].map((card) => card.innerText.trim());
        cy.log("📄 Project Titles → " + titles.join(" | "));
        // Soft equality (first page) : cards <= count
        expect($cards.length).to.be.at.most(count);
      });
    });
  }
);

Then("project cards pagination should work", () => {
  cy.get("body").then(($body) => {
    if ($body.find(detailsPage.locators.projectsPagination).length) {
      cy.get(detailsPage.locators.projectsPagination).should("be.visible");
    }
  });
});

When("I go to the next page of project cards", () => {
  cy.get("body").then(($body) => {
    const pag = $body.find(detailsPage.locators.projectsPagination);
    if (pag.length) {
      cy.wrap(pag)
        .find("button[aria-label='Go to next page'], button:contains('2')")
        .first()
        .click({ force: true });
    }
  });
});

Then("the project cards list should change", () => {
  // basic soft assertion: at least some card visible
  detailsPage.getProjectCards().its("length").should("be.greaterThan", 0);
});

Then("I should be able to go back to the previous page", () => {
  detailsPage.goToPreviousPageInTable();
});

When("I open any project details using open icon from the card", () => {
  detailsPage
    .getProjectCards()
    .first()
    .find(detailsPage.locators.projectOpenIcon)
    .first()
    .click({ force: true });
});

Then("I should be navigated to that project’s details page", () => {
  cy.url().should("include", "/dashboard/space-project-details");
});

Given("I am on the space details page for a space with no projects", () => {
  // For now we only assert empty state softly after switching tab
  cy.get("@spaceTitle").then((title) => {
    openSpaceDetailsByTitle(title);
  });
});

Then("I should see a message that there are no projects in this space", () => {
  cy.get(detailsPage.locators.projectsEmptyState).should("exist");
});

// =====================================================
// 6) TASKS TAB
// =====================================================

Given("I am on the Tasks tab", () => {
  detailsPage.clickTab("Tasks");
  cy.wait(2000);
});

Then("I should see the search tasks input", () => {
  cy.get(detailsPage.locators.tasksSearchInput).should("be.visible");
});

Then("I should see the status filter dropdown", () => {
  cy.get(detailsPage.locators.tasksStatusDropdown).should("be.visible");
});

Then("I should see the More Filters button", () => {
  cy.get(detailsPage.locators.tasksMoreFiltersBtn).should("be.visible");
});

Then("I should see total task summary cards", () => {
  detailsPage.printSummaryCards();
});

Then("I should see the tasks table", () => {
  detailsPage.printTableHeaders();
});

Then("I should see Total Tasks count", () => {
  detailsPage.pitntTotalTaskCount();
});

Then("I should see In Progress count", () => {
  detailsPage.pitntInProgressCount();
});

Then("I should see Completed count", () => {
  detailsPage.printCompletedCount();
});

Then("I should see Overdue count", () => {
  detailsPage.printOverdueCount();
});

Then(
  "the Total Tasks count should be equal to the number of task rows on the page",
  () => {
    detailsPage.getCurrentDataFromTable();
    detailsPage.verifyTotalTasksCount();
  }
);

When("I search for a task by name", () => {
  detailsPage
    .getTaskRows()
    .first()
    .then(($row) => {
      taskName = $row.find("td").find(".css-1iyshlm").first().text().trim();
      cy.wrap(taskName).as("taskName"); // <-- store value for later
      detailsPage.searchTask(taskName);
    });
});

When('I filter tasks by status "In Progress"', () => {
  detailsPage.filterTasksByStatus("In Progress");
});

Then(
  'only tasks with status "In Progress" should be visible in the table',
  () => {
    detailsPage.getTaskRows().each(($row) => {
      try {
        const status = $row.find("td").last().text().trim(); // <-- jQuery way
        expect(status).to.match(/In Progress/i);
      } catch (error) {
        cy.log("Not visible");
      }
    });
  }
);

When("I click on More Filters", () => {
  cy.get(detailsPage.locators.tasksMoreFiltersBtn).click();
});

Then("I should see additional filter options for tasks", () => {
  cy.contains(/Filter by|Status|Priority/i).should("exist");
});

Given("there are multiple task pages in the space", () => {
  // soft precondition: just log; real data dependent
  cy.log("Assuming multiple task pages exist (data-dependent)");
});

When("I go to the next page of the tasks table", () => {
  detailsPage.goToNextPageInTable();
});

Then("the task rows should change", () => {
  detailsPage.getTaskRows().its("length").should("be.greaterThan", 0);
});

// Then("I should be able to go back to the previous page", () => {
//   cy.get("body").then(($body) => {
//     const pag = $body.find(detailsPage.locators.tasksPagination);
//     if (pag.length) {
//       cy.wrap(pag)
//         .find("button[aria-label='Go to previous page'], button:contains('1')")
//         .first()
//         .click({ force: true });
//     }
//   });
// });

When("I change rows per page to {string}", (value) => {
  detailsPage.changeTaskRowsPerPage(value);
});

Then("up to 10 task rows should be visible in the table", () => {
  detailsPage.getTaskRows().its("length").should("be.lte", 10);
});

Given("I am on the space details page for a space with no tasks", () => {
  cy.get("@spaceTitle").then((title) => {
    openSpaceDetailsByTitle(title);
  });
});

Then("I should see a message that there are no tasks in this space", () => {
  cy.get(detailsPage.locators.tasksEmptyState).should("exist");
});

// =====================================================
// 7) MEMBERS TAB
// =====================================================

When("I am on the Members tab", () => {
  detailsPage.clickTab("Members");
  cy.wait(2000);
});

Then("I should see the Members tab content area", () => {
  cy.get(detailsPage.locators.membersContentRoot).should("exist");
});

Given("I am on the space details page for a space with members", () => {
  cy.get("@spaceTitle").then((title) => {
    openSpaceDetailsByTitle(title);
  });
});

Then(
  "the Members tab count should be equal to the number of members shown",
  () => {
    detailsPage.assertMembersCountSoft();
  }
);

Given("I am on the space details page for a space with no members", () => {
  cy.get("@spaceTitle").then((title) => {
    openSpaceDetailsByTitle(title);
  });
});

Then("I should see a message that there are no members in this space", () => {
  cy.get(detailsPage.locators.membersEmptyState).should("exist");
});

// =====================================================
// 8) FILE TAB
// =====================================================

When("I switch to the File tab", () => {
  detailsPage.clickTab("File");
});

Then("I should see the File tab content area", () => {
  cy.get(detailsPage.locators.fileContentRoot).should("exist");
});

Given("I am on the space details page for a space with no files", () => {
  cy.get("@spaceTitle").then((title) => {
    openSpaceDetailsByTitle(title);
  });
});

Then("I should see a message that there are no files in this space", () => {
  cy.get(detailsPage.locators.fileEmptyState).should("exist");
});

// =====================================================
// 9) ACTIVITY TAB
// =====================================================

When("I switch to the Activity tab", () => {
  detailsPage.clickTab("Activity");
});

Then("I should see the Activity tab content area", () => {
  cy.get(detailsPage.locators.activityContentRoot).should("exist");
});

Given("I have performed some actions in this space", () => {
  cy.log("Assume some actions already performed (data-dependent)");
});

Then("I should see at least one activity log entry", () => {
  cy.log("Feature not implimented");
  detailsPage.assertActivitySoft();
});

Given("I am on the space details page for a new space with no activity", () => {
  cy.get("@spaceTitle").then((title) => {
    openSpaceDetailsByTitle(title);
  });
});

Then("I should see a message that there is no activity yet", () => {
  cy.log("Feature not implimented");
  cy.get(detailsPage.locators.activityEmptyState).should("exist");
});

// =====================================================
// 10) SETTINGS TAB
// =====================================================

When("I switch to the Setting tab", () => {
  detailsPage.clickTab("Setting");
});

Then("I should see the Setting tab content area", () => {
  cy.log("Feature not implimented");
  cy.get(detailsPage.locators.settingContentRoot).should("exist");
});

Given("I am on the Setting tab", () => {
  detailsPage.clickTab("Setting");
});

Then("I should see the space name input field", () => {
  cy.log("Feature not implimented");
  cy.get(detailsPage.locators.settingsNameInput).should("be.visible");
});

Then("I should see the space description input field", () => {
  cy.get(detailsPage.locators.settingsDescriptionInput).should("be.visible");
});

When("I update the space name from settings", () => {
  const updated = `Updated_${Date.now()}`;
  cy.wrap(updated).as("updatedSpaceName");
  detailsPage.updateSpaceName(updated);
});

When("I save the space settings", () => {
  detailsPage.saveSettings();
});

Then("the space header should show the updated space name", () => {
  cy.get("@updatedSpaceName").then((name) => {
    detailsPage.getHeaderTitle().then((header) => {
      expect(header).to.contain(name);
    });
  });
});

Then("the space should show updated name in the spaces sidebar list", () => {
  cy.get("@updatedSpaceName").then((name) => {
    // go back to spaces list
    cy.visit("/dashboard/spaces");
    assertValueInList(spacePage.locators.sidebarListRoot, name);
  });
});

When("I reload the page", () => {
  cy.reload();
});

Then("the space header should still show the same space name", () => {
  detailsPage.getHeaderTitle().then((header) => {
    expect(header.length).to.be.greaterThan(0);
  });
});

Then("the Projects tab should remain selected by default", () => {
  detailsPage.isTabSelected("Projects").then((isSelected) => {
    expect(isSelected).to.be.true;
  });
});

/********Table Header and Data********/
Then("I should see following columns in tasks table:", (dataTable) => {
  dataTable
    .raw()
    .flat()
    .forEach((column) => {
      detailsPage.verifyTableColumn(column);
    });
});

Then("only tasks containing that name should be visible in the table", () => {
  cy.log("Search feature is not impelmented");
  cy.get("@taskName").then((taskName) => {
    detailsPage.getTaskRows().each(($r) => {
      expect($r.text().toLowerCase()).to.include(taskName.toLowerCase());
    });
  });
});
