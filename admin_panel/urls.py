from django.urls import path
from . import views

app_name = 'admin_panel'

urlpatterns = [
    path('', views.admin_dashboard, name='dashboard'),
    path('site-settings/', views.site_settings, name='site_settings'),
    path('main-product/', views.main_product_settings, name='main_product_settings'),
    path('main-product/edit-color/<int:color_id>/', views.edit_color_variant, name='edit_color_variant'),
    path('main-product/delete-color/<int:color_id>/', views.delete_color_from_main, name='delete_color_from_main'),
    path('main-product/edit-quantity/<int:quantity_id>/', views.edit_quantity_variant, name='edit_quantity_variant'),
    path('color-options/', views.color_options, name='color_options'),
    path('color-options/delete/<int:color_id>/', views.delete_color_option, name='delete_color_option'),
    path('quantity-options/', views.quantity_options, name='quantity_options'),
    path('quantity-options/delete/<int:quantity_id>/', views.delete_quantity_option, name='delete_quantity_option'),
    path('main-product/delete-quantity/<int:quantity_id>/', views.delete_quantity_option, name='delete_quantity_option'),
    path('additional-products/', views.additional_products, name='additional_products'),
    path('additional-products/edit/<int:product_id>/', views.edit_additional_product, name='edit_additional_product'),
    path('additional-products/delete/<int:product_id>/', views.delete_additional_product, name='delete_additional_product'),
    path('services/', views.services, name='services'),
    path('services/delete/<int:service_id>/', views.delete_service, name='delete_service'),
    path('contact-info/', views.contact_info, name='contact_info'),
    path('about-section/', views.about_section, name='about_section'),
    
    # Orders management
    path('orders/', views.orders_list, name='orders_list'),
    path('orders/<int:order_id>/', views.order_detail, name='order_detail'),
    path('orders/<int:order_id>/status/', views.update_order_status, name='update_order_status'),
    
    # Customers management
    path('customers/', views.customers_list, name='customers_list'),
    path('customers/<int:customer_id>/', views.customer_detail, name='customer_detail'),
    path('customers/add/', views.add_customer, name='add_customer'),
    path('customers/<int:customer_id>/edit/', views.edit_customer, name='edit_customer'),
    
    # Inventory management
    path('inventory/', views.inventory_list, name='inventory_list'),
    path('inventory/<int:item_id>/update-stock/', views.update_inventory_stock, name='update_inventory_stock'),
    
    # Financial reports
    path('reports/', views.financial_reports, name='financial_reports'),
    path('reports/daily/', views.daily_sales_report, name='daily_sales_report'),
]