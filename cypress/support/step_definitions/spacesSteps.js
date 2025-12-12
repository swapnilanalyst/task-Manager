// cypress/support/step_definitions/spacesSteps.js

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import SpacePage from "../../support/pageObjects/SpacePage";
import LoginPage from "../../support/pageObjects/LoginPage";
import { getEnvConfig } from "../../utils/envHelper";
import {assertValueInList,assertValueNotInList,softAssertToastMessageSoft} from "../../utils/helpers";


const spacePage = new SpacePage();
const loginPage = new LoginPage();

const env = getEnvConfig();

const TITLE_LIMIT = 40;
const DESCRIPTION_LIMIT = 80;

// -----------------------------
// Helper flows
// -----------------------------
const createSpaceWithFullDetails = () => {
  const title = `Space_${Date.now()}`;
  // const title = 'Space@8564';
  const desc = "Automation space description";

  cy.wrap(title).as("spaceTitle");
  cy.wrap(desc).as("spaceDescription");

  spacePage.openCreateSpaceModal();
  spacePage.typeTitle(title);
  spacePage.typeDescription(desc);
  spacePage.openMembersDropdown();
  spacePage.selectOption(1).then((name) => {
    cy.wrap(name).as("selectedMemberName");
  });

  spacePage.clickSave();
  spacePage.assertSpaceToast("space", "contains");
};

const createSpaceWithGivenTitle = (title) => {
  spacePage.openCreateSpaceModal();
  spacePage.typeTitle(title);
  spacePage.clickSave();
  spacePage.assertSpaceToast("space", "contains");
};

// -----------------------------
// Background
// -----------------------------
Given("I am logged in and on the Spaces page", () => {
  cy.session("validUserSession", () => {
    loginPage.visit();
    loginPage.enterEmail(env.users.valid.email);
    loginPage.enterPassword(env.users.valid.password);
    loginPage.clickLoginButton();
    cy.url().should("include", "/dashboard");
  });

  spacePage.visitSpaces();
});

// ==========================================================
// 1) BASIC UI
// ==========================================================

Then("I should see the Spaces page title", () => { 
  spacePage.getPageTitle("Spaces");
});

Then("I should see the Create Space button", () => {
  spacePage.getCreateSpaceButton().should("be.visible");
});

Then("I should see the search spaces input", () => {
  spacePage.getSearchInput().should("be.visible");
});

Then("I should see the sort by dropdown", () => {
  spacePage.getSortDropdown().should("be.visible");
});

Then("I should see the left sidebar space list", () => {
  cy.wait(2000);
  spacePage.getSidebarItems().its("length").should("be.greaterThan", 1);
});

Then("I should see at least one space card on the grid", () => {
  spacePage.getAllSpaceCards().its("length").should("be.greaterThan", 0);
});

When("I open the Create Space modal", () => {
  spacePage.openCreateSpaceModal();
  cy.wait(2000);
});

Then("I should see title field on create space modal", () => {
  spacePage.getTitleInput().should("be.visible");
});

Then("I should see description field on create space modal", () => {
  spacePage.getDescriptionInput().should("be.visible");
});

Then("I should see members dropdown on create space modal", () => {
  cy.get(spacePage.locators.membersInput).should("be.visible");
});

Then("I should see Cancel button on create space modal", () => {
  spacePage.getCancelButton().should("be.visible");
});

Then("I should see Save button on create space modal", () => {
  spacePage.getSaveButton().should("be.visible");
});

// ==========================================================
// 2) CREATE SPACE – POSITIVE & NEGATIVE
// ==========================================================

Then("the Save Space button should be disabled", () => {
  spacePage.getSaveButton().should("be.disabled");
});

When("I enter a unique space title", () => {
  const title = `Space_${Date.now()}`;
  cy.wrap(title).as("spaceTitle");
  spacePage.typeTitle(title);
});

Then("the Save Space button should be enabled", () => {
  spacePage.getSaveButton().should("not.be.disabled");
});

When("I save the space", () => {
  spacePage.clickSave();
});

Then("I should see a success message for space creation", () => {
  spacePage.assertSpaceToast("Space created successfully!", "eq");
});

Then("the created space card should be visible in the grid", () => {
    cy.wait(2000); // wait for UI to update
  cy.get("@spaceTitle").then((title) => {
    spacePage.getSpaceCard(title).should("be.visible");
    cy.log(`Verified space card with title: ${title}`);
  });
});

Then("the created space should be visible in the left sidebar list", () => {
    cy.wait(2000); // wait for UI to update
cy.get("@spaceTitle").then((title) => {
  const spaceTitle = String(title);
  cy.log(`Verifying space in sidebar: ${spaceTitle}`);
  assertValueInList(spacePage.locators.sidebarItem, spaceTitle, "contains");
});

});

When("I enter a description for the space", () => {
  const desc = `Desc_${Date.now()}`;
  cy.wrap(desc).as("spaceDescription");
  spacePage.typeDescription(desc);
});

Then("the created space card should show the same title and description",() => {
  cy.wait(2000); // wait for UI to update
    cy.get("@spaceTitle").then((title) => {
      cy.get("@spaceDescription").then((desc) => {
        spacePage.getSpaceCardText(title).then((text) => {
          const cardText = text.replace(/\s+/g, " ");
          expect(cardText).to.include(title);
          expect(cardText).to.include(desc);
        });
      });
    });
  }
);

When("I select one member from the members dropdown", () => {
  spacePage.openMembersDropdown();
  spacePage.selectOption("1").then((name) => {
    cy.wrap(name).as("selectedMemberName");
    
  });
});

Then("the created space card should show the same title", () => {
  cy.wait(2000); // wait for UI to update
  cy.get("@spaceTitle").then((title) => {
    spacePage.getSpaceCardText(title).then((text) => {
      expect(text).to.include(title);
    });
  });
});

Then("the created space card should show correct member count", () => {
  cy.wait(1000);
 cy.get("@spaceTitle").then((title) => {
    spacePage.getSpaceCardText(title).then((text) => {
      // Normalize spacing
      const cleaned = text
        .replace(/(\d)([A-Za-z])/g, "$1 $2") // "1Members" → "1 Members"
        .replace(/\s+/g, " ")
        .trim();
      // Extract only the Members label
      const memberMatch = cleaned.match(/\d+\s+Members/i);
      cy.log("FULL CARD TEXT:", cleaned);
      if (!memberMatch) {
        throw new Error("❌ Could not find 'X Members' inside card text");
      }
      const actual = memberMatch[0];   // e.g. "1 Members"
      const expected = "1 Members";
      cy.log("Expected:", expected);
      cy.log("Actual:", actual);

      expect(actual).to.eq(expected);
    });
  });
});

Then("the created space card should show the owner name", () => {
  cy.wait(2000);
  cy.get("@spaceTitle").then((title) => {
    cy.get(spacePage.locators.cardOwnerName).should("exist");
    spacePage.getSpaceCardInfo(title).then(({ text, avatar }) => {
      cy.log(`📝 Card Text   : ${text}`, `🖼 Avatar SRC  : ${avatar}`);
      expect(text.length, "card text length").to.be.greaterThan(0);
      expect(avatar, "avatar src").to.match(/^https?:\/\//);
    });
  });
});

When("I enter a title longer than allowed characters", () => {
  const longTitle = "A".repeat(TITLE_LIMIT + 10);
  spacePage.typeTitle(longTitle);
});

Then("the title field should not accept more characters", () => {
  spacePage.assertTitleMaxLength(TITLE_LIMIT);
});

Then("the title length should be within the allowed limit", () => {
  spacePage.assertTitleMaxLength(TITLE_LIMIT);
});

When("I enter a description longer than allowed characters", () => {
  const longDesc = "B".repeat(DESCRIPTION_LIMIT + 20);
  spacePage.typeDescription(longDesc);
});

Then("the description field should not accept more characters", () => {
  spacePage.assertDescriptionMaxLength(DESCRIPTION_LIMIT);
});

Then("the description length should be within the allowed limit", () => {
  spacePage.assertDescriptionMaxLength(DESCRIPTION_LIMIT);
});

When("I open the members dropdown", () => {
  spacePage.openMembersDropdown();
});

When("I select multiple members from the members dropdown", () => {
  spacePage.selectMultipleMembers(3).then((names) => {
    cy.wrap(names).as("selectedMembers");
  });
});

Then("the selected members should not appear again in the dropdown list", () => {
  spacePage.openMembersDropdown();
  cy.get("@selectedMembers").then((sel) => {
    cy.get(spacePage.locators.memberOption).then(($lis) => {
      const remaining = [...$lis].map((li) => li.innerText.trim());
      sel.forEach((name) => {
        expect(
          remaining,
          `Member "${name}" should not be in dropdown`
        ).to.not.include(name);
      });
    });
  });
});

When("I click on Cancel in the Create Space modal", () => {
  spacePage.clickCancel();
});

Then("the Create Space modal should be closed", () => {
  cy.get(spacePage.locators.modalRoot).should("not.exist");
});

Then("the cancelled space should not be visible in the space cards list", () => {
  cy.get("@spaceTitle").then((title) => {
    assertValueNotInList(spacePage.locators.spaceCard, title);
  });
});

Then("the cancelled space should not be visible in the left sidebar list", () => {
  cy.get("@spaceTitle").then((title) => {
    assertValueNotInList(spacePage.locators.sidebarListRoot, title);
  });
});

Given("I already have a space with a specific title", () => {
  const title = `ExistingSpace_${Date.now()}`;
  cy.wrap(title).as("existingSpaceTitle");
  createSpaceWithGivenTitle(title);
});

When("I enter the same existing space title", () => {
  cy.get("@existingSpaceTitle").then((title) => {
    spacePage.typeTitle(title);
    cy.log(`Entered existing space title: ${title}`);
  });
});

Then("I should see a duplicate space validation message", () => {
  softAssertToastMessageSoft(spacePage.locators.toast, "A space with this title already exists.", 'equals')
  });

Then("a new space card should not be created for the duplicate title",() => {
    cy.get(spacePage.locators.cancelBtn).click(); // close modal
    cy.get("@existingSpaceTitle").then((title) => {
      const regex = new RegExp(title, "i");
      spacePage.getSpaceCardText().then(($cards) => {
        const matches = [...$cards].filter((c) =>
          regex.test(c.innerText)
        );
        expect(matches.length).to.eq(0);
      });
    });
    cy.softAssertAll();
  });

// ==========================================================
// 3) VIEW / BROWSE SPACES
// ==========================================================

Given("I have a space created with title, description and members", () => {
  createSpaceWithFullDetails();
});

Then("the created space card should show projects and tasks count", () => {
  cy.get("@spaceTitle").then((title) => {
    spacePage.getSpaceCardText(title).then((text) => {
      const norm = text.replace(/\s+/g, " ");
      expect(norm).to.match(/Projects/i);
      expect(norm).to.match(/Tasks/i);
    });
  });
});

Given("I have a space created with a unique title", () => {
  const title = `SearchSpace_${Date.now()}`;
  cy.wrap(title).as("spaceTitle");
  createSpaceWithGivenTitle(title);
});

When("I search space by that title from the search box", () => {
  cy.get("@spaceTitle").then((title) => {
    spacePage.getSearchInput().clear().type(title);
  });
});

Then("only spaces matching that title should be visible in the grid", () => {
  cy.get("@spaceTitle").then((title) => {
    const spaceTitle = String(title);
    cy.log(`Verifying space in gird: ${spaceTitle}`);
    assertValueInList(spacePage.locators.spaceCard, spaceTitle, "contains");
  });
});

  

Given("I have more than one space present", () => {
  createSpaceWithFullDetails();
  cy.get("@spaceTitle").as("latestSpaceTitle");
});

// When('I sort spaces by "Latest"', () => {
//   spacePage.openSortDropdown();
//   spacePage.chooseSortOption("Latest");
// });

Then("the most recently created space should appear first in the grid", () => {
  cy.get("@latestSpaceTitle").then((title) => {
    spacePage.getAllSpaceCards().first().should("contain.text", title);
  });
});

// When('I sort spaces by "Oldest"', () => {
//   spacePage.openSortDropdown();
//   spacePage.chooseSortOption("Oldest");
// });

Then("the oldest created space should appear first in the grid", () => {
  cy.get("@latestSpaceTitle").then((latest) => {
    spacePage.getAllSpaceCards().first().should("not.contain.text", latest);
  });
});

Given("I have spaces with different titles", () => {
  createSpaceWithFullDetails();
});

When("I sort spaces by {string}", (optionLabel) => {
  spacePage.openSortDropdown();
  spacePage.chooseSortOption(optionLabel);
});

Then(
  "the space cards in the grid should be ordered alphabetically by title",
  () => {
    spacePage.getCardTitlesInOrder().then((titles) => {
      const filtered = titles.filter((t) => t);
      const sorted = [...filtered].sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" })
      );
      expect(filtered).to.deep.equal(sorted);
    });
  }
);

Then("the space card should show owner avatar", () => {
  cy.wait(1000); // wait for UI to update
  cy.get("@spaceTitle").then((title) => {
    spacePage.getSpaceCardInfo(title).then(({ text, avatar }) => {
      cy.log(`📝 Card Text   : ${text}`);
      cy.log(`🖼 Avatar SRC  : ${avatar}`);

      expect(text.length, "card text length").to.be.greaterThan(0);
      expect(avatar, "avatar src").to.match(/^https?:\/\//);
});
  });
});

Then("the space card should show owner name", () => {
  cy.wait(1000); // wait for UI to update
  cy.get("@spaceTitle").then((title) => {
    spacePage.getSpaceCardInfo(title).then(({ text, owner, avatar }) => {
      cy.log(`📝 Card Text   : ${text}`);
      cy.log(`👤 Owner Name  : ${owner}`);
      cy.log(`🖼 Avatar SRC  : ${avatar}`);

      expect(text.length, "card text length").to.be.greaterThan(0);
      expect(owner.length, "owner name length").to.be.greaterThan(0);
      expect(avatar, "avatar src").to.match(/^https?:\/\//);

  });
});
});

When("I click on the open space button on that card", () => {
  cy.wait(2000); // wait for UI to update
  cy.get("@spaceTitle").then((title) => {
    spacePage.clickOpenDetailsFromCard(title);
  });
});

Then("I should be navigated to that space details page", () => {
  cy.url().should("include", "/dashboard/view-space");
});

Then("the space details page header should show the same space title", () => {
  cy.wait(2000); // wait for UI to update
  cy.get("@spaceTitle").then((title) => {
    spacePage.getSpaceDetailsHeader().then((header) => {
      expect(header.trim()).to.include(title);
    });
  });
});

// ==========================================================
// 4) CARD MENU – EDIT & DELETE
// ==========================================================

When("I open the space card menu for that space", () => {
  cy.wait(2000); // wait for UI to update
  cy.get("@spaceTitle").then((title) => {
    spacePage.openCardMenu(title);
  });
});

Then("I should see Edit option for the space", () => {
  cy.get(spacePage.locators.menuItemEdit).should("be.visible");
});

Then("I should see Delete option for the space", () => {
  cy.get(spacePage.locators.menuItemDelete).should("be.visible");
});

When("I delete that space from the card menu", () => {
  cy.wait(2000); // wait for UI to update
  cy.get("@spaceTitle").then((title) => {
    spacePage.clickDeleteOnCard(title);
  });
});

When("I confirm the deletion in the confirmation dialog", () => {
  cy.get(spacePage.locators.confirmDeletionYesBtn).click();
});

Then("I should see a success message for space deletion", () => {
  spacePage.assertSpaceToast(/deleted|removed/i, "matches");
});

Then("that space card should no longer be visible in the grid", () => {
  cy.wait(2000); // wait for UI to update
  cy.get("@spaceTitle").then((title) => {
    assertValueNotInList(spacePage.locators.spaceCard, title);
  });
});

Then("that space should no longer be visible in the left sidebar list", () => {
  cy.get("@spaceTitle").then((title) => {
    assertValueNotInList(spacePage.locators.sidebarListRoot, title);
  });
});

// ==========================================================
// 5) EDIT SPACE
// ==========================================================

When("I open the Edit Space modal for that space", () => {
  cy.wait(2000); // wait for UI to update
  cy.get("@spaceTitle").then((title) => {
    spacePage.openEditSpaceModalForCard(title);
  });
});

Then("the Edit Space modal should be visible", () => {
  cy.get(spacePage.locators.modalRoot).should("be.visible");
});

Then("the title field should be pre-filled with existing title", () => {
  cy.wait(2000); // wait for UI to update
  cy.get("@spaceTitle").then((title) => {
    spacePage.getcardTitlefromEditModal().should("have.value", title);
  });
});

Then("the description field should be pre-filled with existing description", () => {
  cy.get("@spaceDescription").then((desc) => {
    spacePage.getDescriptionInput().should("have.value", desc);
  });
});

When("I update the space title", () => {
  const newTitle = `Updated_${Date.now()}`;
  cy.wrap(newTitle).as("updatedSpaceTitle");
  spacePage.typeTitle(newTitle);
});

When("I save the edited space", () => {
  spacePage.clickSave();
});

Then("I should see a success message for space update", () => {
  spacePage.assertSpaceToast(/update|updated|success/i, "matches");
});

Then("the space card should show the updated title", () => {
  cy.get("@updatedSpaceTitle").then((title) => {
    spacePage.getSpaceCard(title).should("be.visible");
  });
});

Then("the left sidebar should show the updated space title", () => {
  cy.get("@updatedSpaceTitle").then((title) => {
    assertValueInList(spacePage.locators.sidebarListRoot, title);
  });
});

When("I update the space description", () => {
  const newDesc = `Updated description ${Date.now()}`;
  cy.wrap(newDesc).as("updatedSpaceDescription");
  spacePage.typeDescription(newDesc);
});

Then("the space card should show the updated description", () => {
  cy.wait(2000); // wait for UI to update
  cy.get("@updatedSpaceDescription").then((desc) => {
    cy.get("@spaceTitle").then((title) => {
      spacePage.getSpaceCardText(title).then((text) => {
        expect(text).to.include(desc);
      });
    });
  });
});

When("I update the members selection from the dropdown", () => {
  spacePage.openMembersDropdown();
  spacePage.selectMemberByIndex(1).then((name) => {
    cy.wrap(name).as("newMemberName");
  });
});

Then("the space card should show the updated member count", () => {
  cy.get("@updatedSpaceTitle").then((title) => {
    spacePage.getSpaceCardText(title).then((text) => {
      const norm = text.replace(/\s+/g, " ");
      expect(norm).to.match(/\d+\s+Members?/i);
    });
  });
});

When("I click on Cancel in the Edit Space modal", () => {
  spacePage.clickCancel();
});

Then("the Edit Space modal should be closed", () => {
  cy.get(spacePage.locators.modalRoot).should("not.exist");
});

Then("the space card should still show the old space title", () => {
  cy.get("@spaceTitle").then((title) => {
    spacePage.getSpaceCard(title).should("be.visible");
  });
});
