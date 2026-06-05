describe("Szczegoly produktu", () => {
  it("10. wyswietla pelne informacje o wybranym produkcie", () => {
    cy.visitApp("/products/1");
    cy.contains("h2", "Laptop").should("be.visible");
    cy.contains("p.description", "Lekki laptop 14 cali").should("be.visible");
    cy.contains("strong", "Cena:").parent().should("contain", "3999.99 PLN");
    cy.contains("button", "Dodaj do koszyka").should("be.visible");
    cy.contains("a", "Powrot do listy").should("be.visible");
  });

  it("11. pokazuje komunikat gdy produkt o danym id nie istnieje", () => {
    cy.visitApp("/products/999");
    cy.contains("h2", "Podglad produktu").should("be.visible");
    cy.contains("Nie znaleziono produktu").should("be.visible");
    cy.contains("button", "Odswiez produkty").should("be.visible");
  });
});
