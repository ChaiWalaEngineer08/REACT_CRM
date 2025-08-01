describe('Clients CRUD workflow', () => {
  beforeEach(() => {
    cy.uiLogin('admin@demo.com', '@Passw0rd');
    cy.visit('/clients');
  });

  it('shows seeded clients in the table', () => {
    cy.contains('td', 'Geneva Swifta').should('be.visible');
    cy.contains('td', 'Lina Kertzmann').should('be.visible');
  });

  it('filters by global search', () => {
    cy.get('input[aria-label="Search clients"]').type('Mabel');
    cy.contains('td', 'Mabel Kassulke').should('exist');
    cy.contains('td', 'Jeneva Jwift').should('not.exist');
  });

  it('creates, edits, then deletes a client', () => {
    // open create dialog
    cy.contains('button', 'Create New Client').click();

    // empty submit shows errors
    cy.get('button[aria-label="Create client"]').click();
    cy.contains('Name is required').should('be.visible');
    cy.contains('E-mail is required').should('be.visible');

    // duplicate email check
    cy.get('#name-field').type('Foo Bar');
    cy.get('#email-field').type('geneva.swift@mail.com');
    cy.get('#phone-field').type('1234567890');
    cy.get('button[aria-label="Create client"]').click();
    cy.contains('E-mail is already registered').should('be.visible');

    // now unique data
    cy.get('#email-field').clear().type('foo.bar@mail.com');
   cy.get('button[aria-label="Create client"]').click();
    cy.contains('New Client Record Added').should('be.visible');

    // assert row appears
    cy.contains('td', 'Foo Bar').should('exist');

    // EDIT it
    cy.contains('td', 'Foo Bar').closest('tr').as('newRow');
    cy.get('@newRow').find('[aria-label="Edit client Foo Bar"]').click();
    cy.get('#name-field').clear().type('Foo Baz');
    cy.get('button[aria-label="Save client"]').click();
    cy.contains('Client Record Updated').should('be.visible');
    cy.contains('td', 'Foo Baz').should('exist');

    // DELETE it
    cy.contains('td', 'Foo Baz').closest('tr').as('updatedRow');
    cy.get('@updatedRow').find('[aria-label="Delete client Foo Baz"]').click();
    cy.contains('button', 'Delete').click({ force: true });
    cy.contains('Client Record Deleted').should('be.visible');
    cy.contains('td', 'Foo Baz').should('not.exist');
  });

  it('shows per-field validation errors for bad inputs', () => {
  // open the dialog
  cy.contains('button', 'Create New Client').click();

  // type invalid values
  cy.get('#name-field').clear().type('A');                   // 1 char
  cy.get('#email-field').clear().type('not-an-email');       // no @
  cy.get('#phone-field').clear().type('12345');              // too short

  // click the create submit inside the dialog
  cy.get('button[aria-label="Create client"]').click();

  // assert each validation message
  cy.contains('Name must be at least 2 characters').should('be.visible');
  cy.contains('Invalid e-mail address').should('be.visible');
  cy.contains('Must be exactly 10 digits').should('be.visible');
});

});
