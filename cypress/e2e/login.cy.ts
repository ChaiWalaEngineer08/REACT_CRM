describe('Login flow', () => {
  it('allows the demo user to log in and reach the dashboard', () => {
    // visit the login page
    cy.visit('/login');

    // check that the form is present
    cy.get('form').should('exist');
    cy.get('input[name="email"]').should('have.attr', 'type', 'email');
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');

    // fill in credentials
    cy.get('input[name="email"]').type('admin@demo.com');
    cy.get('input[name="password"]').type('@Passw0rd');

    // submit
    cy.contains('button', 'Login').click();

    // should redirect to `/dashboard`
    cy.url().should('include', '/dashboard');

    // dashboard heading present
    cy.contains('h4', 'Dashboard').should('be.visible');
  });
});
