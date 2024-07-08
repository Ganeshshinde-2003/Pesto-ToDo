import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./components.css";
import axios from "axios";
import { FiEdit2 } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import InputField from "./input_field";
import toast from "react-hot-toast";

const TodoItem = ({ todo, refreshTodoList }) => {
  const [editing, setEditing] = useState(false);
  const [editedTodo, setEditedTodo] = useState({
    title: "",
    description: "",
    deadline: "",
    status: "",
  });

  useEffect(() => {
    if (editing) {
      setEditedTodo({
        title: todo.title,
        description: todo.description,
        deadline: todo.deadline,
        status: todo.status,
      });
    }
  }, [editing, todo]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/todos/${todo._id}`);
      toast.success("Todo deleted successfully!", { position: "bottom-center", duration: 2000 })
      refreshTodoList(true);
    } catch (error) {
      toast.error("Failed to delete ToDO!", { position: "bottom-center", duration: 2000 })
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTodo({
      ...editedTodo,
      [name]: value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/todos/${todo._id}`, editedTodo);
      toast.success("Todo updated successfully!", { position: "bottom-center", duration: 2000 })
      setEditing(false);
      refreshTodoList(true);
    } catch (error) {
      toast.error("Failed to update ToDO!", { position: "bottom-center", duration: 2000 })
    }
  };

  return (
    <div className="todo-item">
      <div className="todo-head">
        <h3 className="todo-title">{todo.title}</h3>
        <div className="todo-edit-wrapper">
        <div className="todo-edit-section">
          <p className="todo-deadline">
            Deadline: {new Date(todo.deadline).toLocaleDateString()}
          </p>
          <p
            className={`todo-status ${todo.status.toLowerCase().replace(" ", "-")}`}
          >
            Status: {todo.status}
          </p>
        </div>
        <div className="todo-icons">
          <div className="edit-icon" onClick={handleEdit}>
            <FiEdit2 />
          </div>
          <div className="delete-icon" onClick={handleDelete}>
            <MdDeleteOutline />
          </div>
        </div>
        </div>
      </div>
      <p className="todo-description">{todo.description}</p>

      {editing && <div className="todo-overlay" onClick={handleCancelEdit} />}

      {editing && (
        <div className="edit-popup">
          <div className="todo-form form-wrapper">
            <form onSubmit={handleUpdate}>
              <InputField
                label="Title:"
                type="text"
                value={editedTodo.title}
                onChange={handleInputChange}
                required
                name="title"
              />
              <InputField
                label="Description:"
                type="textarea"
                value={editedTodo.description}
                onChange={handleInputChange}
                required
                name="description"
                rows={7}
              />
              <InputField
                label="Deadline:"
                type="date"
                value={editedTodo.deadline || todo.deadline}
                onChange={handleInputChange}
                required
                name="deadline"
              />
              <select
                name="status"
                value={editedTodo.status}
                onChange={handleInputChange}
                required
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
              <div className="edit-form-buttons">
                <button type="submit">Update</button>
                <button type="button" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

TodoItem.propTypes = {
  todo: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    deadline: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  refreshTodoList: PropTypes.func.isRequired,
};

export default TodoItem;
