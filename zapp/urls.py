from rest_framework.routers import DefaultRouter
from .views import BookViewSet, ReviewViewSet
from django.urls import path, include
from .views import ReviewViewSet
router = DefaultRouter()
router.register(r'books', BookViewSet)
router.register(r'books/(?P<book_pk>\d+)/reviews', ReviewViewSet, basename='book-reviews')
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    
    path('api/', include(router.urls)),
    path('', include(router.urls)),
    
]
