import React, { useRef, useState } from 'react'

function AddBook() {
  const titleRef = useRef();
  const authorRef = useRef();
  const categoryRef = useRef();
  const statusRef = useRef();
  const availabilityRef = useRef();

  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('');

  const categories = [
    "FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "TECHNOLOGY",
    "FANTASY", "MYSTERY", "THRILLER", "ROMANCE"
  ];
  const statuses = ["ACTIVE", "INACTIVE"];
  const availabilities = ["AVAILABLE", "ISSUED"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('');
    setStatusType('');

    const formData = {
      title: titleRef.current.value,
      author: authorRef.current.value,
      category: categoryRef.current.value,
      status: statusRef.current.value,
      availability: availabilityRef.current.value
    };

    try {
      const response = await fetch("http://localhost:8080/api/books/addBook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Error ${response.status}: ${errorText}`);
        throw new Error(`Failed: ${response.status}\n${errorText}`);
      }

      setStatusMessage("Book added successfully!");
      setStatusType("success");

      // clear inputs
      titleRef.current.value = "";
      authorRef.current.value = "";
      categoryRef.current.value = "";
      statusRef.current.value = "";
      availabilityRef.current.value = "";

    } catch (err) {
      alert(`Unexpected error: ${err.message}`);
      setStatusMessage(err.message);
      setStatusType("error");
    }
  };

  const handleBack = () => {
    window.location.href = '/';
  };

  return (
    <div>
      <h2>Add New Book</h2>
      {statusMessage && (
        <p className={`message-label ${statusType}`}>{statusMessage}</p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="titleField">Title:</label>
          <input type="text" id="titleField" name="title" placeholder="Enter book title" required ref={titleRef} />
        </div>

        <div className="form-row">
          <label htmlFor="authorField">Author:</label>
          <input type="text" id="authorField" name="author" placeholder="Enter author name" required ref={authorRef} />
        </div>

        <div className="form-row">
          <label htmlFor="categoryComboBox">Category:</label>
          <select id="categoryComboBox" name="category" required ref={categoryRef}>
            <option value="" disabled selected>Select category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="statusComboBox">Status:</label>
          <select id="statusComboBox" name="status" required ref={statusRef}>
            <option value="" disabled selected>Select status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="availabilityComboBox">Availability:</label>
          <select id="availabilityComboBox" name="availability" required ref={availabilityRef}>
            <option value="" disabled selected>Select availability</option>
            {availabilities.map(availability => (
              <option key={availability} value={availability}>{availability}</option>
            ))}
          </select>
        </div>

        <div className="button-row">
          <button type="submit" className="add-button">Add Book</button>
          <button type="button" onClick={handleBack} className="back-button">Back to Main Menu</button>
        </div>
      </form>
    </div>
  );
}

export default AddBook;
