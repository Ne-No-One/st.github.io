from django.urls import path
from . import views
from . import payment_views
from . import auth_views

app_name = 'admin_panel'

urlpatterns = [
    # Authentication
    path('login/', auth_views.admin_login, name='login'),
    path('logout/', auth_views.admin_logout, name='logout'),
    path('profile/', auth_views.admin_profile, name='admin_profile'),
    path('users/', auth_views.admin_users_list, name='admin_users_list'),
    path('api/users/create/', auth_views.create_admin_user, name='api_create_admin'),
    path('api/users/<int:admin_id>/toggle/', auth_views.toggle_admin_status, name='api_toggle_admin'),
    
    # Dashboard
    path('', views.admin_dashboard, name='dashboard'),
    path('site-settings/', views.site_settings, name='site_settings'),
    path('main-product/', views.main_product_settings, name='main_product_settings'),
    path('main-product/create-color-with-quantities/', views.create_color_with_quantities, name='create_color_with_quantities'),
    path('main-product/edit-color/<int:color_id>/', views.edit_color_variant, name='edit_color_variant'),
    path('main-product/delete-color/<int:color_id>/', views.delete_color_from_main, name='delete_color_from_main'),
    path('main-product/color/<int:color_id>/quantity-images/', views.manage_color_quantity_images, name='manage_color_quantity_images'),
    path('main-product/edit-quantity/<int:quantity_id>/', views.edit_quantity_variant, name='edit_quantity_variant'),
    path('color-options/', views.color_options, name='color_options'),
    path('color-options/delete/<int:color_id>/', views.delete_color_option, name='delete_color_option'),
    path('quantity-options/', views.quantity_options, name='quantity_options'),
    path('quantity-options/delete/<int:quantity_id>/', views.delete_quantity_option, name='delete_quantity_option'),
    path('additional-products/', views.additional_products, name='additional_products'),
    path('additional-products/edit/<int:product_id>/', views.edit_additional_product, name='edit_additional_product'),
    path('additional-products/delete/<int:product_id>/', views.delete_additional_product, name='delete_additional_product'),
    path('services/', views.services, name='services'),
    path('services/delete/<int:service_id>/', views.delete_service, name='delete_service'),
    path('contact-info/', views.contact_info, name='contact_info'),
    path('about-section/', views.about_section, name='about_section'),
    
    # Orders management
    path('orders/', views.orders_list, name='orders_list'),
    path('orders/<str:order_id>/', views.order_detail, name='order_detail'),
    path('orders/<str:order_id>/status/', views.update_order_status, name='update_order_status'),
    
    # Customers management
    path('customers/', views.customers_list, name='customers_list'),
    path('customers/<int:customer_id>/', views.customer_detail, name='customer_detail'),
    path('customers/add/', views.add_customer, name='add_customer'),
    path('customers/<int:customer_id>/edit/', views.edit_customer, name='edit_customer'),
    
    # Financial reports
    path('reports/', views.financial_reports, name='financial_reports'),
    path('reports/daily/', views.daily_sales_report, name='daily_sales_report'),
    
    # Payment management
    path('payments/', payment_views.payment_management, name='payment_management'),
    path('payments/<str:order_id>/', payment_views.payment_detail, name='payment_detail'),
    path('payments/<str:order_id>/cancel/', payment_views.cancel_payment, name='cancel_payment'),
    path('payments/<str:order_id>/refund/', payment_views.refund_payment, name='refund_payment'),
    path('payments/<str:order_id>/status/', payment_views.check_payment_status, name='check_payment_status'),
    path('payments/<str:order_id>/receipt/', payment_views.download_payment_receipt, name='download_payment_receipt'),
    path('payments/reports/', payment_views.payment_reports, name='payment_reports'),
    
    # Marketing
    path('marketing/', views.marketing_settings, name='marketing_settings'),
    
    # Marketing AJAX API
    path('api/marketing/progress-bar/toggle/', views.toggle_progress_bar, name='api_toggle_progress_bar'),
    path('api/marketing/milestones/add/', views.add_milestone_ajax, name='api_add_milestone'),
    path('api/marketing/milestones/<int:milestone_id>/update/', views.update_milestone_ajax, name='api_update_milestone'),
    path('api/marketing/milestones/<int:milestone_id>/delete/', views.delete_milestone_ajax, name='api_delete_milestone'),
    path('api/marketing/milestones/<int:milestone_id>/get/', views.get_milestone_ajax, name='api_get_milestone'),
    
    # Media Library API
    path('api/media-files/', views.get_media_files, name='api_media_files'),
    
    # Color order update
    path('api/colors/update-order/', views.update_color_order, name='update_color_order'),
    path('api/colors/update-status/', views.update_color_status, name='update_color_status'),
]