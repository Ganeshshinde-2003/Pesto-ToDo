import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth } from "../components/firebase";
import TodoItem from "../components/reusable_components/Todo_Item";
import InputField from "../components/reusable_components/input_field";
import toast from "react-hot-toast";
import "./page.css";
import "./auth/forms.css";

const Home = () => {
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    deadline: "",
    status: "To Do",
  });
  const [formError, setFormError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const response = await axios.get(`/api/users/${currentUser.uid}`);
          setUser(response.data);
        } else {
          setError("No user is signed in.");
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const response = await axios.get(`/api/todos/${currentUser.uid}`);
          setTodos(response.data);
        } else {
          setError("No user is signed in.");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const refreshTodoList = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const response = await axios.get(`/api/todos/${currentUser.uid}`);
        setTodos(response.data);
      } else {
        setError("No user is signed in.");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUserInfoClick = () => setShowUserInfo(!showUserInfo);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTodo({
      ...newTodo,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (!newTodo.title || !newTodo.description || !newTodo.deadline) {
      setFormError("Please fill in all required fields.");
      return false;
    }
    return true;
  };

  const handleCreateTodo = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitLoading(true);

    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await axios.post(`/api/todos`, {
          ...newTodo,
          firebaseId: currentUser.uid,
        });
        toast.success("ToDo created successfully", {
          position: "bottom-center",
          duration: 1000,
        });
        await refreshTodoList();
        setNewTodo({
          title: "",
          description: "",
          deadline: "",
          status: "To Do",
        });
        setFormError("");
      } else {
        toast.error("Failed to create ToDO", {
          position: "bottom-center",
          duration: 1000,
        });
        setError("No user is signed in.");
      }
    } catch (error) {
      toast.error("Failed to create ToDO", {
        position: "bottom-center",
        duration: 1000,
      });
      setError(error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setTodos([]);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const filterTodos = () => {
    let filteredTodos = todos;

    if (statusFilter !== "All") {
      filteredTodos = filteredTodos.filter(
        (todo) => todo.status === statusFilter
      );
    }

    if (searchTerm) {
      filteredTodos = filteredTodos.filter((todo) =>
        todo.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredTodos;
  };

  if (loading) {
    return <div className="loader"></div>;
  }

  return (
    <div className="container-wrapper">
      <div className="todo-list">
        <div className="home-header">
          <div className="header-container">
            <h2>My Todos</h2>
            <div className="functionality-div">
              <div className="filter">
                <label>Filter by Status: </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div className="search">
                <InputField
                  label="Search:"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title"
                />
              </div>
            </div>
          </div>
          {user && (
            <div className="user-info-wrapper">
              <div className="user-info" onClick={handleUserInfoClick}>
                <p>{user.name ? user.name[0] : "?"}</p>
              </div>
              {showUserInfo && user.name && (
                <div className="user-details">
                  <p>Name: {user.name}</p>
                  <p>Email: {user.email}</p>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="content">
          <div className="todo-items">
            {filterTodos().length > 0 ? (
              filterTodos()
                .slice()
                .reverse()
                .map((todo) => (
                  <TodoItem
                    key={todo._id}
                    todo={todo}
                    refreshTodoList={refreshTodoList}
                  />
                ))
            ) : (
              <p>No todos found.</p>
            )}
          </div>
          <div className="todo-form form-wrapper">
            <h2>Create a ToDo</h2>
            <form onSubmit={handleCreateTodo}>
              <InputField
                label="Title:"
                type="text"
                value={newTodo.title}
                onChange={handleInputChange}
                name="title"
                required
              />
              <InputField
                label="Description:"
                type="textarea"
                value={newTodo.description}
                onChange={handleInputChange}
                name="description"
                required
                rows={7}
              />
              <InputField
                label="Deadline:"
                type="date"
                value={newTodo.deadline}
                onChange={handleInputChange}
                name="deadline"
                required
              />
              {formError && <p className="form-error">{formError}</p>}
              <button type="submit">
                {submitLoading ? <div className="loader"></div> : "Create Todo"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
