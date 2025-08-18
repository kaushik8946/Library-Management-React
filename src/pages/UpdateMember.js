import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';

function UpdateMember() {
  const { memberID } = useParams();
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const addressRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const [gender, setGender] = useState('');

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/members/viewMembers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ memberID })
        });
        
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        
        if (data.length === 0) {
          alert("member not found");
        } else {
          const member = data[0];
          nameRef.current.value = member.name;
          emailRef.current.value = member.email;
          phoneNumberRef.current.value = member.phoneNumber;
          addressRef.current.value = member.address;
          setGender(member.gender);
        }
      } catch (err) {
        alert("Error: " + err.message);
      }
    };
    
    fetchMember();
  }, [memberID]); 

  useEffect(() => {
    if (gender) {
      const radioButton = document.querySelector(`input[name="gender"][value="${gender}"]`);
      if (radioButton) radioButton.checked = true;
    }
  }, [gender]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const selectedGender = document.querySelector('input[name="gender"]:checked')?.value || "";
    const address = addressRef.current.value;
    const phoneNumber = phoneNumberRef.current.value;

    try {
      const res = await fetch("http://localhost:8080/api/members/updateMember", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberID, name, email, phoneNumber, gender: selectedGender, address })
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
        alert("Member updated successfully!");
      } else {
        alert("Failed to update member. " + (responseBody.message || ""));
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
        <input type="number" id="phoneNumber" name="phoneNumber" required ref={phoneNumberRef} />

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
          <input type="submit" value="Update Member" />
          <button type="button" className="back-button" onClick={handleBack}>Back to Main Menu</button>
        </div>
      </form>
    </div>
  )
}

export default UpdateMember
