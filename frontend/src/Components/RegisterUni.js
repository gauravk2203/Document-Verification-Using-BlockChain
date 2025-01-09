import React, { useState } from "react";
import { registerUniversity } from "../Utils/ContractUtils";
import '../Register.css';

const UniversityRegistrationPanel = () => {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [collegeCode, setCollegeCode] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        // Ensure the required fields are filled
        if (!name || !location || !collegeCode) {
            alert("Please fill in all fields for registration.");
            return;
        }

        // Optional: You can add some basic validation for email and contact if needed
        if (email && !validateEmail(email)) {
            alert("Please enter a valid email.");
            return;
        }
        if (contact && !validateContact(contact)) {
            alert("Please enter a valid contact number.");
            return;
        }

        setLoading(true);
        try {
            // Only pass required fields to the smart contract
            await registerUniversity(name, location, collegeCode);
            alert("University registered successfully!");
        } catch (error) {
            alert("Error registering university: " + error.message);
        }
        setLoading(false);
    };

    // Basic email validation
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Basic contact number validation (optional)
    const validateContact = (contact) => {
        const contactRegex = /^[0-9]{10}$/; // Assuming a 10-digit phone number
        return contactRegex.test(contact);
    };

    return (
        <div>
            <h1>Register University</h1>
            {loading && <p>Processing...</p>}

            <section>
                <h2>University Registration</h2>
                <input
                    type="text"
                    placeholder="University Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="College Code"
                    value={collegeCode}
                    onChange={(e) => setCollegeCode(Number(e.target.value))}
                />
                {/* Email and Contact fields (only for frontend, not passed to blockchain) */}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Contact Number"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                />
                <button onClick={handleRegister}>Register University</button>
            </section>
        </div>
    );
};

export default UniversityRegistrationPanel;
