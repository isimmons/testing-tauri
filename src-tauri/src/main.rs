// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;
use tauri::Manager;

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      let app_handle = app.handle();
      tauri::async_runtime::spawn(async move {
        // Start the server
        let output = Command::new("node")
          .arg("scripts/start-server.js")
          .output()
          .expect("Failed to start server");

        println!("Server output: {:?}", output);

        // Now you can use get_window if needed
        // let main_window = app_handle.get_window("main").unwrap();
      });
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
