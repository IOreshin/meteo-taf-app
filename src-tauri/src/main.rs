#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]


use tauri::{command};
use std::fs;
use std::path::PathBuf;
use serde_json::Value;

// ---- твоя команда для JSON ----
#[command]
fn load_json() -> Result<Value, String> {
    let mut exe_dir = std::env::current_exe().map_err(|e| e.to_string())?;
    exe_dir.pop();
    let release_path = exe_dir.join("config.json");
    let dev_path = PathBuf::from("./config.json");

    let path_to_use = if release_path.exists() {
        release_path
    } else if dev_path.exists() {
        dev_path
    } else {
        return Err("config.json не найден".into());
    };

    let content = fs::read_to_string(path_to_use).map_err(|e| e.to_string())?;
    serde_json::from_str(&content).map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_python::init())
        .invoke_handler(tauri::generate_handler![load_json])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    meteo_taf_app_lib::run();
}
