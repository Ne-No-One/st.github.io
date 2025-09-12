from django.apps import AppConfig
import logging

logger = logging.getLogger('admin_panel')

class AdminPanelConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'admin_panel'
    
    def ready(self):
        """Викликається коли Django app готовий"""
        logger.info("⚙️ Запуск додатку Admin Panel")
        
        # Перевіряємо доступність JSONManager
        try:
            from json_manager import JSONManager
            json_manager = JSONManager()
            logger.info("✅ JSONManager доступний для Admin Panel")
        except Exception as e:
            logger.error(f"❌ Помилка ініціалізації JSONManager в Admin Panel: {e}")
            
        logger.info("✅ Admin Panel готовий до роботи")
