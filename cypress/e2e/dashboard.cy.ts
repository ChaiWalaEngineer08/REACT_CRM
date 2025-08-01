import type { Client } from '../../src/types/clients';

describe('Dashboard KPIs & Navigation', () => {
  beforeEach(() => {
    // logs in via UI and sets Cypress.env('TOKEN') + localStorage, then lands on /dashboard
    cy.uiLogin('admin@demo.com', '@Passw0rd');
  });

  it('displays correct KPI values', () => {
    // fetch the *full* clients list (same one your hook uses)
    cy.request({
      method: 'GET',
      url: `${Cypress.env('API_BASE')}/clients/all`,
      headers: {
        Authorization: `Bearer ${Cypress.env('TOKEN')}`,
      },
    }).then(({ body }) => {
      const clients = body as Client[];
      const total = clients.length;
      const active = clients.filter((c) => c.status === 'active').length;
      const thisMonth = new Date().toISOString().slice(0, 7);
      const newThisMonth = clients.filter((c) =>
        c.createdAt.startsWith(thisMonth),
      ).length;
      const mrr = clients.reduce((sum, c) => sum + c.monthlySpend, 0);

      // assert each KPI card by finding the <Box role="button"> that contains the label
      // Total Clients (button)
      cy.contains('[role="button"]', 'Total Clients').should('contain', total);

      // Active Clients (static card)
      cy.contains('Active Clients')
        .parent() // or closest box/card
        .should('contain', active);

      // New This Month (static)
      cy.contains('New This Month').parent().should('contain', newThisMonth);

      // MRR (static)
      cy.contains('MRR').parent().should('contain', `$${mrr}`);
    });
  });

  it('navigates to Clients page when Total Clients card is activated', () => {
    // press Enter on the Total Clients card
    cy.contains('[role="button"]', 'Total Clients').focus().type('{enter}');

    cy.url().should('include', '/clients');
  });
});
