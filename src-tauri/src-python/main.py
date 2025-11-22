import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

_tauri_plugin_functions = ["validate_all_data"]

print("initialized python")

def exists(x):
    return x is not None and x != ""

def to_int(x):
    try:
        return int(x)
    except:
        return 0

def validate_data(data, rules):
    errors = []
    for rule in rules.get("checks", []):
        try:
            if eval(rule["condition"], {"exists" : exists, "to_int" : to_int}, data):
                errors.append(rule["message"])
        except Exception as e:
            errors.append(f"Ошибка в правиле: {rule['condition']} ({e})")
    
    return errors

def validate_codes(data, rules):
    errors = []
    weather_list = data.get("weather_events", {}).values()  # получаем значения словаря
    for rule in rules.get("weather_code_rules", []):
        for event in weather_list:
            event_code = f"{event.get('intensity','')}{event.get('descriptor','')}{event.get('weather_event','')}"
            if rule["code"] == event_code:
                for cond in rule.get("conditions", []):
                    try:
                        if not eval(cond["check"], {"to_int" : to_int}, data):
                            errors.append(cond["message"])
                    except Exception as e:
                        errors.append(f"Ошибка в правиле: {cond['check']} ({e})")
    return errors


def validate_all_data(data, rules):
    errors = []
    for record in data.values():
        errors.extend(validate_data(record, rules))
        errors.extend(validate_codes(record, rules))
        
    return errors