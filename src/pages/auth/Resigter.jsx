import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./forms.css";
import InputField from "../../components/reusable_components/input_field";
import { auth } from "../../components/firebase";
import toast from "react-hot-toast";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(firstName && email && password);
  }, [firstName, email, password]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await axios.post("/api/users", {
        email: user.email,
        firebaseId: user.uid,
        name: firstName,
      });
      toast.success("Accound created in successfully!", {position: "bottom-center", duration: 2000});
      navigate("/login");
    } catch (error) {
      setError(error.message);
      toast.error("Registration error: " + error.message, {position: "bottom-center", duration: 2000} )
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <h2>Create an account</h2>
      <p>Please enter your details here.</p>
      <form onSubmit={handleRegister}>
        <InputField
          label="Name:"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <InputField
          label="Email:"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <InputField
          label="Password:"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className={isFormValid ? "button-enabled" : "button-disabled"}
          disabled={!isFormValid || loading}
        >
          {loading ? <div className="loader"></div> : "Create my account"}
        </button>
      </form>
      <p className="alternative-link">
        Have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
