// cypress/support/pageObjects/SpacePage.js
import { getCardByTarget,assertMaxLength, assertToastMessage, getText } from "../../utils/helpers";

class SpacePage {
        locators = {
                // ===== PAGE LEVEL =====
                pageTitle: ".css-yihcqv > .MuiBox-root",
                createSpaceBtn: ".css-o1d7uv > .MuiButton-root",
                searchInput: "input[placeholder='Search spaces...']",
                sortDropdown: "button:contains('Sort by') , button:contains('Latest')",
                sortOption: "li[role='option'], [role='menuitem']",

                // left sidebar
                sidebarListRoot: ".MuiButtonBase-root.minimal__nav__item__root.css-17fbrtk",
                sidebarItem: '.minimal__nav__item__title.css-qtxf8a', // tweak if needed

                // ===== CREATE / EDIT SPACE MODAL =====
                modalRoot: ".MuiDialog-root",
                modalTitle: ".MuiDialogTitle-root",

                titleInput: "label:contains('Title')",
                descriptionInput: "label:contains('Description')",
                membersInput: "input[role='combobox']",
                memberOption: "ul[role='listbox'] li",

                cancelBtn: ".MuiDialogActions-root button:contains('Cancel')",
                saveBtn: ".MuiDialogActions-root button:contains('Save')",

                // ===== TOAST =====
                toast: ".minimal__snackbar__title",

                // ===== SPACE CARDS (GRID) =====
                NospaceCards:".css-1jpn170:contains('No data')",
                spaceCard: ".MuiBox-root.css-glnfdb .MuiCard-root",
                cardMenuBtn: "button[aria-haspopup='menu'], button:has(svg)", // 3-dot menu
                cardOpenBtn: ".css-69i1ev > .css-1p0z0er > img", // bottom-right open icon/button
                 cardOwnerName: "span.MuiTypography-caption",
                  cardOwnerImg: "img.MuiAvatar-img",
                // ===== EDIT / DELETE MENU =====
                menuItemEdit: "li:contains('Edit'), [role='menuitem']:contains('Edit')",
                menuItemDelete:"li:contains('Delete'), [role='menuitem']:contains('Delete')",
                confirmDeletionYesBtn: ".MuiDialogActions-root > .MuiButton-contained",
                confirmDeletionNoBtn: ".MuiDialogActions-root > .MuiButton-text",
                editTitleInput: ".css-1ear9we",

                // ===== SPACE DETAILS PAGE =====
                spaceDetailsHeader: ".MuiBox-root.css-1xrb7av h4",
       };

  // --------------------------------------------------
  // NAVIGATION
  // --------------------------------------------------
  visitSpaces() {
    cy.visit("/dashboard/spaces");
  }

  // --------------------------------------------------
  // BASIC UI
  // --------------------------------------------------
getPageTitle(expectedTitle) {
  return getText(this.locators.pageTitle, expectedTitle);
}



  getCreateSpaceButton() {
    return cy.get(this.locators.createSpaceBtn);
  }

  getSearchInput() {
    return cy.get(this.locators.searchInput);
  }

  getSortDropdown() {
    return cy.get(this.locators.sortDropdown);
  }

  getSidebarItems() {
    return cy
      .get(this.locators.sidebarListRoot);
  }

  // --------------------------------------------------
  // CREATE / EDIT MODAL
  // --------------------------------------------------
  openCreateSpaceModal() {
    this.getCreateSpaceButton().click();
    cy.get(this.locators.modalRoot).should("be.visible");
  }

  openEditSpaceModalForCard(title) {
    this.openCardMenu(title);
    cy.get(this.locators.menuItemEdit).click();
    cy.get(this.locators.modalRoot).should("be.visible");
  }

  getTitleInput() {
    cy.wait(2000);
    return cy.get(this.locators.titleInput);
  }

  getDescriptionInput() {
    return cy.get(this.locators.descriptionInput).parent()
           .find("input");;
  }

  typeTitle(text) {
    this.getTitleInput().parent().find("input").clear().type(text);
  }

  typeDescription(text) {
    this.getDescriptionInput().clear().type(text);
  }

  openMembersDropdown() {
    cy.get(this.locators. membersInput).should("be.visible")
    .click({force:true});   
  }

  // select one member by index, return its name
 selectOption(value) {
  return getCardByTarget(this.locators.memberOption, value, "selectedMemberName").click();
 
}

  // select first n members, return array of names
selectMultipleMembers(count = value) {
  const selected = [];
  const indexes = Array.from({ length: count }, (_, i) => i); // [0..count-1]

  return cy.wrap(indexes).each((idx) => {
    // 🔹 pehle dropdown open
    this.openMembersDropdown();
    // 🔹 ab options lo
    return cy.get(this.locators.memberOption, { timeout: 10000 }).should("be.visible").then(($items) => {
      const el = $items[idx];
      if (!el) {
        cy.log(`⚠ Index ${idx} ke liye member nahi mila`);
        return;
      }

      const name = el.innerText.trim();
      selected.push(name);

      cy.wrap(el).click();   // member select
    });
  }).then(() => selected);
}




  getSaveButton() {
    return cy.get(this.locators.saveBtn);
  }

  getCancelButton() {
    return cy.get(this.locators.cancelBtn);
  }

  clickSave() {
    this.getSaveButton().click();
  }

  clickCancel() {
    this.getCancelButton().click();
  }

  // --------------------------------------------------
  // TOAST (generic helper)
  // --------------------------------------------------
  assertSpaceToast(expected, mode = "eq") {
    return assertToastMessage(this.locators.toast, expected, mode);
  }

  // --------------------------------------------------
  // SPACE CARDS (GRID)
  // --------------------------------------------------
  getAllSpaceCards() {
    return cy.get(this.locators.spaceCard);
  }
  
  NoSpaceCard(){
    return cy.get(this.locators.NospaceCards).should('be.visible').invoke('text').then((text)=>{
        cy.log(text);
    });
  }

  selectSpace(target) {
  cy.get(this.locators.spaceCard).then(($cards) => {
    
    // Index based selection
    if (!isNaN(target)) {
      cy.wrap($cards.eq(target))
        .find('.css-1w5exeq')       // 👈 only title
        .invoke("text")
        .then((title) => cy.wrap(title.trim()).as("spaceTitle"));
        
      cy.wrap($cards.eq(target)).click({force:true});
      return;
    }

    // Name based selection
    cy.contains(this.locators.spaceCards + ".css-1w5exeq", target)
      .click({force:true})
      .invoke("text")
      .then((title) => cy.wrap(title.trim()).as("spaceTitle"));
  });
}



  // use generic card helper: target can be index (0,1,2...) or title string
  getSpaceCard(target) {
    return getCardByTarget(this.locators.spaceCard, target, "selectedSpace");
  }

  getSpaceCardInfo(title) {
  return this.getSpaceCard(title).then(($card) => {
    const text = $card.text().trim();
    const owner = $card.find(this.locators.cardOwnerName).text().trim();
    const avatar = $card.find(this.locators.cardOwnerImg).attr("src");

    return { text, owner, avatar };
  });
}



  getSpaceCardText(target) {
    return this.getSpaceCard(target).invoke("text");
  }

  getCardTitlesInOrder() {
    return this.getAllSpaceCards().then(($cards) => {
      const titles = [...$cards].map((c) => {
        const t = c.querySelector(".MuiTypography-root");
        return t ? t.innerText.trim() : "";
      });
      return titles;
    });
  }

  clickOpenDetailsFromCard(title) {
    this.getSpaceCard(title).find(this.locators.cardOpenBtn).click();
  }

  // --------------------------------------------------
  // CARD MENU (EDIT / DELETE)
  // --------------------------------------------------
  openCardMenu(title) {
    this.getSpaceCard(title).find(this.locators.cardMenuBtn).click();
  }

  getcardTitlefromEditModal() {
    return cy.get(this.locators.editTitleInput).eq(0);
  }

  clickDeleteOnCard(title) {
    this.openCardMenu(title);
    cy.get(this.locators.menuItemDelete).click();
  }

  // --------------------------------------------------
  // SORT
  // --------------------------------------------------
  openSortDropdown() {
    this.getSortDropdown().click();
  }

  chooseSortOption(label) {
    const regex = new RegExp(label, "i");
    cy.get(this.locators.sortOption).contains(regex).click();
  }

  // --------------------------------------------------
  // SPACE DETAILS
  // --------------------------------------------------
  getSpaceDetailsHeader() {
    return cy.get(this.locators.spaceDetailsHeader)
    .should("exist")
    .invoke("text");
  }

  // --------------------------------------------------
  // LENGTH VALIDATIONS (using helper)
  // --------------------------------------------------
  assertTitleMaxLength(max = 40) {
    return assertMaxLength(this.locators.titleInput, max);
  }

  assertDescriptionMaxLength(max = 80) {
    return assertMaxLength(this.locators.descriptionInput, max);
  }
}

export default SpacePage;
