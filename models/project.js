import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  name: String,
  assignedTo: String,
  deadline: Date,
  status: { type: String, default: 'in-progress' }
});

const projectSchema = new mongoose.Schema({
  name: String,
  tasks: [taskSchema],
  budget: {
    total: Number,
    spent: Number,
    cashIn: { type: Number, default: 0 },  // Cash In
    cashOut: { type: Number, default: 0 }  // Cash Out
  }
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
