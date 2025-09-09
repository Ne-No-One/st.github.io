from django.contrib import admin
from .models import Category, Product, Cart, CartItem, Order, OrderItem

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'category', 'stock', 'created_at']
    list_filter = ['category', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'email', 'total', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['email', 'phone']

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product', 'quantity', 'price']

admin.site.register(Cart)
admin.site.register(CartItem)
