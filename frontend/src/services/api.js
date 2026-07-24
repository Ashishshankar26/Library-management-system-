const API_BASE = 'http://localhost:5001/api';

// Initial sample books for demo fallback
const INITIAL_BOOKS = [
  {
    _id: 'book-1',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    category: 'Computer Science',
    totalCopies: 6,
    availableCopies: 4,
    coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&q=80',
    description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees.',
  },
  {
    _id: 'book-2',
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
    isbn: '978-0201633610',
    category: 'Computer Science',
    totalCopies: 4,
    availableCopies: 2,
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
    description: 'Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple solutions.',
  },
  {
    _id: 'book-3',
    title: 'You Don\'t Know JS Yet: Scope & Closures',
    author: 'Kyle Simpson',
    isbn: '978-1491904244',
    category: 'Computer Science',
    totalCopies: 8,
    availableCopies: 7,
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
    description: 'Deep dive into JavaScript core mechanics, scope rules, and lexical closures.',
  },
  {
    _id: 'book-4',
    title: 'Atomic Habits',
    author: 'James Clear',
    isbn: '978-0735211292',
    category: 'Self-Help',
    totalCopies: 5,
    availableCopies: 3,
    coverUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=400&q=80',
    description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones.',
  }
];

const getStoredBooks = () => {
  const stored = localStorage.getItem('cs_lib_books');
  if (!stored) {
    localStorage.setItem('cs_lib_books', JSON.stringify(INITIAL_BOOKS));
    return INITIAL_BOOKS;
  }
  return JSON.parse(stored);
};

const setStoredBooks = (books) => {
  localStorage.setItem('cs_lib_books', JSON.stringify(books));
};

const getStoredIssues = () => {
  const stored = localStorage.getItem('cs_lib_issues');
  if (!stored) return [];
  return JSON.parse(stored);
};

const setStoredIssues = (issues) => {
  localStorage.setItem('cs_lib_issues', JSON.stringify(issues));
};

export const libraryApi = {
  // Auth API
  login: async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}
    
    // Demo mode fallback
    const role = email.includes('admin') ? 'admin' : 'member';
    return {
      _id: 'user-' + Date.now(),
      name: role === 'admin' ? 'Admin User' : 'Student Member',
      email,
      role,
      token: 'demo-token-123',
    };
  },

  register: async (userData) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}

    return {
      _id: 'user-' + Date.now(),
      name: userData.name,
      email: userData.email,
      role: userData.role || 'member',
      token: 'demo-token-123',
    };
  },

  // Books API
  fetchBooks: async () => {
    try {
      const res = await fetch(`${API_BASE}/books`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const json = await res.json();
        return { data: json.data, source: 'backend' };
      }
    } catch (e) {}
    return { data: getStoredBooks(), source: 'local' };
  },

  createBook: async (bookData, token) => {
    try {
      const res = await fetch(`${API_BASE}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookData),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}

    const books = getStoredBooks();
    const newBook = {
      _id: 'book-' + Date.now(),
      ...bookData,
      totalCopies: Number(bookData.totalCopies) || 5,
      availableCopies: Number(bookData.totalCopies) || 5,
    };
    books.unshift(newBook);
    setStoredBooks(books);
    return newBook;
  },

  deleteBook: async (id, token) => {
    try {
      const res = await fetch(`${API_BASE}/books/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) return true;
    } catch (e) {}

    const books = getStoredBooks().filter(b => b._id !== id);
    setStoredBooks(books);
    return true;
  },

  // Issue/Borrow API
  issueBook: async (bookId, token, user) => {
    try {
      const res = await fetch(`${API_BASE}/issues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}

    // Fallback
    const books = getStoredBooks();
    const book = books.find(b => b._id === bookId);
    if (!book || book.availableCopies <= 0) return null;

    book.availableCopies -= 1;
    setStoredBooks(books);

    const issues = getStoredIssues();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const record = {
      _id: 'issue-' + Date.now(),
      user: { _id: user?._id || 'u1', name: user?.name || 'Member', email: user?.email },
      book: { _id: book._id, title: book.title, author: book.author, isbn: book.isbn, coverUrl: book.coverUrl },
      issueDate: new Date().toISOString(),
      dueDate: dueDate.toISOString(),
      status: 'issued',
      fineAmount: 0,
    };
    issues.unshift(record);
    setStoredIssues(issues);
    return record;
  },

  fetchMyIssues: async (token, user) => {
    try {
      const res = await fetch(`${API_BASE}/issues/my-issues`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}

    return getStoredIssues().filter(i => i.user?._id === user?._id || i.user?.email === user?.email);
  },

  returnBook: async (issueId, token) => {
    try {
      const res = await fetch(`${API_BASE}/issues/${issueId}/return`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}

    const issues = getStoredIssues();
    const issue = issues.find(i => i._id === issueId);
    if (!issue) return null;

    issue.status = 'returned';
    issue.returnDate = new Date().toISOString();
    setStoredIssues(issues);

    const books = getStoredBooks();
    const book = books.find(b => b._id === (issue.book?._id || issue.book));
    if (book) {
      book.availableCopies += 1;
      setStoredBooks(books);
    }

    return issue;
  }
};
