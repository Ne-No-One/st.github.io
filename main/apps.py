from django.apps import AppConfig
import logging

logger = logging.getLogger('main')

class MainConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'main'
    
    def ready(self):
        """Викликається коли Django app готовий"""
        logger.info("🚀 Запуск додатку Main")
        logger.info("✅ Main готовий до роботи")