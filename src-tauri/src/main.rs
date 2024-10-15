// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::http::{Request, Response};
use tauri::UriSchemeContext;
use std::process::Command;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let _app_handle = app.handle();
            tauri::async_runtime::spawn(async move {
                // Start the server
                let output = Command::new("node")
                    .arg("scripts/start-server.js")
                    .output()
                    .expect("Failed to start server");

                log::info!("Server output: {:?}", output);
            });
            Ok(())
        })
        .plugin(app_lib::init_plugin())
        .register_uri_scheme_protocol("tauri", move |_app: UriSchemeContext<'_, tauri::Wry>, request: Request<Vec<u8>>| -> Response<Vec<u8>> {
            // Forward the request to your Node.js server
            let url = format!("http://localhost:3000{}", request.uri().path());
            let client = reqwest::blocking::Client::new();
            
            match client.get(&url).send() {
                Ok(response) => {
                    let status = response.status();
                    let headers = response.headers().clone();
                    let body = response.bytes().unwrap_or_default();

                    let mut builder = Response::builder();
                    builder = builder.status(status.as_u16());
                    for (name, value) in headers {
                        if let Some(name) = name {
                            builder = builder.header(name.as_str(), value.to_str().unwrap_or_default());
                        }
                    }
                    builder.body(body.to_vec()).unwrap()
                },
                Err(e) => {
                    Response::builder()
                        .status(500)
                        .body(format!("Error: {}", e).into_bytes())
                        .unwrap()
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
