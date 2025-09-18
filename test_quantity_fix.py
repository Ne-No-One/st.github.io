#!/usr/bin/env python3
"""
Тест для перевірки виправлення кнопки додавання кількості
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from json_manager import JSONManager

def test_quantity_addition():
    """Тестуємо додавання кількості"""
    print("🧪 Тестування додавання кількості...")
    
    json_manager = JSONManager()
    
    # Отримуємо поточні кількості
    quantities_before = json_manager.get_quantity_options()
    print(f"📊 Кількості до тесту: {len(quantities_before)}")
    
    # Додаємо нову кількість
    result = json_manager.add_quantity_option_with_price(25, 0.75, 1)
    print(f"✅ Результат додавання: {result}")
    
    # Перевіряємо чи додалося
    quantities_after = json_manager.get_quantity_options()
    print(f"📊 Кількості після тесту: {len(quantities_after)}")
    
    if len(quantities_after) > len(quantities_before):
        print("✅ Тест пройшов успішно!")
        return True
    else:
        print("❌ Тест не пройшов!")
        return False

def test_quantity_image_addition():
    """Тестуємо додавання фото для кількості кольору"""
    print("\n🧪 Тестування додавання фото для кількості кольору...")
    
    json_manager = JSONManager()
    
    # Отримуємо кольори
    colors = json_manager.get_color_options()
    if not colors:
        print("❌ Немає кольорів для тесту!")
        return False
    
    color_id = colors[0]['id']
    print(f"🎨 Тестуємо з кольором ID: {color_id}")
    
    # Додаємо фото для кількості
    result = json_manager.add_quantity_image_for_color(color_id, 25, "https://example.com/test.jpg")
    print(f"✅ Результат додавання фото: {result}")
    
    # Перевіряємо чи додалося
    color = json_manager.get_color_option(color_id)
    if color and 'quantity_images' in color and '25' in color['quantity_images']:
        print("✅ Фото для кількості додано успішно!")
        return True
    else:
        print("❌ Фото для кількості не додано!")
        return False

if __name__ == "__main__":
    print("🚀 Запуск тестів...")
    
    test1 = test_quantity_addition()
    test2 = test_quantity_image_addition()
    
    if test1 and test2:
        print("\n🎉 Всі тести пройшли успішно!")
    else:
        print("\n❌ Деякі тести не пройшли!")
        sys.exit(1)
