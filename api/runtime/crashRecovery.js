process.on(
  "uncaughtException",
  (err) => {

    console.error(
      "[SINCLIN_FATAL]",
      err
    );
  }
);

process.on(
  "unhandledRejection",
  (err) => {

    console.error(
      "[SINCLIN_REJECTION]",
      err
    );
  }
);
