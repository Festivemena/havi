import pkg from '@slack/bolt';
const { App } = pkg;
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Bolt Slack app
const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Initialize Express app
const expressApp = express();
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));

// Slack Command Handlers

// Create a new project
slackApp.command('/createproject', async ({ command, ack, respond }) => {
  await ack(); // Acknowledge the command
  const projectName = command.text.trim();

  if (!projectName) {
    await respond("Please provide a project name. Usage: `/createproject [project_name]`");
    return;
  }

  // Logic to create the project in your database here
  await respond(`Project "${projectName}" created successfully.`);
});

// Add a task to a project
slackApp.command('/addtask', async ({ command, ack, respond }) => {
  await ack(); // Acknowledge the command
  const args = command.text.split(',');

  if (args.length < 4) {
    await respond("Usage: `/addtask [project_name], [task_name], [assigned_to], [deadline]`");
    return;
  }

  const [projectName, taskName, assignedTo, deadline] = args.map((arg) => arg.trim());
  // Logic to add the task to the specified project here
  await respond(`Task "${taskName}" added to project "${projectName}" and assigned to "${assignedTo}". Deadline: "${deadline}".`);
});

// Set a budget for a project
slackApp.command('/budget', async ({ command, ack, respond }) => {
  await ack(); // Acknowledge the command
  const args = command.text.split(',');

  if (args.length < 2) {
    await respond("Usage: `/budget [project_name], [budget_amount]`");
    return;
  }

  const [projectName, budgetAmount] = args.map((arg) => arg.trim());
  // Logic to set the budget for the project here
  await respond(`Budget of "${budgetAmount}" set for project "${projectName}".`);
});

// Get project details
slackApp.command('/getproject', async ({ command, ack, respond }) => {
  await ack(); // Acknowledge the command
  const projectName = command.text.trim();

  if (!projectName) {
    await respond("Please provide a project name. Usage: `/getproject [project_name]`");
    return;
  }

  // Logic to retrieve project details from your database here
  await respond(`Details for project "${projectName}" retrieved successfully.`);
});

// List all projects
slackApp.command('/listprojects', async ({ command, ack, respond }) => {
  await ack(); // Acknowledge the command

  // Logic to list all projects from your database here
  const projects = ['Project A', 'Project B', 'Project C']; // Example data
  await respond(`Current projects: ${projects.join(', ')}`);
});

// Update task status
slackApp.command('/updatetask', async ({ command, ack, respond }) => {
  await ack(); // Acknowledge the command
  const args = command.text.split(',');

  if (args.length < 3) {
    await respond("Usage: `/updatetask [task_name], [project_name], [status]`");
    return;
  }

  const [taskName, projectName, status] = args.map((arg) => arg.trim());
  // Logic to update the task status in your database here
  await respond(`Task "${taskName}" in project "${projectName}" updated to status "${status}".`);
});

// Delete a project
slackApp.command('/deleteproject', async ({ command, ack, respond }) => {
  await ack(); // Acknowledge the command
  const projectName = command.text.trim();

  if (!projectName) {
    await respond("Please provide a project name. Usage: `/deleteproject [project_name]`");
    return;
  }

  // Logic to delete the project from your database here
  await respond(`Project "${projectName}" deleted successfully.`);
});

// Set cash in for a project
slackApp.command('/cashin', async ({ command, ack, respond }) => {
  await ack(); // Acknowledge the command
  const args = command.text.split(',');

  if (args.length < 2) {
    await respond("Usage: `/cashin [project_name], [amount]`");
    return;
  }

  const [projectName, amount] = args.map((arg) => arg.trim());
  // Logic to record cash in for the project here
  await respond(`Cash in of "${amount}" recorded for project "${projectName}".`);
});

// Set cash out for a project
slackApp.command('/cashout', async ({ command, ack, respond }) => {
  await ack(); // Acknowledge the command
  const args = command.text.split(',');

  if (args.length < 2) {
    await respond("Usage: `/cashout [project_name], [amount]`");
    return;
  }

  const [projectName, amount] = args.map((arg) => arg.trim());
  // Logic to record cash out for the project here
  await respond(`Cash out of "${amount}" recorded for project "${projectName}".`);
});

// Express Routes

// GET route to retrieve all projects
expressApp.get('/', async (req, res) => {
  // Logic to retrieve all projects from the database here
  const projects = ['Project A', 'Project B', 'Project C']; // Example data
  res.json({ projects });
});

// POST route to create a new project
expressApp.post('/createproject', async (req, res) => {
  const { projectName } = req.body;

  if (!projectName) {
    return res.status(400).json({ error: 'Project name is required.' });
  }

  // Logic to save the project in your database here
  res.status(201).json({ message: `Project "${projectName}" created successfully.` });
});

// Catch all unhandled requests
slackApp.error(async (error) => {
  console.error(`Error occurred: ${error}`);
});

// Start server
(async () => {
  await slackApp.start(process.env.PORT || 3000);
  expressApp.listen(process.env.EXPRESS_PORT || 4000, () => {
    console.log(`Express server is running on port ${process.env.EXPRESS_PORT || 4000}`);
  });
})();
