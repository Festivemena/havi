import { getProjectStatus, markTaskComplete } from '../controllers/projectController.js';

export default (app) => {
  // Handle reaction added event (e.g., marking tasks as completed)
  app.event('reaction_added', async ({ event, say }) => {
    const { reaction, item } = event;

    if (reaction === 'white_check_mark') {
      const taskId = item.ts;  // Use timestamp as task ID for simplicity
      const projectName = event.item.channel;  // Assuming project name is the channel name

      const project = await markTaskComplete(projectName, taskId);
      if (project) {
        await say(`Task with ID ${taskId} has been marked as completed for project '${projectName}'!`);
      } else {
        await say(`Failed to mark the task as completed.`);
      }
    }
  });

  // Handle a mention (optional: respond when bot is mentioned in a message)
  app.event('app_mention', async ({ event, say }) => {
    await say(`Hello! You mentioned me. How can I assist you with your project?`);
  });

  // Example of listening to messages in a channel (optional)
  app.message(/project-status/, async ({ message, say }) => {
    const projectName = message.channel;  // Assuming the channel is the project name
    const project = await getProjectStatus(projectName);

    if (project) {
      await say(`Project '${projectName}' has ${project.tasks.length} tasks in total. Here's the current status.`);
    } else {
      await say(`I couldn't find the status of project '${projectName}'.`);
    }
  });
};
