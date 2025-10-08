import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  uniqueId :
  {
    
  },
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low',
  },
  tags: {
    type: [String],
    default: [],
  },
  timestamp: {
    type: String,
    required: true,
  },
});

const Task = mongoose.model('Task', taskSchema);
export default Task;
