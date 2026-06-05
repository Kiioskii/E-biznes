describe("Lista produktow", () => {
  it("5. pobiera i wyswietla liste produktow z API", () => {
    cy.visitApp();
    cy.contains("h2", "Produkty").should("be.visible");
    cy.get("ul.list li.item").should("have.length", 3);
    cy.contains("strong", "Laptop").should("be.visible");
    cy.contains("small", "3999.99 PLN").should("be.visible");
  });

  it("6. pokazuje stan ladowania podczas pobierania produktow", () => {
    cy.mockProductsApi({ delay: 800 });
    cy.visit("/products");
    cy.contains("Ladowanie...").should("be.visible");
    cy.wait("@getProducts");
    cy.contains("Ladowanie...").should("not.exist");
  });

  it("7. pokazuje komunikat bledu gdy API produktow zawiedzie", () => {
    cy.mockProductsApi({ statusCode: 500 });
    cy.visit("/products");
    cy.wait("@getProducts");
    cy.contains("p.error", "Nie udalo sie pobrac produktow.").should("be.visible");
  });

  it("8. odswieza liste produktow po kliknieciu przycisku Odswiez", () => {
    cy.visitApp();
    cy.get("button.btn-secondary").contains("Odswiez").click();
    cy.wait("@getProducts");
    cy.get("ul.list li.item").should("have.length", 3);
  });

  it("9. przechodzi do szczegolow produktu po kliknieciu nazwy", () => {
    cy.visitApp();
    cy.contains("a.product-link", "Mysz bezprzewodowa").click();
    cy.url().should("include", "/products/2");
    cy.contains("h2", "Mysz bezprzewodowa").should("be.visible");
  });
});
