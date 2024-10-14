import { spawn } from "child_process";

const serverProcess = spawn("react-router-serve", ["./build/server/index.js"], {
  stdio: "inherit",
  shell: true,
});

console.log("Server started in the background. Process ID:", serverProcess.pid);

// Optional: Handle server process exit
serverProcess.on("exit", (code, signal) => {
  console.log(`Server process exited with code ${code} and signal ${signal}`);
});

// Keep the main process running
process.stdin.resume();
