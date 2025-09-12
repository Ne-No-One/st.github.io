"""
Health check для моніторингу системи
"""
import json
import os
from django.http import JsonResponse
from django.conf import settings
from django.views.decorators.http import require_http_methods

@require_http_methods(["GET"])
def health_check(request):
    """Health check endpoint"""
    
    health_status = {
        "status": "ok",
        "checks": {},
        "errors": [],
        "warnings": []
    }
    
    # Перевіряємо JSON файл
    json_file = os.path.join(settings.BASE_DIR, 'data.json')
    if os.path.exists(json_file):
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                json.load(f)
            health_status["checks"]["json_file"] = "ok"
        except Exception as e:
            health_status["checks"]["json_file"] = "error"
            health_status["errors"].append(f"JSON файл некоректний: {e}")
    else:
        health_status["checks"]["json_file"] = "missing"
        health_status["errors"].append("JSON файл відсутній")
    
    # Перевіряємо JSONManager
    try:
        from json_manager import JSONManager
        json_manager = JSONManager()
        site_settings = json_manager.get_site_settings()
        if site_settings:
            health_status["checks"]["json_manager"] = "ok"
        else:
            health_status["checks"]["json_manager"] = "warning"
            health_status["warnings"].append("JSONManager працює, але дані порожні")
    except Exception as e:
        health_status["checks"]["json_manager"] = "error"
        health_status["errors"].append(f"JSONManager помилка: {e}")
    
    # Перевіряємо статичні файли
    static_files = [
        'static/css/style.css',
        'static/js/main.js'
    ]
    
    missing_static = []
    for static_file in static_files:
        file_path = os.path.join(settings.BASE_DIR, static_file)
        if not os.path.exists(file_path):
            missing_static.append(static_file)
    
    if missing_static:
        health_status["checks"]["static_files"] = "warning"
        health_status["warnings"].append(f"Відсутні статичні файли: {', '.join(missing_static)}")
    else:
        health_status["checks"]["static_files"] = "ok"
    
    # Перевіряємо шаблони
    templates = [
        'templates/index.html',
        'templates/admin_panel/base.html'
    ]
    
    missing_templates = []
    for template in templates:
        template_path = os.path.join(settings.BASE_DIR, template)
        if not os.path.exists(template_path):
            missing_templates.append(template)
    
    if missing_templates:
        health_status["checks"]["templates"] = "error"
        health_status["errors"].append(f"Відсутні шаблони: {', '.join(missing_templates)}")
    else:
        health_status["checks"]["templates"] = "ok"
    
    # Перевіряємо sessions
    sessions_dir = os.path.join(settings.BASE_DIR, 'sessions')
    if os.path.exists(sessions_dir):
        health_status["checks"]["sessions"] = "ok"
    else:
        health_status["checks"]["sessions"] = "warning"
        health_status["warnings"].append("Директорія sessions відсутня")
    
    # Визначаємо загальний статус
    if health_status["errors"]:
        health_status["status"] = "error"
    elif health_status["warnings"]:
        health_status["status"] = "warning"
    
    # Встановлюємо правильний статус код
    status_code = 200
    if health_status["status"] == "error":
        status_code = 500
    elif health_status["status"] == "warning":
        status_code = 200  # Попередження не є критичними
    
    return JsonResponse(health_status, status=status_code)
