describe('Page d\'accueil', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('affiche le header avec le logo et la navigation', () => {
    // Vérifie le logo
    cy.get('a').contains('Time8hare').should('be.visible');

    // Vérifie les liens de navigation
    cy.get('nav').within(() => {
      cy.contains('Comment ça marche ?').should('be.visible');
      cy.contains('Services').should('be.visible');
      cy.contains('Connexion').should('be.visible');
    });
  });

  it('affiche la section héro avec les boutons d\'action', () => {
    // Vérifie le titre principal
    cy.contains('Le seul remède,').should('be.visible');
    cy.contains('c\'est le temps').should('be.visible');

    // Vérifie le sous-titre
    cy.contains('Échangez des services en blocs de 8 minutes').should('be.visible');

    // Vérifie les boutons d'action
    cy.contains('button', 'Je m\'inscris').should('be.visible');
    cy.contains('button', 'Je me connecte').should('be.visible');
  });

  it('affiche la section des catégories de services', () => {
    // Vérifie le titre de la section
    cy.contains('Nos services d\'entraide').should('be.visible');
    cy.contains('Du temps pour les autres comme seule monnaie d\'échange').should('be.visible');

    // Vérifie les catégories
    const categories = [
      'Aide à la personne',
      'Culture et loisirs',
      'Services domestiques',
      'Services numériques',
      'Éducation',
      'Administratif',
      'Bien-être',
      'Artisanat',
      'Mobilité',
      'Solidarité'
    ];

    categories.forEach(category => {
      cy.contains(category).should('be.visible');
    });
  });

  it('affiche la section "Comment ça marche"', () => {
    // Vérifie le titre de la section
    cy.contains('Comment ça marche ?').should('be.visible');

    // Vérifie les étapes
    cy.contains('Je m\'inscris').should('be.visible');
    cy.contains('Je choisis').should('be.visible');
    cy.contains('Je partage').should('be.visible');
  });

  it('vérifie la navigation vers les autres pages', () => {
    // Clique sur "Comment ça marche ?" dans le menu
    cy.contains('Comment ça marche ?').click();
    cy.url().should('include', '/how-it-works');

    // Retourne à l'accueil
    cy.visit('/');

    // Clique sur "Services" dans le menu
    cy.contains('Services').click();
    cy.url().should('include', '/services');

    // Retourne à l'accueil
    cy.visit('/');

    // Clique sur le bouton "Je m'inscris"
    cy.contains('button', 'Je m\'inscris').click();
    cy.url().should('include', '/register');

    // Retourne à l'accueil
    cy.visit('/');

    // Clique sur le bouton "Je me connecte"
    cy.contains('button', 'Je me connecte').click();
    cy.url().should('include', '/login');
  });

  it('vérifie que les liens des catégories redirigent vers la page services', () => {
    // Clique sur une catégorie
    cy.contains('Aide à la personne').click();
    cy.url().should('include', '/services?category=personal-assistance');
  });
});