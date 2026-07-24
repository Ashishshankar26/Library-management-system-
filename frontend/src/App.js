import React, { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState({ name: 'Student Member', email: 'student@library.com', role: 'member' });
  const [books, setBooks] = useState([
    {
      _id: '1',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '978-0132350884',
      category: 'Computer Science',
      availableCopies: 4,
      totalCopies: 5,
    },
    {
      _id: '2',
      title: 'Design Patterns',
      author: 'Erich Gamma',
      isbn: '978-0201633610',
      category: 'Computer Science',
      availableCopies: 2,
      totalCopies: 4,
    },
    {
      _id: '3',
      title: 'Atomic Habits',
      author: 'James Clear',
      isbn: '978-0735211292',
      category: 'Self-Help',
      availableCopies: 5,
      totalCopies: 5,
    }
  ]);

  const [myIssues, setMyIssues] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('catalog');

  // Form states
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [category, setCategory] = useState('Computer Science');
  const [totalCopies, setTotalCopies] = useState(5);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5001/api/books')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          setBooks(data.data);
        }
      })
      .catch((err) => console.log('Library backend offline, using initial books'));
  }, []);

  const handleAddBook = (e) => {
    e.preventDefault();
    if (!title || !author || !isbn) return;

    const newBook = {
      _id: String(Date.now()),
      title,
      author,
      isbn,
      category,
      availableCopies: Number(totalCopies),
      totalCopies: Number(totalCopies),
    };

    fetch('http://localhost:5001/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBook),
    }).catch((err) => console.log(err));

    setBooks([newBook, ...books]);
    setTitle('');
    setAuthor('');
    setIsbn('');
    setShowAddForm(false);
  };

  const handleDeleteBook = (id) => {
    fetch(`http://localhost:5001/api/books/${id}`, { method: 'DELETE' })
      .catch((err) => console.log(err));
    setBooks(books.filter((b) => b._id !== id));
  };

  const handleIssueBook = (book) => {
    if (book.availableCopies <= 0) {
      alert('No available copies left!');
      return;
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const issueRecord = {
      _id: String(Date.now()),
      bookTitle: book.title,
      author: book.author,
      issueDate: new Date().toLocaleDateString(),
      dueDate: dueDate.toLocaleDateString(),
      status: 'issued',
    };

    setMyIssues([issueRecord, ...myIssues]);
    setBooks(books.map((b) => b._id === book._id ? { ...b, availableCopies: b.availableCopies - 1 } : b));
    alert('Book issued successfully!');
  };

  const handleReturnBook = (id) => {
    setMyIssues(myIssues.map((i) => i._id === id ? { ...i, status: 'returned' } : i));
  };

  const filteredBooks = books.filter((b) => 
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
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
            onClick={() => setUser(user.role === 'admin' ? { name: 'Student Member', role: 'member' } : { name: 'Admin User', role: 'admin' })}
          >
            Switch Role ({user.role === 'admin' ? 'Member' : 'Admin'})
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
          My Issued Books ({myIssues.filter(i => i.status === 'issued').length})
        </button>
      </div>

      {/* Catalog View */}
      {activeTab === 'catalog' && (
        <div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input 
              type="text"
              placeholder="Search books by title or author..."
              className="form-input"
              style={{ maxWidth: '350px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {user.role === 'admin' && (
              <button className="btn-accent" onClick={() => setShowAddForm(!showAddForm)}>
                {showAddForm ? 'Close Form' : '+ Add New Book'}
              </button>
            )}
          </div>

          {/* Add Book Form (Admin) */}
          {showAddForm && user.role === 'admin' && (
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
                <div className="book-body">
                  <h3 className="book-title">{book.title}</h3>
                  <div className="book-author">By {book.author}</div>
                  <div style={{ fontSize: '0.85rem', color: '#777777', marginBottom: '15px' }}>ISBN: {book.isbn}</div>

                  <div className="book-info-row">
                    <span className={`stock-tag ${book.availableCopies > 0 ? 'stock-available' : 'stock-empty'}`}>
                      {book.availableCopies} / {book.totalCopies} Available
                    </span>

                    <div style={{ display: 'flex', gap: '5px' }}>
                      {user.role === 'admin' && (
                        <button className="btn-outline" style={{ color: '#db2828' }} onClick={() => handleDeleteBook(book._id)}>
                          Delete
                        </button>
                      )}
                      <button className="btn-accent" onClick={() => handleIssueBook(book)}>
                        Borrow
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Issued Books View */}
      {activeTab === 'issues' && (
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
          <h2 style={{ marginBottom: '15px' }}>My Issued Books</h2>
          {myIssues.length === 0 ? (
            <p style={{ color: '#777777' }}>No books currently borrowed.</p>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {myIssues.map((item) => (
                  <tr key={item._id}>
                    <td><b>{item.bookTitle}</b></td>
                    <td>{item.author}</td>
                    <td>{item.issueDate}</td>
                    <td>{item.dueDate}</td>
                    <td>{item.status}</td>
                    <td>
                      {item.status === 'issued' && (
                        <button className="btn-outline" onClick={() => handleReturnBook(item._id)}>
                          Return
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
