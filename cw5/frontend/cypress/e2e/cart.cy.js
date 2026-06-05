describe("Koszyk", () => {
  beforeEach(() => {
    cy.visitApp();
  });

  it("12. dodaje produkt do koszyka z listy produktow", () => {
    cy.contains("li.item", "Laptop").find("button.btn-primary").click();
    cy.get("nav.nav").contains("a", "Koszyk (1)").should("be.visible");
  });

  it("13. zwieksza ilosc gdy ten sam produkt jest dodawany ponownie", () => {
    cy.contains("li.item", "Laptop").find("button.btn-primary").click();
    cy.contains("li.item", "Laptop").find("button.btn-primary").click();
    cy.get("nav.nav").contains("a", "Koszyk (2)").should("be.visible");
  });

  it("14. wyswietla dodane pozycje na stronie koszyka", () => {
    cy.contains("li.item", "Klawiatura mechaniczna").find("button.btn-primary").click();
    cy.get("nav.nav").contains("Koszyk").click();
    cy.contains("h2", "Koszyk").should("be.visible");
    cy.contains("span", "Klawiatura mechaniczna").should("be.visible");
    cy.contains("p.total", "329.50 PLN").should("be.visible");
  });

  it("15. zwieksza ilosc pozycji przyciskiem plus", () => {
    cy.contains("li.item", "Mysz bezprzewodowa").find("button.btn-primary").click();
    cy.get("nav.nav").contains("Koszyk").click();
    cy.contains("li.item", "Mysz bezprzewodowa").find("button.btn-secondary").contains("+").click();
    cy.contains("li.item", "Mysz bezprzewodowa").contains("span", "2").should("be.visible");
    cy.contains("p.total", "298.00 PLN").should("be.visible");
  });

  it("16. zmniejsza ilosc pozycji przyciskiem minus", () => {
    cy.contains("li.item", "Laptop").find("button.btn-primary").click();
    cy.contains("li.item", "Laptop").find("button.btn-primary").click();
    cy.get("nav.nav").contains("Koszyk").click();
    cy.contains("li.item", "Laptop").find("button.btn-secondary").contains("-").click();
    cy.contains("li.item", "Laptop").contains("span", "1").should("be.visible");
    cy.contains("p.total", "3999.99 PLN").should("be.visible");
  });

  it("17. usuwa pozycje z koszyka gdy ilosc spadnie do zera", () => {
    cy.contains("li.item", "Laptop").find("button.btn-primary").click();
    cy.get("nav.nav").contains("Koszyk").click();
    cy.contains("li.item", "Laptop").find("button.btn-secondary").contains("-").click();
    cy.contains("span", "Laptop").should("not.exist");
    cy.get("nav.nav").contains("a", "Koszyk (0)").should("be.visible");
  });

  it("18. pokazuje komunikat o pustym koszyku", () => {
    cy.get("nav.nav").contains("Koszyk").click();
    cy.contains("Dodaj produkty do koszyka.").should("be.visible");
    cy.contains("button", "Wyslij koszyk").should("be.disabled");
  });

  it("19. wysyla koszyk do API i pokazuje potwierdzenie", () => {
    cy.mockCartApi("Koszyk zapisany. Liczba sztuk: 1");
    cy.contains("li.item", "Laptop").find("button.btn-primary").click();
    cy.get("nav.nav").contains("Koszyk").click();
    cy.contains("button", "Wyslij koszyk").click();
    cy.wait("@saveCart");
    cy.contains("Koszyk zapisany. Liczba sztuk: 1").should("be.visible");
  });
});
