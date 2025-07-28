// cypress/support/commands.ts



// 1) Tell TypeScript about our new commands:
declare global {
  namespace Cypress {
    interface Chainable {
      uiLogin(email: string, password: string): Chainable<void>
      loginApi(email: string, password: string): Chainable<string>
    }
  }
}

// 2) UI‐based login, then extract token into Cypress.env('TOKEN')
Cypress.Commands.add('uiLogin', (email: string, pw: string) => {
  cy.visit('/login')
  cy.get('input[name="email"]').type(email)
  cy.get('input[name="password"]').type(pw, { log: false })
  cy.contains('button', 'Login').click()
  // after redirect, grab token from localStorage
 cy.window()
  .its('localStorage.token')
  .then((token) => {
    // now using Chai’s expect, which takes an optional message
    cy.wrap(token).should('be.a', 'string')
    Cypress.env('TOKEN', token as string)
  })

})

// 3) Pure‐API login, stash in both localStorage and Cypress.env
Cypress.Commands.add('loginApi', (email: string, password: string) => {
  return cy
    .request<{ token: string }>({
      method: 'POST',
      url: `${Cypress.env('API_BASE')}/login`,
      body: { email, password },
    })
    .its('body.token')
    .should('be.a', 'string')
    .then((token) => {
      Cypress.env('TOKEN', token)
      cy.visit('/dashboard', {
        onBeforeLoad(win) {
          win.localStorage.setItem('token', token)
        },
      })
      return token
    })
})
