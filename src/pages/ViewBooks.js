import React, { useEffect, useState } from "react";

export default function ViewBooks() {
  const [books, setBooks] = useState([]);
  const [selected, setSelected] = useState([]);
  const [statusMessage, setStatusMessage] = useState(null);
  const [statusType, setStatusType] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/books/viewBooks")
      .then(async (res) => {
        const contentType = res.headers.get("content-type");
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText);
        }

        if (contentType && contentType.includes("application/json")) {
          return res.json();
        } else {
          const text = await res.text();
          throw new Error("Expected JSON but got:\n" + text);
        }
      })
      .then((data) => {
        setBooks(data);
      })
      .catch((err) => {
        alert("Error fetching books:\n" + err.message);
      });
  }, []);

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const updated = [...prev];
      const index = updated.indexOf(id);

      if (index !== -1) {
        updated.splice(index, 1);
      } else {
        updated.push(id);
      }
      return updated;
    });
  };

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(books.map((b) => b.bookId));
    } else {
      setSelected([]);
    }
  };

  const handleBatchDelete = async () => {
    if (selected.length === 0) {
      alert("Please select books to delete.");
      return;
    }
    if (!window.confirm(`Delete ${selected.length} selected books?`)) return;

    try {
      const response = await fetch(
        "http://localhost:8080/api/books/batchDeleteBooks",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selected),
        }
      );

      const text = await response.text();
      if (!response.ok) {
        alert(`Delete failed: ${text}`);
        return;
      }

      alert("Deleted successfully");
      setBooks(books.filter((b) => !selected.includes(b.bookId)));
      setSelected([]);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleBatchUpdate = async () => {
    if (selected.length === 0) {
      alert("Please select books to update.");
      return;
    }
    if (!window.confirm(`Update availability for ${selected.length} books?`))
      return;

    try {
      const response = await fetch(
        "http://localhost:8080/api/books/updateBooksAvailabilityBatch",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selected),
        }
      );

      const text = await response.text();
      if (!response.ok) {
        alert(`Update failed: ${text}`);
        return;
      }

      alert("Updated successfully");
      setBooks(
        books.map((b) =>
          selected.includes(b.bookId)
            ? { ...b, availability: b.availability === "AVAILABLE" ? "ISSUED" : "AVAILABLE" }
            : b
        )
      );
      setSelected([]);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="view-books">
      <h2>All Books</h2>

      {statusMessage && (
        <p className={`status-message ${statusType}`}>
          {statusMessage}
        </p>
      )}

      {books.length === 0 ? (
        <p className="no-books">No books found in the library.</p>
      ) : (
        <form>
          <div className="table-container">
            <table className="books-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={toggleSelectAll}
                      checked={selected.length === books.length && books.length > 0}
                    />
                  </th>
                  <th>Book ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Availability</th>
                  <th>Created At</th>
                  <th>Created By</th>
                  <th>Updated At</th>
                  <th>Updated By</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.bookId}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.includes(book.bookId)}
                        onChange={() => toggleSelect(book.bookId)}
                      />
                    </td>
                    <td>{book.bookId}</td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.category}</td>
                    <td>{book.status}</td>
                    <td>{book.availability}</td>
                    <td>{book.createdAt}</td>
                    <td>{book.createdBy}</td>
                    <td>{book.updatedAt}</td>
                    <td>{book.updatedBy}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => window.location.href = `/updateBook/${book.bookId}`}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="actions">
            <button type="button" onClick={handleBatchDelete}>
              Delete Selected
            </button>
            <button type="button" onClick={handleBatchUpdate}>
              Change Status
            </button>
            <button type="button" onClick={() => (window.location.href = "/")}>
              Back to Main Menu
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
