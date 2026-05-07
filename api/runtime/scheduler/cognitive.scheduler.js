const tasks = [];

function registerTask(
  name,
  handler,
  interval
) {

  tasks.push({
    name,
    interval,
    handler
  });
}

function startScheduler() {

  for (const task of tasks) {

    setInterval(() => {

      try {

        task.handler();

      } catch (err) {

        console.error(
          "[SINCLIN_SCHEDULER_ERROR]",
          task.name,
          err
        );
      }

    }, task.interval);
  }

  console.log(
    "[SINCLIN_SCHEDULER]",
    "online"
  );
}

module.exports = {
  tasks,
  registerTask,
  startScheduler
};
