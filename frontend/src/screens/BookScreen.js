import React, { useState, useEffect } from 'react';

const BookScreen = ({ onBack }) => {
  const [books, setBooks] = useState([
    { _id: '1', isbn: '12345', title: 'Clean Code', author: 'Robert C. Martin' },
    { _id: '2', isbn: '67890', title: 'Design Patterns', author: 'Erich Gamma' }
  ]);

  useEffect(() => {
    fetch('http://localhost:8080/book')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBooks(data);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="container">
      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <button className="btn-outline" onClick={onBack}>
          ← Back to Home
        </button>
      </div>

      <h2 className="screen-heading">List of all the books in the library</h2>

      <table className="issue-table">
        <thead>
          <tr>
            <th>ISBN</th>
            <th>Title</th>
            <th>Author</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book._id}>
              <td>{book.isbn}</td>
              <td>{book.title}</td>
              <td>{book.author}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookScreen;
