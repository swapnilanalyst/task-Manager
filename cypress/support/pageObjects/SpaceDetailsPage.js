// cypress/support/pageObjects/SpaceDetailsPage.js

import { getText, assertValidation, logAndAssertList } from "../../utils/helpers";
import TableHelper from "../../utils/tableHelper";
import APIHelper from "../../utils/apiDataHelper";


class SpaceDetailsPage {
  locators = {
    // ===== HEADER / COMMON =====
    headerRoot: ".MuiBox-root.css-1xrb7av",
    headerTitle: ".MuiBox-root.css-1xrb7av h4",
    headerDescription: ".MuiBox-root.css-0 p",
    breadcrumb: ".MuiBreadcrumbs-root",
    ownerLabel: ".css-rwy5yo p",
    ownerName: ".css-rwy5yo p",
    createProjectBtn: "button:contains('Create Project')",
    backButton: ".css-1spgihv",

    // ===== TABS =====
    tabButton: ".css-1n2s94o",
    selectedTab: "button[role='tab'][aria-selected='true']",

    // ===== PROJECTS TAB =====
    projectsTab: "button[role='tab']:contains('Projects')",
    projectCards: ".css-11xwohz",
    projectCardTitle: ".MuiTypography-root",
    projectProgressBar: ".MuiLinearProgress-root",
    projectDueLabel: ".MuiCard-root :contains('Due')",
    projectTaskLabel: ".MuiCard-root :contains('Task')",
    projectOpenIcon:
      ".css-zti9w", // adjust if needed
    projectsPagination: ".MuiPagination-root, .MuiTablePagination-root",
    projectsEmptyState:
      ".css-8f9fs5 > .MuiTypography-root",

    // ===== TASKS TAB =====
    tasksTab: "button[role='tab']:contains('Tasks')",
    tasksSearchInput: "input[placeholder*='Search task']",
    tasksStatusDropdown: ".css-15oy2sh:contains('All Tasks')",
    tasksMoreFiltersBtn: "button:contains('More Filters')",

    tasksSummaryCards: ".MuiCard-root.css-1ja448d",
    tasksSummaryTotalTask: ".MuiCard-root.css-1ja448d:has(p:contains('Total Tasks'))",
    tasksSummaryInProgress: ".MuiCard-root.css-1ja448d:has(p:contains('In Progress'))",
    tasksSummaryCompleted: ".MuiCard-root.css-1ja448d:has(p:contains('Completed'))",
    tasksSummaryOverdue: ".MuiCard-root.css-1ja448d:has(p:contains('Overdue'))",

    tasksTableHeader: "thead th",
    tasksTableRows: "table tbody tr",
    tasksStatusCell: "td:nth-child(4)", // tweak if needed
    tasksPagination: ".MuiTablePagination-root",
    tablePaginationText: ".MuiTablePagination-displayedRows",   // <p>1–5 of 28</p>
    tasksRowsPerPageSelect:".css-t87vet",
    tasksEmptyState: "td .MuiBox-root:contains('No data')",

    // ===== MEMBERS TAB =====
    membersTab: "button[role='tab']:contains('Members')",
    membersContentRoot:
      ".MuiBox-root:contains('Members'), [data-testid='members-tab']",
    membersRows: ".css-377b47",
    membersEmptyState:
      // ".MuiTypography-root:contains('No members'), .MuiBox-root:contains('No members')",
      ".css-wdcp2m",

    // ===== FILE TAB =====
    fileTab: "button[role='tab']:contains('File')",
    fileContentRoot:
      ".MuiBox-root:contains('File'), [data-testid='file-tab']",
    fileRows: "table tbody tr, [data-testid*='file-row']",
    fileEmptyState:
      ".MuiTypography-root:contains('No files'), .MuiBox-root:contains('No files')",

    // ===== ACTIVITY TAB =====
    activityTab: "button[role='tab']:contains('Activity')",
    activityContentRoot:
      ".MuiBox-root:contains('Activity'), [data-testid='activity-tab']",
    activityTimeline: ".MuiTimeline-root, [data-testid*='activity-item']",
    activityEmptyState:
      ".MuiTypography-root:contains('No activity'), .MuiBox-root:contains('No activity')",

    // ===== SETTINGS TAB =====
    settingTab: "button[role='tab']:contains('Setting')",
    settingContentRoot:
      ".MuiBox-root:contains('Space Settings'), [data-testid='space-settings']",
    settingsNameInput:
      "input[name='spaceName'], input[placeholder*='Space name']",
    settingsDescriptionInput:
      "textarea[name='spaceDescription'], textarea[placeholder*='description']",
    settingsSaveBtn:
      "button:contains('Save'), button:contains('Update Space')",
  };

   table = new TableHelper("table");

  // ===== COMMON =====
  assertOnDetailsUrl() {
    cy.url().should("include", "/dashboard/view-space");
  }

  getHeaderTitle() {
  return getText(this.locators.headerTitle);
}

  getHeaderDescription() {
    return getText(this.locators.headerDescription);
  }

  getDefalutDescription(){
    cy.get(this.locators.headerDescription).should('not.be.visible')
    cy.log("No Description")
  }

  getOwnerLabel() {
    return getText(this.locators.ownerLabel);
  }

  getOwnerName() {
    return getText(this.locators.ownerName);
  }

  // ===== TABS =====
  clickTab(tabText) {
    cy.contains(this.locators.tabButton, tabText).click({force:true});
  }

  isTabSelected(tabText) {
    return cy
      .get(this.locators.selectedTab)
      .invoke("text")
      .then((txt) => txt.trim().toLowerCase().includes(tabText.toLowerCase()));
  }

// expectedMin = jitna minimum count hona hi chahiye (Projects ke liye 1, Tasks ke liye 1, etc)
getTabCount(tabText, expectedMin = 0) {
  return cy
    .contains(this.locators.tabButton, tabText)
    .should("be.visible")
    .should(($btn) => {
      // yaha sirf text read + expect, koi cy.* command nahi
      const text = $btn.text();
      const match = text.match(/\((\d+)\)/);
      const count = match ? Number(match[1]) : 0;

      // ye smart wait hai
      expect(count, `${tabText} count loaded`).to.be.at.least(expectedMin);
      // ❗ yaha kuch RETURN mat karo
    })
    .invoke("text") // ab final text dubara le lo (retry ke baad)
    .then((text) => {
      // yaha bhi sirf normal JS, koi cy.* nahi
      const match = text.match(/\((\d+)\)/);
      const count = match ? Number(match[1]) : 0;

      console.log(`Tab count for '${tabText}' = ${count}`);
      return count;   // yaha normal return allowed hai (no cy.* in this callback)
    });
}


  // ===== PROJECTS =====
  getProjectCards() {
    return cy.get(this.locators.projectCards);
  }
  verifyProjectCardsList() {
 return logAndAssertList(this.locators.projectCards, "Project Cards")
   .then((result) => {
      cy.log(`Final Count = ${result.count}`);
      console.log("Project Card List:", result.itemList);
      result.itemList.forEach((item, index) => {
       cy.log(`${index + 1}. ${item}`);
      });
    });
}

  getProjectsCountFromTab() {
    return this.getTabCount("Projects");
  }

  // ===== TASKS =====
  getTaskRows() {
    return cy.get(this.locators.tasksTableRows);
  }

  searchTask(keyword) {
    cy.get(this.locators.tasksSearchInput).clear().type(keyword);
  }

  filterTasksByStatus(status) {
    cy.get(this.locators.tasksStatusDropdown).click();
    cy.contains("li, [role='option']", status).click();
  }

verifyTotalTasksCount() {
  cy.get(this.locators.tasksSummaryTotalTask)
    .invoke("text")
    .then((txt) => {
      const summaryCount = Number(txt.match(/\d+/)[0]);
      cy.log(`📌 Summary Total Tasks = ${summaryCount}`);

      cy.get(this.locators.tablePaginationText)
        .invoke("text")
        .then((pageTxt) => {
          const totalFromTable = Number(pageTxt.match(/of\s+(\d+)/)[1]);
          cy.log(`📌 Table Total Tasks = ${totalFromTable}`);

          expect(totalFromTable).to.equal(summaryCount);
          cy.log(`✔ Total tasks count is correct & matched`);
        });
    });
  }

  changeTaskRowsPerPage(value) {
    cy.get(this.locators.tasksRowsPerPageSelect).click();
    cy.contains("li[role='option']", String(value)).click({ multiple: true });
  }

  // ===== MEMBERS =====
  assertMembersCountSoft() {
    this.getTabCount("Members").then((count) => {
      if (count === 0) {
        cy.get(this.locators.membersEmptyState).should("exist");
      } else {
        assertValidation(this.locators.membersRows, 1, "gte");
      }
    });
  }

  // ===== FILES =====
  assertFilesSoft() {
    cy.get("body").then(($body) => {
      if ($body.find(this.locators.fileRows).length > 0) {
        cy.get(this.locators.fileRows).its("length").should("be.greaterThan", 0);
      } else {
        cy.get(this.locators.fileEmptyState).should("exist");
      }
    });
  }

  // ===== ACTIVITY =====
  assertActivitySoft() {
    cy.get("body").then(($body) => {
      if ($body.find(this.locators.activityTimeline).length > 0) {
        cy.get(this.locators.activityTimeline).should("exist");
      } else {
        cy.get(this.locators.activityEmptyState).should("exist");
      }
    });
  }

  // ===== SETTINGS =====
  updateSpaceName(newName) {
    cy.get(this.locators.settingsNameInput).clear().type(newName);
  }

  updateSpaceDescription(newDesc) {
    cy.get(this.locators.settingsDescriptionInput).clear().type(newDesc);
  }

  saveSettings() {
    cy.get(this.locators.settingsSaveBtn).click();
  }

  get projectCards() { 
  return cy.get(this.locators.projectCards); 
}

get name() {
  return ".css-1mydxog"; // first text usually title
}

get tag() {
  return "[class*='Button'][class*='contained']"; 
}

get progressBar() {
  return ".MuiLinearProgress-root";
}

get dueDate() {
  return ":contains('Due')";
}

get taskCount() {
  return "p:contains('Task')";
}

printSummaryCards() {
  cy.get(this.locators.tasksSummaryCards).each(($card) => {
    const count = Cypress.$($card).find("p").first().text().trim();
    const label = Cypress.$($card).find("p").last().text().trim();
    cy.log(`📌 ${label}: ${count}`);
  });
}

 pitntTotalTaskCount(){
  cy.get(this.locators.tasksSummaryTotalTask).each(($card) => {
    const count = Cypress.$($card).find("p").first().text().trim();
    const label = Cypress.$($card).find("p").last().text().trim();
    cy.log(`📌 ${label}: ${count}`);
  });
  }
 pitntTotalTaskCount(){
  cy.get(this.locators.tasksSummaryTotalTask).each(($card) => {
    const count = Cypress.$($card).find("p").first().text().trim();
    const label = Cypress.$($card).find("p").last().text().trim();
    cy.log(`📌 ${label}: ${count}`);
  });
  }
 pitntInProgressCount(){
  cy.get(this.locators.tasksSummaryInProgress).each(($card) => {
    const count = Cypress.$($card).find("p").first().text().trim();
    const label = Cypress.$($card).find("p").last().text().trim();
    cy.log(`📌 ${label}: ${count}`);
  });
  }
 printCompletedCount(){
  cy.get(this.locators.tasksSummaryCompleted).each(($card) => {
    const count = Cypress.$($card).find("p").first().text().trim();
    const label = Cypress.$($card).find("p").last().text().trim();
    cy.log(`📌 ${label}: ${count}`);
  });
  }
 printOverdueCount(){
  cy.get(this.locators.tasksSummaryOverdue).each(($card) => {
    const count = Cypress.$($card).find("p").first().text().trim();
    const label = Cypress.$($card).find("p").last().text().trim();
    cy.log(`📌 ${label}: ${count}`);
  });
  }

  printTableHeaders() {
  cy.get(this.locators.tasksTableHeader).each(($el, index) => {
    const header = $el.text().trim();
    cy.log(`📌 Header ${index + 1}: ${header}`);
  });
}

verifyTableColumn(columnName) {
  cy.get(this.locators.tasksTableHeader)
    .then(($headers) => {
      const headers = [...$headers].map(h => h.innerText.trim())
      .filter(h => h !== "");  ;
      // cy.log("📌 Found Columns:", headers.join(", "));
      expect(headers, `Checking Column: ${columnName}`).to.include(columnName);
      cy.log(`✔ "${columnName}" exists`);
    });
}

verifyTotalTasks(expected) {
    this.table.validateTotalRows(expected);
  }

  logFirstRowData() {
    this.table.getRowData(0).then(data => cy.log(data));
  }

  getTaskName(row) {
    return this.table.getCell(row,1).invoke('text');
  }

  getCurrentDataFromTable(){
    this.table.printTableWithHeaders();

  }

  goToNextPageInTable(){
   cy.get("body").then(($body) => {
      const pag = $body.find(this.locators.tasksPagination);
      if (pag.length) {
        cy.wrap(pag)
          .find("button[aria-label='Go to next page'], button:contains('2')")
          .first()
          .click({ force: true });
      }
    });
  }
  goToPreviousPageInTable(){
     cy.get("body").then(($body) => {
       const pag = $body.find(this.locators.projectsPagination);
       if (pag.length) {
         cy.wrap(pag)
           .find("button[aria-label='Go to previous page'], button:contains('1')")
           .first()
           .click({ force: true });
       }
     });
  }

getAllDataFromTableAPI() {
    const url = "http://taskbackend.salesninjacrm.com/graphql";
    const spaceId = "69099b5c482ee5d0e962fddc";

    const query = `
  query GetSpaceInfo($spaceIds: [String!]!) {
    getSpaceInfo(spaceIds: $spaceIds) {
      success
      message
      code
      Space {
        id
        title
        description
        workSpaceId
        organizationId
        usersCount
        projectsCount
        taskInfo {
          total
          inProgress
          completed
          overdue
          tasks {
            title
            description
            priority
            status
            startDate
            dueDate
          }
        }
        userInfo {
          userId
          fullName
          email
          completedTasks
          projects
        }
      }
    }
  }
`;

    const variables = { spaceIds: [spaceId] };

    // 🔗 Linear chain – easy to read, easy to debug
    APIHelper.getAuthToken()
      .then((token) =>
        APIHelper.fetchAndExtract({
          url,
          query,
          variables,
          path: "data.getSpaceInfo.Space[0].taskInfo.tasks", // ✅ correct path
          token, // ✅ yahan "token" pass karo, "Authorization" nahi
        })
      )
      .then((tasks) => {
        // Console style table
        APIHelper.printDataTable(tasks, [
          "title",
          "startDate",
          "dueDate",
          "status",
        ]);

        // UI validation
        // cy.get("table tbody tr").should("have.length", tasks.length);
      });
  }


}

export default SpaceDetailsPage;
