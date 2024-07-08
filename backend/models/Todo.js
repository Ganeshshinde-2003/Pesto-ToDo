// models/Todo.js
const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', "Done"],
    default: 'To Do',
  },
  firebaseId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Todo', TodoSchema);
