// CRUD Tests - 05 Blog Platform
describe('CRUD Operations - 05 Blog Platform', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3005/api/reset');
    cy.visit('/');
    cy.get('.nav-link[data-page="posts"]').click();
    cy.get('#posts-list').should('be.visible');
  });

  it('shows seeded items on posts list', () => {
    cy.get('#posts-list .item-card').should('have.length.gte', 1);
  });

  it('creates a new item successfully', () => {
    cy.get('#btn-add-new').click();
    cy.get('#field-title').type('Test Blog Post');
    cy.get('#field-description, #field-content, #field-review, #field-notes').first().type('Test description for new item');
    cy.get('#btn-submit').click();
    cy.get('#page-posts').should('not.have.class', 'hidden');
    cy.get('#posts-list').should('contain', 'Test Blog Post');
  });

  it('shows new item in the list after creation', () => {
    const title = 'Unique Item ' + Date.now();
    cy.get('#btn-add-new').click();
    cy.get('#field-title').type(title);
    cy.get('#btn-submit').click();
    cy.get('#posts-list').should('contain', title);
  });

  it('item card has view button', () => {
    cy.get('#posts-list .item-card').first().find('.btn-view').should('be.visible');
  });

  it('item card has edit button', () => {
    cy.get('#posts-list .item-card').first().find('.btn-edit-card').should('be.visible');
  });

  it('item card has delete button', () => {
    cy.get('#posts-list .item-card').first().find('.btn-delete-card').should('be.visible');
  });

  it('view button shows detail page', () => {
    cy.get('#posts-list .item-card').first().find('.btn-view').click();
    cy.get('#page-detail').should('not.have.class', 'hidden');
  });

  it('detail page has back button', () => {
    cy.get('#posts-list .item-card').first().find('.btn-view').click();
    cy.get('#btn-back').should('be.visible');
  });

  it('detail page has edit button', () => {
    cy.get('#posts-list .item-card').first().find('.btn-view').click();
    cy.get('#btn-edit').should('be.visible');
  });

  it('detail page has delete button', () => {
    cy.get('#posts-list .item-card').first().find('.btn-view').click();
    cy.get('#btn-delete').should('be.visible');
  });

  it('back button returns from detail to list', () => {
    cy.get('#posts-list .item-card').first().find('.btn-view').click();
    cy.get('#btn-back').click();
    cy.get('#page-posts').should('not.have.class', 'hidden');
  });

  it('edit button from list opens edit form', () => {
    cy.get('#posts-list .item-card').first().find('.btn-edit-card').click();
    cy.get('#page-add').should('not.have.class', 'hidden');
    cy.get('#item-id').invoke('val').should('not.be.empty');
  });

  it('edit form is pre-filled with existing values', () => {
    cy.get('#posts-list .item-card').first().find('.btn-edit-card').click();
    cy.get('#field-title').invoke('val').should('not.be.empty');
  });

  it('can update an existing item', () => {
    cy.get('#posts-list .item-card').first().find('.btn-edit-card').click();
    cy.get('#field-title').clear().type('Updated Post Title');
    cy.get('#btn-submit').click();
    cy.get('#posts-list').should('contain', 'Updated Post Title');
  });

  it('delete shows confirmation dialog', () => {
    cy.on('window:confirm', () => false);
    cy.get('#posts-list .item-card').first().find('.btn-delete-card').click();
  });

  it('confirming delete removes item from list', () => {
    cy.get('#posts-list .item-card').then($cards => {
      const initialCount = $cards.length;
      cy.on('window:confirm', () => true);
      cy.get('#posts-list .item-card').first().find('.btn-delete-card').click();
      cy.get('#posts-list .item-card').should('have.length', initialCount - 1);
    });
  });

  it('api returns items as array', () => {
    cy.request('/api/posts').its('body').should('be.an', 'array');
  });

  it('api create endpoint returns 201', () => {
    cy.request({
      method: 'POST',
      url: '/api/posts',
      body: {"title": "Test Blog Post", "content": "Post content here.", "author": "Test Author", "category": "Technology", "tags": "test", "status": "published"},
    }).its('status').should('eq', 201);
  });

  it('dashboard shows total count on stat card', () => {
    cy.visit('/');
    cy.get('#stat-total').invoke('text').then(count => {
      expect(parseInt(count)).to.be.gte(0);
    });
    cy.get('.stat-card').should('have.length', 3);
  });
});
