const { spawn } = require("child_process");

const child = spawn("node", ["rrs.js"], {
  detached: true, // Make the child process independent from the parent
  stdio: "ignore", // Prevent the child process from inheriting the parent's stdio
});

child.unref(); // Allow parent process to exit without waiting for the child
