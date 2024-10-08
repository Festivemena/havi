import Project from '../models/project.js';

// Create a new project
export const createProject = async (projectName) => {
  const project = new Project({ name: projectName, tasks: [], budget: { total: 0, spent: 0 } });
  await project.save();
  return project;
};

// Handle cash in
export const cashIn = async (projectName, amount) => {
  const project = await Project.findOne({ name: projectName });
  if (!project) return null;

  project.budget.cashIn += amount;
  await project.save();
  return project;
};

// Handle cash out
export const cashOut = async (projectName, amount) => {
  const project = await Project.findOne({ name: projectName });
  if (!project) return null;

  project.budget.cashOut += amount;
  project.budget.spent += amount;
  await project.save();
  return project;
};

// Assign task to a user
export const assignTask = async (projectName, taskName, assignedTo, deadline) => {
  const project = await Project.findOne({ name: projectName });
  if (!project) return null;

  project.tasks.push({ name: taskName, assignedTo, deadline });
  await project.save();
  return project;
};

// Set budget for a project
export const setBudget = async (projectName, budget) => {
  const project = await Project.findOne({ name: projectName });
  if (!project) return null;

  project.budget.total = budget;
  await project.save();
  return project;
};

// Generate budget report
export const getBudgetReport = async (projectName) => {
  const project = await Project.findOne({ name: projectName });
  if (!project) return null;

  const { total, spent, cashIn, cashOut } = project.budget;
  const remaining = total - spent;
  return { total, spent, cashIn, cashOut, remaining };
};

// Mark a task as complete using task ID (e.g., message timestamp)
export const markTaskComplete = async (projectName, taskId) => {
  const project = await Project.findOne({ name: projectName });
  if (!project) return null;

  const task = project.tasks.find(task => task._id.toString() === taskId);  // Find the task by ID
  if (task) {
    task.status = 'completed';  // Update task status
    await project.save();
    return project;
  }
  return null;
};

// Get project status (returns tasks and their statuses)
export const getProjectStatus = async (projectName) => {
  const project = await Project.findOne({ name: projectName });
  return project ? project : null;
};
