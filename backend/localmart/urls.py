from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users.views import UserViewSet
from products.views import ProductViewSet, CategoryViewSet, WishlistViewSet
from chat.views import ChatViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'chat/rooms', ChatViewSet, basename='chat-room')
router.register(r'wishlist', WishlistViewSet, basename='wishlist')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include([
        path('', include(router.urls)),
        # Auth endpoints
        path('auth/', include([
            path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
            path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
            path('login/', UserViewSet.as_view({'post': 'login'}), name='user-login'),
            path('register/', UserViewSet.as_view({'post': 'register'}), name='user-register'),
        ])),
        # Product endpoints
        path('products/', include([
            path('my/', ProductViewSet.as_view({'get': 'my_listings'}), name='my-listings'),
            path('<int:pk>/wishlist/', WishlistViewSet.as_view({
                'get': 'list',
                'post': 'toggle'
            }), name='product-wishlist'),
            path('<int:pk>/analytics/', ProductViewSet.as_view({'get': 'analytics'}), name='product-analytics'),
        ])),
        # Chat endpoints
        path('chat/rooms/create/', ChatViewSet.as_view({'post': 'create_or_get_room'}), name='create-get-room'),
    ])),
]
