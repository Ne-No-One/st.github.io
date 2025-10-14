"""
URL configuration for mysite project.
"""
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from main import views
from main.health_check import health_check
from main.payment_views import create_monobank_invoice, create_cart_invoice, monobank_webhook, payment_success, payment_failure, get_invoice_status, payment_status, cancel_invoice, payment_cancel, invalidate_invoice, payment_invalidate, finalize_hold, payment_finalize, get_merchant_details, merchant_details, process_card_payment, card_payment, get_invoice_receipt, download_receipt, receipt_page, process_sync_payment, sync_payment, create_iframe_invoice, iframe_payment
from main import test_payment_views

urlpatterns = [
    path('admin-panel/', include('admin_panel.urls')),  # Адмін-панель
    path('health/', health_check, name='health_check'),
    path('cart/', views.cart, name='cart'),
            path('payment/create-invoice/', create_monobank_invoice, name='create_invoice'),
            path('payment/create-cart-invoice/', create_cart_invoice, name='create_cart_invoice'),
    path('payment/webhook/', monobank_webhook, name='payment_webhook'),
    path('payment/success/', payment_success, name='payment_success'),
    path('payment/failure/', payment_failure, name='payment_failure'),
    path('payment/status/', payment_status, name='payment_status'),
    path('payment/status/<str:invoice_id>/', payment_status, name='payment_status_detail'),
    path('api/payment/status/<str:invoice_id>/', get_invoice_status, name='api_invoice_status'),
    path('payment/cancel/', payment_cancel, name='payment_cancel'),
    path('payment/cancel/<str:invoice_id>/', payment_cancel, name='payment_cancel_detail'),
    path('api/payment/cancel/', cancel_invoice, name='api_cancel_invoice'),
    path('payment/invalidate/', payment_invalidate, name='payment_invalidate'),
    path('payment/invalidate/<str:invoice_id>/', payment_invalidate, name='payment_invalidate_detail'),
    path('api/payment/invalidate/', invalidate_invoice, name='api_invalidate_invoice'),
    path('payment/finalize/', payment_finalize, name='payment_finalize'),
    path('payment/finalize/<str:invoice_id>/', payment_finalize, name='payment_finalize_detail'),
    path('api/payment/finalize/', finalize_hold, name='api_finalize_hold'),
    path('payment/merchant/', merchant_details, name='merchant_details'),
    path('api/payment/merchant/', get_merchant_details, name='api_merchant_details'),
    path('payment/card/', card_payment, name='card_payment'),
    path('api/payment/card/', process_card_payment, name='api_card_payment'),
    path('payment/receipt/', receipt_page, name='receipt_page'),
    path('payment/receipt/<str:invoice_id>/', receipt_page, name='receipt_detail'),
    path('api/payment/receipt/<str:invoice_id>/', get_invoice_receipt, name='api_invoice_receipt'),
    path('payment/receipt/<str:invoice_id>/download/', download_receipt, name='download_receipt'),
    path('payment/sync/', sync_payment, name='sync_payment'),
    path('api/payment/sync/', process_sync_payment, name='api_sync_payment'),
    path('payment/iframe/', iframe_payment, name='iframe_payment'),
    path('api/payment/iframe/', create_iframe_invoice, name='api_iframe_invoice'),
    path('api/orders/', views.save_order, name='save_order'),
    path('api/orders/list/', views.get_orders, name='get_orders'),
    path('api/progress-bar/', views.get_progress_bar_settings, name='api_progress_bar_settings'),
    path('api/delivery-cities/', views.get_delivery_cities, name='api_delivery_cities'),
    
    # Test Payment URLs
    path('test-payment-success/', test_payment_views.test_payment_success, name='test_payment_success'),
    path('test-payment-failure/', test_payment_views.test_payment_failure, name='test_payment_failure'),
    path('test-payment-cancel/', test_payment_views.test_payment_cancel, name='test_payment_cancel'),
    path('test-payment-receipt/', test_payment_views.test_payment_receipt, name='test_payment_receipt'),
    path('test-payment-demo/', test_payment_views.test_payment_demo, name='test_payment_demo'),
    path('test-create-invoice/', test_payment_views.test_create_invoice, name='test_create_invoice'),
    path('test-payment-status/', test_payment_views.test_payment_status, name='test_payment_status'),
    path('test-cancel-payment/', test_payment_views.test_cancel_payment, name='test_cancel_payment'),
    path('test-refund-payment/', test_payment_views.test_refund_payment, name='test_refund_payment'),
    path('test-simulation-settings/', test_payment_views.test_simulation_settings, name='test_simulation_settings'),
    
    # Тестова сторінка ефектів свічення
    path('glow-test/', views.glow_test, name='glow_test'),
    
    # Тестова симуляція оплати
    path('payment/test/simulation/', views.test_payment_simulation, name='test_payment_simulation'),
    path('payment/test/success/', views.test_payment_success, name='test_payment_sim_success'),
    path('payment/test/failure/', views.test_payment_failure, name='test_payment_sim_failure'),
    path('payment/test/3ds/', views.test_payment_3ds, name='test_payment_sim_3ds'),
    path('payment/test/card/', views.test_card_payment, name='test_card_payment'),
    path('payment/test/apple-pay/', views.test_apple_pay, name='test_apple_pay'),
    path('payment/test/google-pay/', views.test_google_pay, name='test_google_pay'),
    
    path('', views.home, name='home'),
]

# Serve media and static files
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
