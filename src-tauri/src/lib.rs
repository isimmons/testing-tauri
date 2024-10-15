#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

use tauri::plugin::TauriPlugin;
use tauri_plugin_log::{Builder, Target, TargetKind};

pub fn init_plugin() -> TauriPlugin<tauri::Wry> {
    Builder::new()
        .targets([
            Target::new(TargetKind::Stdout),
            Target::new(TargetKind::Webview),
            Target::new(TargetKind::LogDir {
                file_name: Some("app.log".into()),
            }),
        ])
        .level(log::LevelFilter::Info)
        .build()
}
