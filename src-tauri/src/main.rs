#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


use tauri::{command};
use std::fs;
use std::path::PathBuf;
use serde_json::Value;
use serde::{Serialize, Deserialize};


#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ConditionSide {
    pub r#type: String,
    pub field: Option<String>,
    pub func: Option<String>,
    pub expr: Option<String>,
    pub value: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ConditionBlock {
    pub logic_link: String,
    pub left: ConditionSide,
    pub operator: String,
    pub right: ConditionSide,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Rule {
    pub message: String,
    pub conditions: Vec<ConditionBlock>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct CodeRules {
    pub code: String,
    pub rules: Vec<Rule>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct FullJson {
    pub common_rules: Vec<Rule>,
    pub rules_by_code: Vec<CodeRules>,
}

fn load_or_create_json(path: &str) -> Result<FullJson, String> {
    use std::path::Path;
    use std::fs;

    if Path::new(path).exists() {
        let content = fs::read_to_string(path)
            .map_err(|e| e.to_string())?;
        Ok(serde_json::from_str(&content)
            .map_err(|e| e.to_string())?)
    } else {
        Ok(FullJson {
            common_rules: vec![],
            rules_by_code: vec![],
        })
    }
}

#[command]
fn save_common_rule(rule: Rule) -> Result<(), String> {
    use std::fs;

    let path = get_json_path("validation-rules.json")?;
    let mut json = load_or_create_json(path.to_str().ok_or("Invalid path")?)?;

    json.common_rules.push(rule);

    let updated = serde_json::to_string_pretty(&json)
        .map_err(|e| e.to_string())?;

    fs::write(&path, updated)
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[command]
fn save_code_rule(code: String, rule: Rule) -> Result<(), String> {
    use std::fs;

    let path = get_json_path("validation-rules.json")?;
    let mut json = load_or_create_json(path.to_str().ok_or("Invalid path")?)?;

    // ищем код среди существующих
    if let Some(code_block) = json.rules_by_code.iter_mut().find(|c| c.code == code) {
        code_block.rules.push(rule);
    } else {
        // если кода нет — создаём новый
        json.rules_by_code.push(CodeRules {
            code,
            rules: vec![rule],
        });
    }

    let updated = serde_json::to_string_pretty(&json)
        .map_err(|e| e.to_string())?;

    fs::write(&path, updated)
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[command]
fn delete_common_rule(message: String) -> Result<(), String> {
    use std::fs;

    let path = get_json_path("validation-rules.json")?;
    let mut json = load_or_create_json(path.to_str().ok_or("Invalid path")?)?;

    // фильтруем, оставляя только правила с другим message
    json.common_rules.retain(|r| r.message != message);

    let updated = serde_json::to_string_pretty(&json)
        .map_err(|e| e.to_string())?;

    fs::write(&path, updated)
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[command]
fn delete_code_rule(code: String, message: String) -> Result<(), String> {
    use std::fs;

    let path = get_json_path("validation-rules.json")?;
    let mut json = load_or_create_json(path.to_str().ok_or("Invalid path")?)?;

    // ищем блок с кодом
    if let Some(code_block) = json.rules_by_code.iter_mut().find(|c| c.code == code) {
        code_block.rules.retain(|r| r.message != message);

        // если после удаления список пуст — можно автоматически удалить сам блок
        if code_block.rules.is_empty() {
            json.rules_by_code.retain(|c| c.code != code);
        }
    }

    let updated = serde_json::to_string_pretty(&json)
        .map_err(|e| e.to_string())?;

    fs::write(&path, updated)
        .map_err(|e| e.to_string())?;

    Ok(())
}


fn get_json_path(json_name: &str) -> Result<PathBuf, String> {
    // Папка с exe
    let mut exe_dir = std::env::current_exe().map_err(|e| e.to_string())?;
    exe_dir.pop();

    let release_path_dir = exe_dir.join("config");

    // Debug path
    let dev_path_dir = if cfg!(debug_assertions) {
        let mut path = std::env::current_dir().map_err(|e| e.to_string())?;
        path.pop();
        path.join("config")
    } else {
        PathBuf::from("config")
    };

    if release_path_dir.exists() {
        Ok(release_path_dir.join(json_name))
    } else if dev_path_dir.exists() {
        Ok(dev_path_dir.join(json_name))
    } else {
        Err(format!(
            "config.json не найден. Проверялись пути:\n1) {}\n2) {}",
            release_path_dir.display(),
            dev_path_dir.display()
        ))
    }
}


#[command]
fn load_json(json_name: String) -> Result<Value, String> {
    let path = get_json_path(&json_name)?;

    let content = fs::read_to_string(path).map_err(|e| e.to_string())?;
    serde_json::from_str(&content).map_err(|e| e.to_string())
}


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            load_json,
            save_common_rule,
            save_code_rule,
            delete_code_rule,
            delete_common_rule
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    meteo_taf_app_lib::run();
}

