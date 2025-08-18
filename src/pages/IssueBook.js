import { useState, useEffect } from "react";

function IssueBook() {
  const [bookId, setBookId] = useState(null);
  const [memberId, setMemberId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/books/viewBooks")
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(() => setBooks([]));

    fetch("http://localhost:8080/api/members/viewMembers")
      .then(res => res.json())
      .then(data => setMembers(data))
      .catch(() => setMembers([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    if (bookId === null || memberId === null || Number.isNaN(bookId) || Number.isNaN(memberId)) {
      setStatusMessage("Please enter valid numeric Book ID and Member ID.");
      return;
    }
    const params = new URLSearchParams({
      bookId: String(bookId),
      memberId: String(memberId)
    });
    const url = `http://localhost:8080/api/issues/issueBook?${params.toString()}`;

    try {
      const response = await fetch(url, { method: "POST" });

      if (response.ok) {
        setStatusMessage("Book issued successfully!");
        setBookId(null);
        setMemberId(null);
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
      } catch (parseErr) { }

      setStatusMessage(errMsg);
      alert(errMsg);
    } catch (networkErr) {
      const msg = networkErr?.message || "Network error occurred";
      setStatusMessage(msg);
      alert(msg);
    }
  };

  return (

    <div className="issue-full">
      <h2>Issue Book</h2>
      {statusMessage && <p className="status">{statusMessage}</p>}
      <div className="issue-container">
        <form onSubmit={handleSubmit} className="form">
          <input
            type="number"
            placeholder="Enter Book ID"
            value={bookId ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              setBookId(v === "" ? null : parseInt(v));
            }}
            required
          />
          <input
            type="number"
            placeholder="Enter Member ID"
            value={memberId ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              setMemberId(v === "" ? null : parseInt(v, 10));
            }}
            required
          />
          <button type="submit">Issue Book</button>
          <button type="button" onClick={() => (window.location.href = "/")}>
            Back to Main Menu
          </button>
        </form>

        <div className="issue-display">
          <h4>Available Books</h4>
          {books.length > 0 ? (
            <textarea readOnly value={books.filter(book=>book.availability==="AVAILABLE")
              .map(
              b => `ID: ${b.bookId}, Title: ${b.title}, Author: ${b.author}, Avail: ${b.availability}, Status: ${b.status}`
            ).join("\n")} />
          ) : (
            <p>No books in the library.</p>
          )}

          <h4>Registered Members</h4>
          {members.length > 0 ? (
            <textarea readOnly value={members.map(
              m => `ID: ${m.memberID}, Name: ${m.name}`
            ).join("\n")} />
          ) : (
            <p>No members registered.</p>
          )}
        </div>
      </div>
    </div>

  );
}

export default IssueBook;
