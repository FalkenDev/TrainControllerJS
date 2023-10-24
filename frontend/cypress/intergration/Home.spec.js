describe("My Vue 3 Component", () => {
  it("Displays the correct title", () => {
    // Visit your app's URL (adjust as needed)
    cy.visit("https://traincontroller.netlify.app/");

    // Assert that the title has the correct text
    cy.get("h1").should("contain", "TrainControllerJS");
  });
});
