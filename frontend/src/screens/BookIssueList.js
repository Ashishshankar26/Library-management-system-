import React, { useState, useEffect } from 'react';

const BookIssueList = ({ onBack }) => {
  const [issues, setIssues] = useState([
    { _id: '1', isbn: '12345', studentId: '64bce14088f0b38643a177f1', issueDate: '8 August 2023' },
    { _id: '2', isbn: '12345', studentId: '64bce14088f0b38643a177f1', issueDate: '10 August 2023' }
  ]);

  useEffect(() => {
    fetch('http://localhost:8080/book-issue')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setIssues(data);
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

      <h2 className="screen-heading">List of all the books in the library.</h2>

      <table className="issue-table">
        <thead>
          <tr>
            <th>ISBN</th>
            <th>Student ID</th>
            <th>Issue Date</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((item) => (
            <tr key={item._id}>
              <td>{item.isbn}</td>
              <td>{item.studentId}</td>
              <td>{item.issueDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookIssueList;
