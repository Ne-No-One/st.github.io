"""
Management команда для валідації системи
"""
from django.core.management.base import BaseCommand
from mysite.startup_checks import run_startup_checks

class Command(BaseCommand):
    help = 'Валідація всієї системи'
    
    def handle(self, *args, **options):
        self.stdout.write("🔍 Запуск валідації системи...")
        
        if run_startup_checks():
            self.stdout.write(
                self.style.SUCCESS('✅ Валідація пройшла успішно!')
            )
        else:
            self.stdout.write(
                self.style.ERROR('❌ Валідація провалилася!')
            )
