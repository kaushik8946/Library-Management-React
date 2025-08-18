import { useEffect, useState } from "react";

export default function ViewMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState([]);
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

  useEffect(() => {
    fetch("http://localhost:8080/api/members/viewMembers")
      .then((res) => {
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        return res.json();
      })
      .then((data) => setMembers(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleBatchDelete = async () => {
    if (selected.length === 0) {
      alert('select members to delete')
      return
    }
    try {
      const response = await fetch(
        "http://localhost:8080/api/members/batchDeleteMembers",
        {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selected),
        }
      )
      if (!response.ok) {
        const errorText = await response.text();
        alert(`Delete failed: ${response.status}\n${errorText}`)
        return
      }
      setMembers((prev) => prev.filter((member) => !selected.includes(member.memberID)))
      setSelected([])
      alert("Selected members deleted successfully!")
    }
    catch (err) {
      alert(err.message)
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>Members</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Address</th>
              <th>Created At</th>
              <th>Created By</th>
              <th>Updated At</th>
              <th>Updated By</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.memberID}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(member.memberID)}
                    onChange={() => toggleSelect(member.memberID)}
                  />
                </td>
                <td>{member.memberID}</td>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{member.phoneNumber}</td>
                <td>{member.gender}</td>
                <td>{member.address}</td>
                <td>{member.createdAt}</td>
                <td>{member.createdBy}</td>
                <td>{member.updatedAt}</td>
                <td>{member.updatedBy}</td>
                <th>
                  <button className="update-button"
                    onClick={() => window.location.href = `/updateMember/${member.memberID}`}>
                    Update
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ margin: '10px' }}>
        <button
          onClick={handleBatchDelete}
          disabled={selected.length === 0}
        >
          Delete Selected
        </button>
        <button
          type="button"
          onClick={() => (window.location.href = "/")}
          style={{ marginLeft: '10px' }}
        >
          Back to Main Menu
        </button>
      </div>
    </div>
  );
}
