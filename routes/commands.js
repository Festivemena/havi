import { createProject, cashIn, cashOut, assignTask, setBudget, getBudgetReport } from '../controllers/projectController.js';

export default (app) => {
  // Command to create a new project
  app.command('/create-project', async ({ command, ack, say }) => {
    await ack();
    const projectName = command.text;
    const project = await createProject(projectName);
    if (project) {
      await say(`Project '${projectName}' has been created.`);
    } else {
      await say(`Failed to create project.`);
    }
  });

  // Cash in command
  app.command('/cash-in', async ({ command, ack, say }) => {
    await ack();
    const [projectName, amount] = command.text.split(' ');
    const updatedProject = await cashIn(projectName, parseFloat(amount));
    if (updatedProject) {
      await say(`$${amount} has been added as cash in for project '${projectName}'.`);
    } else {
      await say(`Failed to cash in.`);
    }
  });

  // Cash out command
  app.command('/cash-out', async ({ command, ack, say }) => {
    await ack();
    const [projectName, amount] = command.text.split(' ');
    const updatedProject = await cashOut(projectName, parseFloat(amount));
    if (updatedProject) {
      await say(`$${amount} has been spent as cash out for project '${projectName}'.`);
    } else {
      await say(`Failed to cash out.`);
    }
  });

  // Budget report
  app.command('/budget-report', async ({ command, ack, say }) => {
    await ack();
    const projectName = command.text;
    const report = await getBudgetReport(projectName);
    if (report) {
      await say(`Budget report for project '${projectName}':\nTotal: $${report.total}\nSpent: $${report.spent}\nCash In: $${report.cashIn}\nCash Out: $${report.cashOut}\nRemaining: $${report.remaining}`);
    } else {
      await say(`Failed to fetch budget report.`);
    }
  });

  // Assign task to a user
  app.command('/assign', async ({ command, ack, say }) => {
    await ack();
    const [taskName, user] = command.text.split(' to ');
    const projectName = command.channel_id;
    const deadline = new Date();

    const project = await assignTask(projectName, taskName, user, deadline);
    if (project) {
      await say(`Task '${taskName}' assigned to ${user}.`);
    } else {
      await say(`Failed to assign task.`);
    }
  });

  // Set budget for a project
  app.command('/set-budget', async ({ command, ack, say }) => {
    await ack();
    const [projectName, budget] = command.text.split(' ');
    const updatedProject = await setBudget(projectName, parseFloat(budget));
    if (updatedProject) {
      await say(`Budget of $${budget} set for project '${projectName}'.`);
    } else {
      await say(`Failed to set budget.`);
    }
  });
};
