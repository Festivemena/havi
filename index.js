import pkg from '@slack/bolt';
const { App } = pkg;
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import commands from './routes/commands.js';
import events from './routes/events.js';

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

// Setup routes
commands(app);
events(app);

// Start server
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log(`Havi bot is running on port ${process.env.PORT || 3000}`);
})();
