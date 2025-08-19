import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';

function UpdateBook() {
  const params = useParams();
  const bookId = params.bookId;

  const titleRef = useRef(null);
  const authorRef = useRef(null);
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [availability, setAvailability] = useState('');

  const categories = [
    "FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "TECHNOLOGY",
    "FANTASY", "MYSTERY", "THRILLER", "ROMANCE"
  ];
  const statuses = ["ACTIVE", "INACTIVE"];
  const availabilities = ["AVAILABLE", "ISSUED"];

  useEffect(() => {
    if (!bookId) {
      alert("Missing bookId in URL parameters.");
      return;
    }
    const fetchBook = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/books/viewBooks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookId })
        });

        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();

        if (data.length === 0) {
          alert("Book not found");
        } else {
          const book = data[0];
          titleRef.current.value = book.title;
          authorRef.current.value = book.author;
          setCategory(book.category);
          setStatus(book.status);
          setAvailability(book.availability);
        }
      } catch (err) {
        alert("Error: " + err.message);
      }
    };

    fetchBook();
  }, [bookId]);

  useEffect(() => {
    if (category) {
      const categorySelect = document.getElementById('categoryComboBox');
      if (categorySelect) categorySelect.value = category;
    }
  }, [category]);

  useEffect(() => {
    if (status) {
      const statusSelect = document.getElementById('statusComboBox');
      if (statusSelect) statusSelect.value = status;
    }
  }, [status]);

  useEffect(() => {
    if (availability) {
      const availabilitySelect = document.getElementById('availabilityComboBox');
      if (availabilitySelect) availabilitySelect.value = availability;
    }
  }, [availability]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = titleRef.current.value;
    const author = authorRef.current.value;
    const formCategory = document.getElementById('categoryComboBox').value;
    const formStatus = document.getElementById('statusComboBox').value;
    const formAvailability = document.getElementById('availabilityComboBox').value;

    try {
      console.log("Submitting update for bookId:", bookId)
      const res = await fetch("http://localhost:8080/api/books/updateBook", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId,
          title,
          author,
          category: formCategory,
          status: formStatus,
          availability: formAvailability
        })
      });

      const statusCode = res.status;
      const text = await res.text();

      let responseBody;
      try {
        responseBody = JSON.parse(text);
      } catch {
        responseBody = text;
      }

      alert(
        `Status: ${statusCode}\nResponse: ${typeof responseBody === "object"
          ? JSON.stringify(responseBody, null, 2)
          : responseBody
        }`
      );

      if (res.ok) {
        alert("Book updated successfully!")
        window.location.href='/viewBooks'
      } else {
        alert("Failed to update book. " + (responseBody.message || ""))
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleBack = () => {
    window.location.href = '/viewBooks';
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" name="title" required ref={titleRef} />

        <label htmlFor="author">Author:</label>
        <input type="text" id="author" name="author" required ref={authorRef} />

        <label htmlFor="categoryComboBox">Category:</label>
        <select id="categoryComboBox" name="category" required>
          <option value="" disabled>Select category</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <label htmlFor="statusComboBox">Status:</label>
        <select id="statusComboBox" name="status" required>
          <option value="" disabled>Select status</option>
          {statuses.map(stat => (
            <option key={stat} value={stat}>{stat}</option>
          ))}
        </select>

        <label htmlFor="availabilityComboBox">Availability:</label>
        <select id="availabilityComboBox" name="availability" required>
          <option value="" disabled>Select availability</option>
          {availabilities.map(avail => (
            <option key={avail} value={avail}>{avail}</option>
          ))}
        </select>

        <div className="button-row">
          <input type="submit" value="Update Book" />
          <button type="button" className="back-button" onClick={handleBack}>Back to View Books</button>
        </div>
      </form>
    </div>
  )
}

export default UpdateBook
