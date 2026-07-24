import React, { useState, useEffect } from 'react';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import { setToken, getToken, removeToken, setUserSession, getUserSession } from './utils/LoginUtil';

const API_BASE_URL = window.location.hostname === "localhost" ? "http://localhost:8080" : "";

function App() {
  const [user, setUser] = useState(() => getUserSession());
  const [token, setTokenState] = useState(() => getToken());
  const [authView, setAuthView] = useState('login'); // 'login' | 'signup'

  const [books, setBooks] = useState([
    { _id: '1', title: 'Clean Code', author: 'Robert C. Martin', isbn: '12345', availableCopies: 4, totalCopies: 5 },
    { _id: '2', title: 'Design Patterns', author: 'Erich Gamma', isbn: '67890', availableCopies: 2, totalCopies: 4 },
    { _id: '3', title: 'Atomic Habits', author: 'James Clear', isbn: '11223', availableCopies: 5, totalCopies: 5 },
    { _id: '4', title: 'The Pragmatic Programmer', author: 'Andrew Hunt', isbn: '44556', availableCopies: 3, totalCopies: 3 },
    { _id: '5', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '77889', availableCopies: 1, totalCopies: 2 }
  ]);

  const [myIssues, setMyIssues] = useState([
    { _id: '1', isbn: '12345', title: 'Clean Code', author: 'Robert C. Martin', studentId: '64bce14088f0b38643a177f1', issueDate: '8 August 2023' },
    { _id: '2', isbn: '12345', title: 'Clean Code', author: 'Robert C. Martin', studentId: '64bce14088f0b38643a177f1', issueDate: '10 August 2023' },
    { _id: '3', isbn: '67890', title: 'Design Patterns', author: 'Erich Gamma', studentId: '64bce14088f0b38643a177f2', issueDate: '15 July 2026' }
  ]);

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

  // Custom In-App Modal confirmation states
  const [deletingBook, setDeletingBook] = useState(null);
  const [issueSuccessMsg, setIssueSuccessMsg] = useState(null);
  const [stockErrorMsg, setStockErrorMsg] = useState(false);

  useEffect(() => {
    if (token) {
      loadBooks();
      loadIssues();
    }
  }, [token]);

  const loadBooks = () => {
    fetch(`${API_BASE_URL}/book`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBooks(data);
        }
      })
      .catch((err) => console.log(err));
  };

  const loadIssues = () => {
    fetch(`${API_BASE_URL}/book-issue`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setMyIssues(data);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleLoginSuccess = (newToken, userData) => {
    setToken(newToken);
    setUserSession(userData);
    setTokenState(newToken);
    setUser(userData);
  };

  const handleLogout = () => {
    removeToken();
    setTokenState(null);
    setUser(null);
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    if (!title || !author || !isbn) return;

    const newBook = {
      _id: String(Date.now()),
      title,
      author,
      isbn,
      availableCopies: Number(totalCopies),
      totalCopies: Number(totalCopies),
    };

    fetch(`${API_BASE_URL}/book`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newBook),
    }).catch((err) => console.log(err));

    setBooks([newBook, ...books]);
    setTitle('');
    setAuthor('');
    setIsbn('');
    setShowAddForm(false);
  };

  const openDeleteBookModal = (book) => {
    setDeletingBook(book);
  };

  const confirmDeleteBook = () => {
    if (!deletingBook) return;

    fetch(`${API_BASE_URL}/book/${deletingBook._id}`, { 
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }).catch((err) => console.log(err));

    setBooks(books.filter((b) => b._id !== deletingBook._id));
    setDeletingBook(null);
  };

  const openIssueModal = (book) => {
    if (book.availableCopies <= 0) {
      setStockErrorMsg(true);
      return;
    }
    setIssuingBook(book);
  };

  const handleConfirmIssue = (e) => {
    e.preventDefault();
    if (!studentId || !issueDate || !issuingBook) return;

    const issueRecord = {
      _id: String(Date.now()),
      isbn: issuingBook.isbn,
      title: issuingBook.title,
      author: issuingBook.author,
      studentId: studentId,
      issueDate: issueDate,
    };

    fetch(`${API_BASE_URL}/book-issue`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(issueRecord),
    }).catch((err) => console.log(err));

    setMyIssues([issueRecord, ...myIssues]);
    setBooks(books.map((b) => b._id === issuingBook._id ? { ...b, availableCopies: b.availableCopies - 1 } : b));
    setIssueSuccessMsg({ title: issuingBook.title, studentId, date: issueDate });
    setIssuingBook(null);
  };

  const handleReturnBook = (id) => {
    fetch(`${API_BASE_URL}/book-issue/${id}`, { 
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }).catch((err) => console.log(err));

    setMyIssues(myIssues.filter((i) => i._id !== id));
  };

  if (!token || !user) {
    if (authView === 'signup') {
      return <SignUpScreen onSignUpSuccess={handleLoginSuccess} onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <LoginScreen onLoginSuccess={handleLoginSuccess} onSwitchToSignUp={() => setAuthView('signup')} />;
  }

  const isLibrarian = user.type === 'LIBRARIAN' || user.role === 'LIBRARIAN';

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
          <span>Logged in as: <b>{user.name}</b> ({isLibrarian ? 'Librarian' : 'Student'})</span>
          <button className="logout-button" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={handleLogout}>
            Logout
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

            {isLibrarian && (
              <button className="btn-accent" onClick={() => setShowAddForm(!showAddForm)}>
                {showAddForm ? 'Close Form' : '+ Add New Book'}
              </button>
            )}
          </div>

          {/* Add Book Form (Librarian) */}
          {showAddForm && isLibrarian && (
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
                  {isLibrarian && (
                    <button className="btn-card btn-delete-red" onClick={() => openDeleteBookModal(book)}>
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
                  <th>Book Title</th>
                  <th>Author</th>
                  <th>Student ID</th>
                  <th>Issue Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {myIssues.map((item) => (
                  <tr key={item._id}>
                    <td><b>{item.isbn}</b></td>
                    <td>{item.title || 'Clean Code'}</td>
                    <td>{item.author || 'Robert C. Martin'}</td>
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

      {/* Issue Book Prompt Modal */}
      {issuingBook && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '8px', width: '100%', maxWidth: '450px', border: '1px solid #e0e0e0', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
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

      {/* Custom Issue Success Modal */}
      {issueSuccessMsg && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '8px', width: '100%', maxWidth: '420px', border: '1px solid #21ba45', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <h3 style={{ color: '#21ba45', marginBottom: '12px' }}>Book Issued Successfully!</h3>
            <div style={{ fontSize: '0.95rem', color: '#444', lineHeight: '1.5', marginBottom: '20px' }}>
              <div><b>Book:</b> {issueSuccessMsg.title}</div>
              <div><b>Student ID:</b> {issueSuccessMsg.studentId}</div>
              <div><b>Issue Date:</b> {issueSuccessMsg.date}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <button className="btn-accent" onClick={() => setIssueSuccessMsg(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Stock Error Modal */}
      {stockErrorMsg && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '8px', width: '100%', maxWidth: '400px', border: '1px solid #db2828', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <h3 style={{ color: '#db2828', marginBottom: '12px' }}>Out of Stock</h3>
            <p style={{ fontSize: '0.95rem', color: '#444', marginBottom: '20px' }}>
              There are currently no available copies left for this book.
            </p>
            <div style={{ textAlign: 'right' }}>
              <button className="btn-outline" onClick={() => setStockErrorMsg(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Book Modal */}
      {deletingBook && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '8px', width: '100%', maxWidth: '420px', border: '1px solid #e0e0e0', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <h3 style={{ marginBottom: '12px', color: '#db2828' }}>Delete Book</h3>
            <p style={{ fontSize: '0.95rem', color: '#444', marginBottom: '20px' }}>
              Are you sure you want to delete <b>"{deletingBook.title}"</b> (ISBN: {deletingBook.isbn}) from the library catalog?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn-outline" onClick={() => setDeletingBook(null)}>Cancel</button>
              <button className="btn-card btn-delete-red" style={{ background: '#db2828', color: '#ffffff' }} onClick={confirmDeleteBook}>
                Delete Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
