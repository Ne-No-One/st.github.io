from django.urls import path
from . import views

app_name = 'admin_panel'

urlpatterns = [
    # Головна сторінка адмін панелі
    path('', views.admin_dashboard, name='dashboard'),
    
    # Налаштування сайту
    path('site-settings/', views.site_settings, name='site_settings'),
    
    # Головний товар
    path('main-product/', views.main_product_settings, name='main_product_settings'),
    
    # Кольорові варіанти
    path('color-options/', views.color_options, name='color_options'),
    path('color-options/delete/<int:color_id>/', views.delete_color_option, name='delete_color_option'),
    
    # Варіанти кількості
    path('quantity-options/', views.quantity_options, name='quantity_options'),
    path('quantity-options/delete/<int:quantity_id>/', views.delete_quantity_option, name='delete_quantity_option'),
    
    # Додаткові товари
    path('additional-products/', views.additional_products, name='additional_products'),
    path('additional-products/edit/<int:product_id>/', views.edit_additional_product, name='edit_additional_product'),
    path('additional-products/delete/<int:product_id>/', views.delete_additional_product, name='delete_additional_product'),
    path('additional-products-settings/', views.additional_products_settings, name='additional_products_settings'),
    
    # Контактна інформація
    path('contact-info/', views.contact_info, name='contact_info'),
    
    # Послуги
    path('services/', views.services, name='services'),
    path('services/edit/<int:service_id>/', views.edit_service, name='edit_service'),
    path('services/delete/<int:service_id>/', views.delete_service, name='delete_service'),
]
