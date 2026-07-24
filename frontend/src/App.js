import React, { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState({ name: 'Librarian User', email: 'librarian@library.com', role: 'LIBRARIAN' });
  const [books, setBooks] = useState([]);
  const [myIssues, setMyIssues] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('catalog');

  // Add Book Form state
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [totalCopies, setTotalCopies] = useState(5);
  const [showAddForm, setShowAddForm] = useState(false);

  // Issue Book Modal state
  const [issuingBook, setIssuingBook] = useState(null);
  const [studentId, setStudentId] = useState('64bce14088f0b38643a177f1');
  const [issueDate, setIssueDate] = useState(() => {
    return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  });

  useEffect(() => {
    loadBooks();
    loadIssues();
  }, []);

  const loadBooks = () => {
    fetch('http://localhost:8080/book')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBooks(data);
        }
      })
      .catch((err) => console.log('Error loading books', err));
  };

  const loadIssues = () => {
    fetch('http://localhost:8080/book-issue')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMyIssues(data);
        }
      })
      .catch((err) => console.log('Error loading issues', err));
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    if (!title || !author || !isbn) return;

    const newBook = {
      title,
      author,
      isbn,
      availableCopies: Number(totalCopies),
      totalCopies: Number(totalCopies),
    };

    fetch('http://localhost:8080/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBook),
    })
      .then((res) => res.json())
      .then(() => {
        loadBooks();
        setTitle('');
        setAuthor('');
        setIsbn('');
        setShowAddForm(false);
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteBook = (id) => {
    fetch(`http://localhost:8080/book/${id}`, { method: 'DELETE' })
      .then(() => loadBooks())
      .catch((err) => console.log(err));
  };

  const openIssueModal = (book) => {
    if (book.availableCopies <= 0) {
      alert('No available copies left!');
      return;
    }
    setIssuingBook(book);
  };

  const handleConfirmIssue = (e) => {
    e.preventDefault();
    if (!studentId || !issueDate || !issuingBook) return;

    const issueRecord = {
      isbn: issuingBook.isbn,
      studentId: studentId,
      issueDate: issueDate,
      bookId: issuingBook._id,
    };

    fetch('http://localhost:8080/book-issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(issueRecord),
    })
      .then((res) => res.json())
      .then(() => {
        loadIssues();
        loadBooks();
        setIssuingBook(null);
        alert(`Book '${issuingBook.title}' successfully issued to Student ${studentId}`);
      })
      .catch((err) => console.log(err));
  };

  const handleReturnBook = (id) => {
    fetch(`http://localhost:8080/book-issue/${id}`, { method: 'DELETE' })
      .then(() => {
        loadIssues();
        loadBooks();
      })
      .catch((err) => console.log(err));
  };

  const filteredBooks = books.filter((b) => 
    b.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.author?.toLowerCase().includes(search.toLowerCase()) ||
    b.isbn?.includes(search)
  );

  return (
    <div className="lib-container">
      {/* Header Bar */}
      <div className="navbar">
        <div className="nav-brand">
          <h1 className="nav-title">Library Management System</h1>
        </div>

        <div className="nav-user">
          <span>LoggedIn as: <b>{user.name}</b> ({user.role})</span>
          <button 
            className="btn-outline"
            onClick={() => setUser(user.role === 'LIBRARIAN' ? { name: 'Student User', role: 'STUDENT' } : { name: 'Librarian User', role: 'LIBRARIAN' })}
          >
            Switch Role ({user.role === 'LIBRARIAN' ? 'Student' : 'Librarian'})
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        <button 
          className={`tab-btn ${activeTab === 'catalog' ? 'active' : ''}`}
          onClick={() => setActiveTab('catalog')}
        >
          Book Catalog ({books.length})
        </button>

        <button 
          className={`tab-btn ${activeTab === 'issues' ? 'active' : ''}`}
          onClick={() => setActiveTab('issues')}
        >
          Issued Books Log ({myIssues.length})
        </button>
      </div>

      {/* Catalog View */}
      {activeTab === 'catalog' && (
        <div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input 
              type="text"
              placeholder="Search books by title, author, or ISBN..."
              className="form-input"
              style={{ maxWidth: '350px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {user.role === 'LIBRARIAN' && (
              <button className="btn-accent" onClick={() => setShowAddForm(!showAddForm)}>
                {showAddForm ? 'Close Form' : '+ Add New Book'}
              </button>
            )}
          </div>

          {/* Add Book Form (Librarian) */}
          {showAddForm && user.role === 'LIBRARIAN' && (
            <form onSubmit={handleAddBook} style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e0e0e0' }}>
              <h3 style={{ marginBottom: '15px' }}>Add Book to Library</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <input type="text" placeholder="Title" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <input type="text" placeholder="Author" className="form-input" value={author} onChange={(e) => setAuthor(e.target.value)} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                <input type="text" placeholder="ISBN" className="form-input" value={isbn} onChange={(e) => setIsbn(e.target.value)} required />
                <input type="number" placeholder="Copies" className="form-input" value={totalCopies} onChange={(e) => setTotalCopies(e.target.value)} />
              </div>
              <button type="submit" className="btn-accent">Save Book</button>
            </form>
          )}

          {/* Book Cards Grid */}
          <div className="book-grid">
            {filteredBooks.map((book) => (
              <div key={book._id} className="book-card">
                <h3 className="book-title">{book.title}</h3>
                <div className="book-author">By {book.author}</div>
                <div style={{ fontSize: '0.85rem', color: '#777777', marginBottom: '10px' }}>ISBN: {book.isbn}</div>

                <div className="book-info-row">
                  <span className={`stock-tag ${book.availableCopies > 0 ? 'stock-available' : 'stock-empty'}`}>
                    {book.availableCopies} / {book.totalCopies} Available
                  </span>
                </div>

                <div className="card-actions">
                  <button className="btn-card btn-issue" onClick={() => openIssueModal(book)}>
                    Issue Book
                  </button>
                  {user.role === 'LIBRARIAN' && (
                    <button className="btn-card btn-delete-red" onClick={() => handleDeleteBook(book._id)}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Issued Books Log View */}
      {activeTab === 'issues' && (
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
          <h2 style={{ marginBottom: '15px' }}>List of all the books in the library.</h2>
          {myIssues.length === 0 ? (
            <p style={{ color: '#777777' }}>No books currently issued.</p>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ISBN</th>
                  <th>Student ID</th>
                  <th>Issue Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {myIssues.map((item) => (
                  <tr key={item._id}>
                    <td><b>{item.isbn}</b></td>
                    <td>{item.studentId}</td>
                    <td>{item.issueDate}</td>
                    <td>
                      <button className="btn-outline" onClick={() => handleReturnBook(item._id)}>
                        Return Book
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Issue Book Prompt Form Modal */}
      {issuingBook && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '8px', width: '100%', maxWidth: '450px', border: '1px solid #e0e0e0' }}>
            <h3 style={{ marginBottom: '15px' }}>Issue Book: {issuingBook.title}</h3>
            <form onSubmit={handleConfirmIssue}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '4px' }}>Student ID</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Enter Student ID"
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '4px' }}>Date of Issue</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  placeholder="e.g. 24 July 2026"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn-outline" onClick={() => setIssuingBook(null)}>Cancel</button>
                <button type="submit" className="btn-accent">Confirm Issue</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
