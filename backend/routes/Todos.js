// backend/routes/todos.js

const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// GET /api/todos/:firebaseId - Get todos by firebaseId
router.get('/:firebaseId', async (req, res) => {
  const { firebaseId } = req.params;
  try {
    const todos = await Todo.find({ firebaseId });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// POST /api/todos - Create a new todo
router.post('/', async (req, res) => {
  const { title, description, deadline, status, firebaseId } = req.body;

  try {
    const newTodo = new Todo({
      title,
      description,
      deadline,
      status,
      firebaseId,
    });

    await newTodo.save();

    res.status(201).json(newTodo);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// PUT /api/todos/:id - Update a todo by ID
router.put('/:id', async (req, res) => {
  const { title, description, deadline, status } = req.body;
  const { id } = req.params;

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(id, {
      title,
      description,
      deadline,
      status,
    }, { new: true });

    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(200).json(updatedTodo);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// DELETE /api/todos/:id - Delete a todo by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

module.exports = router;
