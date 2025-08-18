import { useState, useEffect } from "react";

function ReturnBook() {
  const [bookId, setbookId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [issuedBooks, setIssuedBooks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/issues/viewIssuedRecords")
      .then(res => res.json())
      .then(data =>{ setIssuedBooks(data)})
      .catch(() => setIssuedBooks([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    if (bookId === null || Number.isNaN(bookId)) {
      setStatusMessage("Please enter a valid numeric Issue ID.");
      return;
    }

    const url = `http://localhost:8080/api/issues/returnBook?bookId=${bookId}`;

    try {
      const response = await fetch(url, { method: "POST" });

      if (response.ok) {
        setStatusMessage("Book returned successfully!");
        setbookId(null);
        return;
      }

      let errMsg = `Request failed (status ${response.status})`;
      try {
        const ct = response.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          const data = await response.json();
          errMsg = data?.message || data?.error || JSON.stringify(data);
        } else {
          const text = await response.text();
          if (text) errMsg = text;
        }
      } catch (_) { }

      setStatusMessage(errMsg);
      alert(errMsg);
    } catch (networkErr) {
      const msg = networkErr?.message || "Network error occurred";
      setStatusMessage(msg);
      alert(msg);
    }
  };

  return (
    <div className="return-full">
      <h2>Return Book</h2>
      {statusMessage && <p className="status">{statusMessage}</p>}
      <div className="return-container">
        <form onSubmit={handleSubmit} className="form">
          <input
            type="number"
            placeholder="Enter Book ID"
            value={bookId ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              setbookId(v === "" ? null : parseInt(v));
            }}
            required
          />
          <button type="submit">Return Book</button>
          <button type="button" onClick={() => (window.location.href = "/")}>
            Back to Main Menu
          </button>
        </form>

        <div className="return-display">
          <h4>Issued Books</h4>
          {issuedBooks.length > 0 ? (
            <textarea
              readOnly
              value={issuedBooks.filter(issue=>!issue.returnDate)
                .map(
                i =>
                  `BookID: ${i.bookId}, MemberID: ${i.memberId}, Issued: ${i.issueDate}, Not Returned`
              ).join("\n")}
            />
          ) : (
            <p>No issued books.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReturnBook;
