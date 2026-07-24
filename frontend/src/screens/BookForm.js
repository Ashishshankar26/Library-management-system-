import React, { useState } from 'react';

const BookForm = ({ onBack }) => {
  const [isbn, setIsbn] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [issued, setIssued] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8080/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isbn, title, author }),
    }).catch((err) => console.log(err));

    setIssued(true);
    setIsbn('');
    setTitle('');
    setAuthor('');
  };

  return (
    <div className="container">
      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <button className="btn-outline" onClick={onBack}>
          ← Back to Home
        </button>
      </div>

      <h2 className="screen-heading">Add New Book</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
        <div className="form-group">
          <label>ISBN</label>
          <input 
            type="text" 
            className="form-input" 
            value={isbn} 
            onChange={(e) => setIsbn(e.target.value)} 
            placeholder="ISBN number"
            required 
          />
        </div>

        <div className="form-group">
          <label>Title</label>
          <input 
            type="text" 
            className="form-input" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Book Title"
            required 
          />
        </div>

        <div className="form-group">
          <label>Author</label>
          <input 
            type="text" 
            className="form-input" 
            value={author} 
            onChange={(e) => setAuthor(e.target.value)} 
            placeholder="Author Name"
            required 
          />
        </div>

        <button type="submit" className="btn-accent">
          Submit Book
        </button>

        {issued && <p style={{ color: 'green', marginTop: '10px' }}>Book added successfully!</p>}
      </form>
    </div>
  );
};

export default BookForm;
