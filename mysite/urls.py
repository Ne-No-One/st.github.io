"""
URL configuration for mysite project.
"""
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from main import views
from main.health_check import health_check

urlpatterns = [
    path('admin-panel/', include('admin_panel.urls')),
    path('health/', health_check, name='health_check'),
    path('', views.home, name='home'),
]

# Serve media and static files
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
