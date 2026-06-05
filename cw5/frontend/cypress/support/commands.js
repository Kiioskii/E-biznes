Cypress.Commands.add("mockProductsApi", (options = {}) => {
  const { products, statusCode = 200, delay = 0 } = options;

  cy.fixture("products").then((defaultProducts) => {
    cy.intercept("GET", "**/api/products", (req) => {
      req.reply({
        statusCode,
        delay,
        body: products ?? defaultProducts
      });
    }).as("getProducts");
  });
});

Cypress.Commands.add("mockCartApi", (message = "Koszyk zapisany. Liczba sztuk: 2") => {
  cy.intercept("POST", "**/api/cart", {
    statusCode: 200,
    body: { message }
  }).as("saveCart");
});

Cypress.Commands.add("mockPaymentsApi", (message) => {
  cy.intercept("POST", "**/api/payments", (req) => {
    req.reply({
      statusCode: 200,
      body: {
        message:
          message ??
          `Platnosc przyjeta od ${req.body.fullName} na kwote ${req.body.amount} PLN. Potwierdzenie wyslane na ${req.body.email}.`
      }
    });
  }).as("processPayment");
});

Cypress.Commands.add("visitApp", (path = "/products") => {
  cy.mockProductsApi();
  cy.visit(path);
  cy.wait("@getProducts");
});
