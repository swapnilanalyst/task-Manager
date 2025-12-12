class TableHelper {
  constructor(tableLocator) {
    this.table = tableLocator;      // main table locator passed dynamically
  }

  getRows() {
    return cy.get(`${this.table} tbody tr`);
  }

  getColumns() {
    return cy.get(`${this.table} thead tr th`);
  }

  getRowCount() {
    return this.getRows().its('length');
  }

  getColumnCount() {
    return this.getColumns().its('length');
  }

  getCell(row, col) {
    return cy.get(`${this.table} tbody tr`).eq(row).find('td').eq(col);
  }

  getRowData(row) {
    return cy.get(`${this.table} tbody tr`).eq(row).find('td').then($cells => {
      return [...$cells].map(cell => cell.innerText.trim());
    });
  }

  getColumnData(col) {
    return cy.get(`${this.table} tbody tr td:nth-child(${col+1})`)
      .then($cells => [...$cells].map(c => c.innerText.trim()));
  }

  findRowByText(text) {
    return cy.get(`${this.table} tbody tr`).contains(text).parent();
  }

  validateTotalRows(expected) {
    this.getRowCount().should('eq', expected);
  }

  /** ⭐ Full table print with headers (Beautiful Output) */
  printTableWithHeaders() {
  cy.get(`${this.table} thead th`).then($header => {
    const headers = [...$header].map(h => h.innerText.trim());
    cy.log(`📌 Table Headers → ${headers.join(" | ")}`);

    cy.get(`${this.table} tbody tr`).each(($row, i) => {
      const rowData = [];
      cy.wrap($row).find('td').each(($cell) => {
        rowData.push($cell.text().trim());       // <-- FIXED HERE
      }).then(() => {
        cy.log(`Row ${i + 1} → ${rowData.join(" | ")}`);
      });
    });
  });
}

}

export default TableHelper;
