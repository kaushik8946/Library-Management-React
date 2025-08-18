import { useRef } from 'react'

function AddMember() {
  const nameRef = useRef();
  const emailRef = useRef();
  const addressRef = useRef();
  const phoneNumberRef = useRef();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value || "";
    const address = addressRef.current.value;
    const phoneNumber = phoneNumberRef.current.value;

    try {
      const res = await fetch("http://localhost:8080/api/members/addMember", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phoneNumber, gender, address })
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
        alert("Member added successfully!");
      } else {
        alert("Failed to add member. " + (responseBody.message || ""));
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleBack = () => {
    window.location.href = '/';
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" required ref={nameRef} />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required ref={emailRef} />

        <label htmlFor="phoneNumber">Phone Number:</label>
        <input type="number" id="phoneNumber" name="phoneNumber" required ref={phoneNumberRef} /> {/* Add ref */}

        <label>Gender:</label>
        <div className="gender-options">
          <label>
            <input type="radio" name="gender" value="MALE" required /> Male
          </label>
          <label>
            <input type="radio" name="gender" value="FEMALE" /> Female
          </label>
          <label>
            <input type="radio" name="gender" value="OTHER" /> Other
          </label>
        </div>

        <label htmlFor="address">Address:</label>
        <input type="text" id="address" name="address" required ref={addressRef} />
        <div className="button-row">
          <input type="submit" value="Add Member" />
          <button type="button" className="back-button" onClick={handleBack}>Back to Main Menu</button>
        </div>
      </form>
    </div>

  )
}

export default AddMember
