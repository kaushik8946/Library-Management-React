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
  const [categories, setCategories] = useState([]);


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
          console.log(book)
        }
      } catch (err) {
        alert("Error: " + err.message);
      }
    };

    fetchBook();
  }, [bookId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/books/getCategories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

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
  const validate = (title, author, category, status, availability) => {
    if (!title) {
      alert(title + "Book title can't be null");
      return false;
    }
    const titleTrimmed = title.trim();
    if (titleTrimmed.length < 2 || titleTrimmed.length > 100) {
      alert("Book title must be between 2 and 100 characters");
      return false;
    }
    if (!author) {
      alert("Author can't be null");
      return false;
    }
    const authorTrimmed = author.trim();
    if (authorTrimmed.length < 2 || authorTrimmed.length > 100) {
      alert("Author name must be between 2 and 100 characters");
      return false;
    }
    if (!category) {
      alert("Category can't be null");
      return false;
    }
    if (!status) {
      alert("Status can't be null");
      return false;
    }
    if (!availability) {
      alert("Availability can't be null");
      return false;
    }
    return true;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = titleRef.current.value;
    const author = authorRef.current.value;
    const formCategory = category.toUpperCase();
    const formStatus = status.toUpperCase();
    const formAvailability = availability.toUpperCase();
    console.log(title, author, formCategory, formStatus, formAvailability)
    if (!validate(title, author, formCategory, formStatus, formAvailability)) {
      return;
    }
    try {
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
      // const statusCode = res.status;
      const text = await res.text();

      let responseBody;
      try {
        responseBody = JSON.parse(text);
      } catch {
        responseBody = text;
      }
      

      if (res.ok) {
        alert("Book updated successfully!")
        window.location.href = '/viewBooks'
      } 
      else {
        alert(typeof responseBody === "object" ? JSON.stringify(responseBody) : responseBody);
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
        <input
          type="text"
          id="title"
          name="title"
          required
          ref={titleRef}
          onInvalid={e => e.target.setCustomValidity('title is required')}
          onInput={e => e.target.setCustomValidity('')}
        />

        <label htmlFor="author">Author:</label>
        <input
          type="text"
          id="author"
          name="author"
          required
          ref={authorRef}
          onInvalid={e => e.target.setCustomValidity('author is required')}
          onInput={e => e.target.setCustomValidity('')}
        />

        <label htmlFor="categoryComboBox">Category:</label>
        <select
          id="categoryComboBox"
          name="category"
          required
          value={category}
          onChange={e => setCategory(e.target.value)}
          onInvalid={e => e.target.setCustomValidity('category is required')}
          onInput={e => e.target.setCustomValidity('')}
        >
          <option value="" disabled>Select category</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}
            </option>
          ))}
        </select>

        <label htmlFor="statusComboBox">Status:</label>
        <select
          id="statusComboBox"
          name="status"
          required
          value={status}
          onChange={e => setStatus(e.target.value)}
          onInvalid={e => e.target.setCustomValidity('status is required')}
          onInput={e => e.target.setCustomValidity('')}
        >
          <option value="" disabled>Select status</option>
          {statuses.map(stat => (
            <option key={stat} value={stat}>
              {stat.charAt(0).toUpperCase() + stat.slice(1).toLowerCase()}
            </option>
          ))}
        </select>

        <label htmlFor="availabilityComboBox">Availability:</label>
        <select
          id="availabilityComboBox"
          name="availability"
          required
          value={availability}
          onChange={e => setAvailability(e.target.value)}
          onInvalid={e => e.target.setCustomValidity('Availability is required')}
          onInput={e => e.target.setCustomValidity('')}
        >
          <option value="" disabled>Select availability</option>
          {availabilities.map(avail => (
            <option key={avail} value={avail}>
              {avail.charAt(0).toUpperCase() + avail.slice(1).toLowerCase()}
            </option>
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
