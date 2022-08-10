/// <reference types="cypress" />

// Existing and non-existing location
describe('Jobs Search', () => {

  beforeEach(() => {
    cy.visit('/');

    cy.get('#onetrust-accept-btn-handler').click();
    cy.get('.header_content__LmDsk > .button_base__KzM17').click();
    cy.get('h1').should('have.text', 'Find a Care Assistant job');
    cy.wait(3000);
  });

  context('Happy path', () => {
    // wait for results
    it('searches care assistant jobs by typing a location', () => {
      cy.get('.location-search-input').focus().type('Trafford', { force: true });
      cy.get('.locationSearchInput_dropdown__KG52s').within(() => {
          cy.contains('Trafford Park').click({ force: true });
      });
      cy.get('.container .heading_title__JbHD_').should('have.text', '“Trafford Park”');
      cy.get('span[class *= "jobs_text__XNjpt"]').should('have.text', 'Showing 63 job openings for your search:');
    })

    it('searches care assistant jobs by location by clicking the "Find a job near me" link button', () => {
      cy.visitWithMockGeolocation(51.5072, 0.1276);   // it searches for London, UK.
      
      cy.get('button[class = "heroSearch_location__3Zyhj"]').click({ force: true });
      cy.get('.container .heading_title__JbHD_').should('have.text', '“London, SE28 8NJ”');
      cy.get('span[class *= "jobs_text__XNjpt"]').should('have.text', 'Showing 28 job openings for your search:');
    })
  });

  context('Negative tests', () => {
    it('attempts to display care assistant jobs in a location where Cera Care does not have presence using the "Find a job near me" link button', () => {
      cy.visitWithMockGeolocation(22.2331, -97.8610);   // it searches for Tampico, Tamps. MX.

      cy.get('button[class = "heroSearch_location__3Zyhj"]').click({ force: true });
      cy.get('div[class *= "jobs_texts"] h2').should('have.text', '“Tampico, 89180”');
      cy.get('span[class *= "jobs_text__XNjpt"]').should('have.text', 'Sorry, we haven’t found any job openings for your search:');
    });

    /**
     * There should be a test when the user types a location where Cera Care does not have presence (not using the "Find a job near me" link button),
     * but that scenario is not present in the application. If I type "Altamira", the only warning that appears is "Please enter a city, town or postcode".
     * I suggested an approach for this scenario in the test plan.
     * 
     * On the other hand, if the scenario deployed in the application is valid, this would be the test.-
     */
    it('attemps to display care assistant jobs in a location where Cerca Care does not have presence by typing a location', () => {
      cy.get('.location-search-input').focus().type('Altamira', { force: true });
      cy.get('span[class *= "locationSearchInput_errorMessage"]').should('have.text', 'Please enter a city, town or postcode');
    });
  });

});
