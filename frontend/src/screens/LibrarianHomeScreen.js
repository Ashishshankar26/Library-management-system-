import React from 'react';

const LibrarianHomeScreen = ({ onLogout, onNavigate }) => {
  return (
    <div className="container">
      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>

      <h2 className="screen-heading">Welcome Librarian</h2>

      <div className="cards-grid">
        <div className="nav-card" onClick={() => onNavigate('add-book')}>
          <div className="card-header">Add New Book</div>
          <div className="card-description">Adds a new book in the library.</div>
        </div>

        <div className="nav-card" onClick={() => onNavigate('books')}>
          <div className="card-header">List of books</div>
          <div className="card-description">See the list of all the books in the library.</div>
        </div>

        <div className="nav-card" onClick={() => onNavigate('issue-book')}>
          <div className="card-header">Issue a Book</div>
          <div className="card-description">To issue a book to a student.</div>
        </div>

        <div className="nav-card" onClick={() => onNavigate('book-issue-list')}>
          <div className="card-header">Show Issued Books</div>
          <div className="card-description">To fetch the list of book issues.</div>
        </div>
      </div>
    </div>
  );
};

export default LibrarianHomeScreen;
