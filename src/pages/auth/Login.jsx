import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./forms.css";
import InputField from "../../components/reusable_components/input_field";
import { auth } from "../../components/firebase";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(email && password);
  }, [email, password]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!", {position: "bottom-center", duration: 2000});
      navigate("/");
    } catch (error) {
      setError(error.message);
      toast.error("Login error: " + error.message, {position: "bottom-center", duration: 2000});
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <h2>Welcome back!</h2>
      <p>Login to continue.</p>
      <form onSubmit={handleLogin}>
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
          {loading ? <div className="loader"></div> : "Log in"}
        </button>
      </form>
      <p className="alternative-link">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;
