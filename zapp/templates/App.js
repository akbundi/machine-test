import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [books, setBooks] = useState([]);
  const [bookDetails, setBookDetails] = useState({
    id: '',
    title: '',
    author: '',
    genre: '',
    published_date: '',
    isbn: '',
  });

  
  const [editingBook, setEditingBook] = useState(null);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(true);
  const [reviewDetails, setReviewDetails] = useState({
    reviewer_name: "",
    review_date: "",
    review_text: "",
    rating: "",
    book: "",
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    axios.get("http://localhost:8000/api/books/")
      .then(response => setBooks(response.data))
      .catch(error => console.error("Error fetching books:", error));
  };

  const fetchReviews = (bookId) => {
    axios.get(`http://localhost:8000/api/reviews/?book=${bookId}`)
      .then(response => setReviews(response.data))
      .catch(error => console.error("Error fetching reviews:", error));
  };

  const fetchBookDetails = (id) => {
    axios.get(`http://localhost:8000/api/books/${id}/`)
      .then(response => {
        const formattedDate = response.data.published_date.slice(0, 10);
        setBookDetails({ ...response.data, published_date: formattedDate });
        fetchReviews(id);
        setSelectedBookId(id);
      })
      .catch(error => console.error("Error fetching book details:", error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { id, title, author, genre, published_date, isbn } = bookDetails;
    const formattedDate = published_date ? new Date(published_date).toISOString().slice(0, 10) : '';

    if (editingBook) {
      axios.put(`http://localhost:8000/api/books/${editingBook}/`, {
        title, author, genre, published_date: formattedDate, isbn,
      })
        .then(response => {
          setBooks(books.map(book => book.id === editingBook ? response.data : book));
          resetForm();
        })
        .catch(error => console.error("Error updating book:", error));
    } else {
      axios.post("http://localhost:8000/api/books/", {
        id, title, author, genre, published_date: formattedDate, isbn,
      })
        .then(response => {
          setBooks(prevBooks => [...prevBooks, response.data]);
          resetForm();
        })
        .catch(error => console.error("Error adding book:", error));
    }
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8000/api/books/${id}/`)
      .then(() => {
        setBooks(books.filter(book => book.id !== id));
        setReviews([]);
      })
      .catch(error => console.error("Error deleting book:", error));
  };

  const handleEdit = (id) => {
    fetchBookDetails(id);
    setEditingBook(id);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookDetails({ ...bookDetails, [name]: value });
  };

  const resetForm = () => {
    setBookDetails({
      id: '', title: '', author: '', genre: '', published_date: '', isbn: ''
    });
    setEditingBook(null);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();

    if (!selectedBookId) {
      console.error("No book selected for review!");
      return;
    }

    const review_text = {
      reviewer_name: reviewDetails.reviewer_name,
      review_date: reviewDetails.review_date,
      review_text: reviewDetails.review_text,
      rating: parseInt(reviewDetails.rating, 10),
      book: setSelectedBookId
    };
    console.log("Submitting review for book ID:", selectedBookId);
    console.log("Review details:", review_text); 
    const config = {
      headers: {
        'Content-Type': 'application/json',
      }
    };
    if (editingReview) {
      axios.put(`http://localhost:8000/api/reviews/${editingReview.id}/`, {
      })
        .then(response => {
          setReviews(reviews.map(r => r.id === editingReview.id ? response.data : r));
          setEditingReview(null);
          resetReviewForm();
        })
        .catch(error => console.error("Error updating review:", error));
    } else {
      axios.post("http://localhost:8000/api/reviews/", review_text, config)
        .then(response => {
          setReviews([...reviews, response.data]);
          resetReviewForm();
        })
        .catch(error => console.error("Error adding review:", error));
    }
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewDetails({ ...reviewDetails, [name]: value });
  };

  const resetReviewForm = () => {
    
    setReviewDetails({ reviewer_name: "",review_date: "",review_text: "", rating: '' });
    setEditingReview(null);
    setShowReviewForm(true);
  };

  const deleteReview = (reviewId) => {
    axios.delete(`http://localhost:8000/api/reviews/${reviewId}/`)
      .then(() => {
        setReviews(reviews.filter(r => r.id !== reviewId));
      })
      .catch(error => console.error("Error deleting review:", error));
  };

  return (
    <div>
      <h1>Book Review System</h1>

      <form onSubmit={handleSubmit}>
        <h2>{editingBook ? 'Update Book' : 'Add New Book'}</h2>
        <label>ID:
          <input type="text" name="id" value={bookDetails.id} onChange={handleChange} required={!editingBook} disabled={!!editingBook} />
        </label>
        <label>Title:
          <input type="text" name="title" value={bookDetails.title} onChange={handleChange} required />
        </label>
        <label>Author:
          <input type="text" name="author" value={bookDetails.author} onChange={handleChange} required />
        </label>
        <label>Genre:
          <input type="text" name="genre" value={bookDetails.genre} onChange={handleChange} required />
        </label>
        <label>Published Date:
          <input type="date" name="published_date" value={bookDetails.published_date} onChange={handleChange} required />
        </label>
        <label>ISBN:
          <input type="text" name="isbn" value={bookDetails.isbn} onChange={handleChange} required />
        </label>
        <button type="submit">{editingBook ? 'Update Book' : 'Add Book'}</button>
      </form>

      <h2>List of Books</h2>
      <ul>
        {books.map(book => (
          <li key={book.id}>
            {book.title} by {book.author} - {book.genre}
            <button onClick={() => handleEdit(book.id)}>Edit</button>
            <button onClick={() => handleDelete(book.id)}>Delete</button>
            <button onClick={() => fetchReviews(book.id)}>View Reviews</button>
            <button onClick={() => { setShowReviewForm(true); setSelectedBookId(book.id);}}>Add Review</button>
          </li>
        ))}
      </ul>
      {selectedBookId && (
        <div>
          <h2>Reviews for Book ID: {selectedBookId}</h2>
          <ul>
          {reviews.map(review => (
            <li key={review.id}>
              {review.reviewer_name} on {review.review_date}: {review.review_text} - Rating: {review.rating}
              <button onClick={() => setEditingReview(review)}>Edit</button>
              <button onClick={() => deleteReview(review.id)}>Delete</button>
            </li>
          ))}
          </ul>
        </div>
      )}

      {showReviewForm && (
        <form onSubmit={handleReviewSubmit}>
          <h2>{editingReview ? 'Update Review' : 'Add New Review'}</h2>
          <label>
          Reviewer Name:<input type="text" name="reviewer_name" value={reviewDetails.reviewer_name} onChange={handleReviewChange} required />
          </label>
          <label>
          Review Date:<input type="date" name="review_date" value={reviewDetails.review_date} onChange={handleReviewChange} required />
          </label>
          <label>review_text:
            <input type="text" name="review_text" value={reviewDetails.review_text} onChange={handleReviewChange} required />
          </label>
          <label>Rating:
            <input type="number" name="rating" value={reviewDetails.rating} onChange={handleReviewChange} required min="1" max="5" />
          </label>
          <label>Book:<select name="book" value={selectedBookId || ""} onChange={(e) => setSelectedBookId(e.target.value)} required><option value="">Select Book</option>{books.map(book => (<option key={book.id} value={book.id}>{book.id} - {book.title}</option>))}</select></label>
          <button type="submit">{editingReview ? 'Update Review' : 'Add Review'}</button>
        </form>
      )}
      
      
    </div>
  );
};

export default App;
