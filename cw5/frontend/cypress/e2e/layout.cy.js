describe("Layout i nawigacja", () => {
  beforeEach(() => {
    cy.visitApp();
  });

  it("1. wyswietla tytul i podtytul strony glownej", () => {
    cy.contains("h1", "Sklep internetowy").should("be.visible");
    cy.contains("p.subtitle", "React Hooks + Kotlin backend").should("be.visible");
  });

  it("2. przekierowuje nieznana sciezke na liste produktow", () => {
    cy.visit("/nieistniejaca-strona");
    cy.url().should("include", "/products");
    cy.contains("h2", "Produkty").should("be.visible");
  });

  it("3. wyswietla link nawigacyjny do listy produktow", () => {
    cy.get("nav.nav").contains("a", "Lista produktow").should("be.visible").click();
    cy.url().should("include", "/products");
  });

  it("4. wyswietla link koszyka z licznikiem 0 na starcie", () => {
    cy.get("nav.nav").contains("a", "Koszyk (0)").should("be.visible");
  });
});
