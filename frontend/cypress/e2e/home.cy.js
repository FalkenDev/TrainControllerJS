describe("Home", () => {
  it("Check Marker if single marker", () => {
    cy.visit("localhost:5173");
    cy.wait(30000);
    cy.contains("button", "Visa Position").click();
    cy.get('.leaflet-marker-icon[style*="opacity: 1"]').should(
      "have.length",
      1,
    );
  });
  it("Check Marker if single list item", () => {
    cy.visit("localhost:5173");
    cy.wait(30000);
    cy.get('input[type="checkbox"].appearance-none').click({ force: true });
    cy.get('.leaflet-marker-icon[style*="opacity: 1"]:first').click({
      force: true,
    });
    cy.get(".h-full.w-full.p-3.overflow-y-scroll.maxHeight")
      .children("div")
      .should("have.length", 1);
  });
});
