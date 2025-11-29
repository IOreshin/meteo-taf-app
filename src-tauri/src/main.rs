#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


use tauri::{command};
use std::fs;
use std::path::PathBuf;
use serde_json::Value;

#[command]
fn load_json(json_name: String) -> Result<Value, String> {
    // Папка с exe
    let mut exe_dir = std::env::current_exe().map_err(|e| e.to_string())?;
    exe_dir.pop();

    let release_path_dir = exe_dir.join("config");

    // В debug версии ищем папку 4 уровня выше
    let dev_path_dir = if cfg!(debug_assertions) {
        let mut path = std::env::current_dir().map_err(|e| e.to_string())?;
        for _ in 0..1 {
            path.pop();
        }
        path.join("config")
    } else {
        PathBuf::from("config")
    };

    // Определяем путь
    let path_to_use = if release_path_dir.exists() {
        release_path_dir.join(&json_name)
    } else if dev_path_dir.exists() {
        dev_path_dir.join(&json_name)
    } else {
        return Err(format!(
            "config.json не найден. Проверялись пути:\n1) {}\n2) {}",
            release_path_dir.display(),
            dev_path_dir.display()
        ));
    };

    // Читаем файл
    let content = fs::read_to_string(path_to_use).map_err(|e| e.to_string())?;

    // Парсим JSON
    serde_json::from_str(&content).map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![load_json])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    meteo_taf_app_lib::run(); // если нужно
}
