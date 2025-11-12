class DashboardMenuPage {
  locators = {
    clickSideBarButton: ".css-qi7j1m",
  };

  clickSideBarButton() {
    cy.get(this.locators.clickSideBarButton).click();
  }
  getLogo() {
    return cy.get("a[aria-label='Logo']");
  }

  verifyLogoVisible() {
    this.getLogo().should("be.visible");
  }

  clickLogo() {
    this.getLogo().filter(":visible").should("have.length", 1).click();
  }

  getMenuItems() {
    cy.get("nav.minimal__nav__section__vertical a[href]").as("menuItems");
    cy.get("@menuItems")
      .should("have.length.greaterThan", 0)
      .each(($el, index) => {
        // Loop through each item
        const itemText = $el.text(); // Get the text of the menu item
        cy.log(`Menu Item ${index + 1}: ${itemText}`); // Log each item on a new line with an index
      });
  }

  verifyMenuUrls() {
    const menuItemsData = [];
    cy.get("@menuItems")
      .each(($el) => {
        const itemName = $el.text(); // Get the text of the menu item
        const href = $el.attr("href"); // Get the link (href attribute) of the menu item

        // Log a table-like format
        cy.log(` ${itemName} | Link: ${href}`);

        menuItemsData.push({
          "Item Name": itemName,
          Link: href,
        });

        // Ensure the URL is not empty
        expect(href, "Menu item URL should exist").to.not.be.empty;
      })
      .then(() => {
        // After the loop is done, print the table to the browser console
        console.table(menuItemsData);
      });
  }

  navigateThroughMenuItems() {
    this.getMenuItems();
    cy.get("@menuItems").each(($el, index, $list) => {
      const itemText = $el.text().trim();
      cy.wrap($el).scrollIntoView().click({ force: true });

      // Wait for route or UI update
      cy.location("pathname", { timeout: 10000 }).should(
        "include",
        $el.attr("href")
      );

      cy.log(`✅ Visited Menu: ${itemText}`);

      // Re-fetch the menu again because React rerenders DOM
      cy.get("nav.minimal__nav__section__vertical a[href]").as("menuItems");
    });
  }

  verifyPageLoaded() {
    cy.get("body").should("exist");
  }

  clickMenu(menuName) {
    cy.contains("a", menuName).click({ force: true });
  }
}

export default DashboardMenuPage;
