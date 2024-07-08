import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "./components/firebase";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Resigter";
import Home from "./pages/Home";
import { Toaster } from 'react-hot-toast';

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  });

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/home" /> : <Login />}
          />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
