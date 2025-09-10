from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class SiteSettings(models.Model):
    """Основні налаштування сайту"""
    site_title = models.CharField(max_length=200, default="Мій Сайт")
    site_description = models.TextField(default="Красивий сайт з чорним фоном, плаваючими білими шарами та сучасним дизайном")
    hero_section_title = models.CharField(max_length=200, default="Преміум товар")
    hero_section_description = models.TextField(blank=True)
    
    # Налаштування кольорів
    primary_color = models.CharField(max_length=7, default="#ff8c42", help_text="Основний колір (hex)")
    secondary_color = models.CharField(max_length=7, default="#4ecdc4", help_text="Додатковий колір (hex)")
    
    # Налаштування секцій
    hero_section_width_pc = models.IntegerField(default=80, validators=[MinValueValidator(50), MaxValueValidator(100)])
    additional_products_width_pc = models.IntegerField(default=80, validators=[MinValueValidator(50), MaxValueValidator(100)])
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Налаштування сайту"
        verbose_name_plural = "Налаштування сайту"
    
    def __str__(self):
        return f"Налаштування сайту ({self.updated_at.strftime('%d.%m.%Y %H:%M')})"

class ColorOption(models.Model):
    """Кольорові варіанти для товару"""
    name = models.CharField(max_length=50, help_text="Назва кольору (наприклад: Помаранчевий)")
    hex_code = models.CharField(max_length=7, help_text="Hex код кольору (наприклад: #ff8c42)")
    image = models.ImageField(upload_to='color_images/', help_text="Зображення для цього кольору")
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0, help_text="Порядок відображення")
    
    class Meta:
        verbose_name = "Кольоровий варіант"
        verbose_name_plural = "Кольорові варіанти"
        ordering = ['order']
    
    def __str__(self):
        return f"{self.name} ({self.hex_code})"

class QuantityOption(models.Model):
    """Варіанти кількості"""
    quantity = models.PositiveIntegerField(help_text="Кількість (наприклад: 21)")
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0, help_text="Порядок відображення")
    
    class Meta:
        verbose_name = "Варіант кількості"
        verbose_name_plural = "Варіанти кількості"
        ordering = ['order']
    
    def __str__(self):
        return f"{self.quantity} квітів"

class MainProduct(models.Model):
    """Головний товар"""
    title = models.CharField(max_length=200, default="Преміум товар")
    description = models.TextField(blank=True)
    base_price = models.DecimalField(max_digits=10, decimal_places=2, default=2800.00)
    currency = models.CharField(max_length=10, default="грн")
    
    # Кнопки
    add_to_cart_text = models.CharField(max_length=50, default="В кошик")
    remove_from_cart_text = models.CharField(max_length=50, default="Прибрати")
    
    # Налаштування відображення
    show_premium_label = models.BooleanField(default=True)
    premium_label_text = models.CharField(max_length=50, default="Преміум товар")
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Головний товар"
        verbose_name_plural = "Головний товар"
    
    def __str__(self):
        return self.title

class AdditionalProduct(models.Model):
    """Додаткові товари"""
    title = models.CharField(max_length=200, help_text="Назва товару")
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Ціна товару")
    currency = models.CharField(max_length=10, default="грн")
    image = models.ImageField(upload_to='additional_products/', help_text="Зображення товару")
    
    # Кнопки
    add_to_cart_text = models.CharField(max_length=50, default="Додати в кошик")
    remove_from_cart_text = models.CharField(max_length=50, default="Відняти з кошика")
    
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0, help_text="Порядок відображення")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Додатковий товар"
        verbose_name_plural = "Додаткові товари"
        ordering = ['order']
    
    def __str__(self):
        return self.title

class AdditionalProductsSettings(models.Model):
    """Налаштування секції додаткових товарів"""
    section_title = models.CharField(max_length=200, default="Додаткові товари")
    add_all_text = models.CharField(max_length=50, default="Додати всі")
    remove_all_text = models.CharField(max_length=50, default="Прибрати всі")
    
    # Налаштування відображення
    show_section = models.BooleanField(default=True)
    max_products_per_row = models.PositiveIntegerField(default=3, validators=[MinValueValidator(1), MaxValueValidator(6)])
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Налаштування додаткових товарів"
        verbose_name_plural = "Налаштування додаткових товарів"
    
    def __str__(self):
        return f"Налаштування секції '{self.section_title}'"

class ContactInfo(models.Model):
    """Контактна інформація"""
    phone = models.CharField(max_length=20, help_text="Номер телефону")
    email = models.EmailField(help_text="Email адреса")
    address = models.TextField(help_text="Адреса")
    working_hours = models.CharField(max_length=100, help_text="Графік роботи")
    
    # Соціальні мережі
    instagram = models.URLField(blank=True, help_text="Instagram URL")
    facebook = models.URLField(blank=True, help_text="Facebook URL")
    telegram = models.URLField(blank=True, help_text="Telegram URL")
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Контактна інформація"
        verbose_name_plural = "Контактна інформація"
    
    def __str__(self):
        return f"Контакти ({self.phone})"

class Service(models.Model):
    """Послуги"""
    title = models.CharField(max_length=200, help_text="Назва послуги")
    description = models.TextField(help_text="Опис послуги")
    icon = models.CharField(max_length=50, default="🌟", help_text="Іконка (emoji або CSS клас)")
    
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0, help_text="Порядок відображення")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Послуга"
        verbose_name_plural = "Послуги"
        ordering = ['order']
    
    def __str__(self):
        return self.title
