/*
Installer le plugin mailslurp :
npm install --save-dev cypress-mailslurp

et l'importer dans le script cypress/support/e2e.js
import "cypress-mailslurp"
*/

import { faker } from '@faker-js/faker';

const creationPassword = faker.internet.password();
const newPassword = faker.internet.password();
const creationFirstname = faker.name.firstName();
const creationLastname = faker.name.lastName();

describe('Reinitialiser le mot de passe', function () {
        before(function () {
                cy.clearCookies();
                return cy
                        .mailslurp()
                        .then(mailslurp => mailslurp.createInbox())
                        .then(inbox => {
                                // save inbox id and email address to this (make sure you use function and not arrow syntax)
                                cy.wrap(inbox.id).as('inboxId');
                                cy.wrap(inbox.emailAddress).as('emailAddress');
                                //cy.log(inbox);
                        });
        });
        it('Create the fake account', function () {
                cy.visit('/');
                cy.get('[data-qa="accept-cta"]').click();
                cy.get('[data-test="icon-avatar"]').click();
                cy.get('#email').type(this.emailAddress);
                cy.get('#submit-login').click();
                cy.get('#password').type(creationPassword);
                cy.get('#first-name').type(creationFirstname);
                cy.get('#last-name').type(creationLastname);
                cy.get('#submit-signup').click();
                cy.wait(2000);
                cy.contains("C'EST DUR À CROIRE.");
        });
        it('Get a new password', function () {
                //cy.log(this.emailAddress);
                expect(this.emailAddress).to.contain('@mailslurp');
                cy.visit('/');
                cy.get('[data-qa="accept-cta"]').click();
                cy.get('[data-test="icon-avatar"]').click();
                cy.get('#email').type(this.emailAddress);
                cy.get('#submit-login').click();
                cy.get('.mb-7').click();
                //Si jamais j'ai besoin du champs où rentrer l'email :
                //cy.get('#email')
                cy.get('[data-test="password-reset-submit-button"]').click();
                cy.contains("Wouhou !");
                // A partir de là, on va chercher le mail :
                cy.mailslurp().then(mailslurp => mailslurp.waitForLatestEmail(this.inboxId, 40000, true)).then(email => 
                        cy.document().invoke('write', email.body));
                cy.get('.t_pt20px > a').click();
                cy.get('#newPassword').type(newPassword);
                cy.get('#newPasswordConfirmation').type(newPassword);
                cy.get('._1xMx-RYw').click();
                cy.get('.title-3').should("contain", "Qui va là ?");
                cy.get('#email').type(this.emailAddress);
                cy.get('#submit-login').click();
                cy.get('#password').type(newPassword);
                cy.get('#submit-login').click();
                cy.contains("Nos meilleures ventes");
        })
})