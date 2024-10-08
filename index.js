import pkg from '@slack/bolt';
const { App } = pkg;
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import commands from './routes/commands.js'; // Import command routes
import events from './routes/events.js';     // Import event routes

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

// Define command handlers directly here
app.command('/createproject', async ({ command, ack, respond }) => {
  await ack();
  const projectName = command.text.trim();

  if (!projectName) {
    await respond("Please provide a project name. Usage: `/createproject [project_name]`");
    return;
  }

  // Logic to create the project in your database here
  await respond(`Project "${projectName}" created successfully.`);
});

// Other command handlers
app.command('/addtask', async ({ command, ack, respond }) => {
  await ack();
  const args = command.text.split(',');
  
  if (args.length < 4) {
    await respond("Usage: `/addtask [project_name], [task_name], [assigned_to], [deadline]`");
    return;
  }
  
  const [projectName, taskName, assignedTo, deadline] = args.map(arg => arg.trim());
  // Logic to add the task to the specified project here
  await respond(`Task "${taskName}" added to project "${projectName}" and assigned to "${assignedTo}". Deadline: "${deadline}".`);
});

app.command('/budget', async ({ command, ack, respond }) => {
  await ack();
  const args = command.text.split(',');
  
  if (args.length < 2) {
    await respond("Usage: `/budget [project_name], [budget_amount]`");
    return;
  }

  const [projectName, budgetAmount] = args.map(arg => arg.trim());
  // Logic to set the budget for the project here
  await respond(`Budget of "${budgetAmount}" set for project "${projectName}".`);
});

// ... Add the other command handlers in a similar manner ...

// Setup routes for events and commands if needed
commands(app);
events(app);

// Start server
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log(`Havi bot is running on port ${process.env.PORT || 3000}`);
})();
