"""
Management command для анонімізації старих замовлень
"""
from django.core.management.base import BaseCommand
from django.conf import settings
from mysite.encryption_utils import anonymize_old_orders


class Command(BaseCommand):
    help = 'Анонімізує персональні дані в старих замовленнях згідно з GDPR'

    def add_arguments(self, parser):
        parser.add_argument(
            '--days',
            type=int,
            default=settings.PERSONAL_DATA_RETENTION_DAYS,
            help=f'Вік замовлень для анонімізації (за замовчуванням: {settings.PERSONAL_DATA_RETENTION_DAYS} днів)'
        )
        
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Показати які замовлення будуть анонімізовані без фактичної зміни'
        )

    def handle(self, *args, **options):
        days = options['days']
        dry_run = options['dry_run']
        
        self.stdout.write("="*60)
        self.stdout.write(self.style.WARNING(f"🔒 АНОНІМІЗАЦІЯ СТАРИХ ЗАМОВЛЕНЬ"))
        self.stdout.write("="*60)
        
        if dry_run:
            self.stdout.write(self.style.WARNING("⚠️ DRY RUN режим - зміни НЕ будуть збережені"))
        
        self.stdout.write(f"📅 Анонімізуємо замовлення старше {days} днів")
        
        try:
            if not dry_run:
                count = anonymize_old_orders(days)
                
                if count > 0:
                    self.stdout.write(self.style.SUCCESS(f"✅ Успішно анонімізовано {count} замовлень"))
                else:
                    self.stdout.write(self.style.WARNING("ℹ️ Немає замовлень для анонімізації"))
            else:
                # Dry run - тільки показуємо
                from datetime import datetime, timedelta
                from json_manager import JSONManager
                
                json_manager = JSONManager()
                orders = json_manager.get_orders()
                cutoff_date = datetime.now() - timedelta(days=days)
                
                old_orders = []
                for order in orders:
                    try:
                        order_date = datetime.fromisoformat(order.get('created_at', ''))
                        if order_date < cutoff_date:
                            old_orders.append(order)
                    except:
                        pass
                
                if old_orders:
                    self.stdout.write(self.style.WARNING(f"📋 Знайдено {len(old_orders)} замовлень для анонімізації:"))
                    for order in old_orders:
                        self.stdout.write(f"   - {order.get('order_number')} ({order.get('created_at', 'N/A')[:10]})")
                else:
                    self.stdout.write(self.style.SUCCESS("ℹ️ Немає замовлень для анонімізації"))
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Помилка: {e}"))
            import traceback
            self.stdout.write(traceback.format_exc())
        
        self.stdout.write("="*60)

