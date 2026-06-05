describe("Platnosci", () => {
  it("20. wysyla formularz platnosci i pokazuje potwierdzenie", () => {
    cy.mockPaymentsApi();
    cy.visitApp();
    cy.contains("li.item", "Mysz bezprzewodowa").find("button.btn-primary").click();
    cy.get("nav.nav").contains("Koszyk").click();

    cy.contains("h2", "Platnosci").should("be.visible");
    cy.contains("p", "Do zaplaty: 149.00 PLN").should("be.visible");

    cy.get('input[name="fullName"]').type("Jan Kowalski");
    cy.get('input[name="email"]').type("jan.kowalski@example.com");
    cy.get('input[name="address"]').type("ul. Testowa 1, Warszawa");

    cy.contains("button", "Zaplac").click();
    cy.wait("@processPayment");
    cy.contains("Platnosc przyjeta od Jan Kowalski na kwote 149 PLN").should("be.visible");
  });
});
