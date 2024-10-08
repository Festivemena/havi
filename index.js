import pkg from '@slack/bolt';
const { App } = pkg;
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Bolt Slack app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Command Handlers

// Create a new project
app.command('/slack/commands/createproject', async ({ command, ack, respond }) => {
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
app.command('/addtask', async ({ command, ack, respond }) => {
  await ack(); // Acknowledge the command
  const args = command.text.split(',');

  if (args.length < 4) {
    await respond("Usage: `/addtask [project_name], [task_name], [assigned_to], [deadline]`");
    return;
  }

  const [projectName, taskName, assignedTo, deadline] = args.map(arg => arg.trim());
  // Logic to add the task to the specified project here
  await respond(`Task "${taskName}" added to project "${projectName}" and assigned to "${assignedTo}". Deadline: "${deadline}".`);
});

// Set a budget for a project
app.command('/budget', async ({ command, ack, respond }) => {
  await ack(); // Acknowledge the command
  const args = command.text.split(',');

  if (args.length < 2) {
    await respond("Usage: `/budget [project_name], [budget_amount]`");
    return;
  }

  const [projectName, budgetAmount] = args.map(arg => arg.trim());
  // Logic to set the budget for the project here
  await respond(`Budget of "${budgetAmount}" set for project "${projectName}".`);
});

// Get project details
app.command('/getproject', async ({ command, ack, respond }) => {
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
app.command('/listprojects', async ({ command, ack, respond }) => {
  await ack(); // Acknowledge the command

  // Logic to list all projects from your database here
  const projects = ['Project A', 'Project B', 'Project C']; // Example data
  await respond(`Current projects: ${projects.join(', ')}`);
});

// Update task status
app.command('/updatetask', async ({ command, ack, respond }) => {
  await ack(); // Acknowledge the command
  const args = command.text.split(',');

  if (args.length < 3) {
    await respond("Usage: `/updatetask [task_name], [project_name], [status]`");
    return;
  }

  const [taskName, projectName, status] = args.map(arg => arg.trim());
  // Logic to update the task status in your database here
  await respond(`Task "${taskName}" in project "${projectName}" updated to status "${status}".`);
});

// Delete a project
app.command('/deleteproject', async ({ command, ack, respond }) => {
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
app.command('/cashin', async ({ command, ack, respond }) => {
  await ack(); // Acknowledge the command
  const args = command.text.split(',');

  if (args.length < 2) {
    await respond("Usage: `/cashin [project_name], [amount]`");
    return;
  }

  const [projectName, amount] = args.map(arg => arg.trim());
  // Logic to record cash in for the project here
  await respond(`Cash in of "${amount}" recorded for project "${projectName}".`);
});

// Set cash out for a project
app.command('/cashout', async ({ command, ack, respond }) => {
  await ack(); // Acknowledge the command
  const args = command.text.split(',');

  if (args.length < 2) {
    await respond("Usage: `/cashout [project_name], [amount]`");
    return;
  }

  const [projectName, amount] = args.map(arg => arg.trim());
  // Logic to record cash out for the project here
  await respond(`Cash out of "${amount}" recorded for project "${projectName}".`);
});

// Catch all unhandled requests
app.error(async (error) => {
  console.error(`Error occurred: ${error}`);
});

// Start server
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log(`Havi bot is running on port ${process.env.PORT || 3000}`);
})();
