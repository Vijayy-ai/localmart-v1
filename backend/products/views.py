from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q, Sum, Count
from django.utils import timezone
from datetime import timedelta
from .models import Product, ProductImage, Category, Wishlist, ProductView, ProductAnalytics
from chat.models import ChatRoom
from .serializers import ProductSerializer, ProductImageSerializer, CategorySerializer, WishlistSerializer
from rest_framework.parsers import MultiPartParser, FormParser
import logging

logger = logging.getLogger(__name__)

# Create your views here.

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    parser_classes = (MultiPartParser, FormParser)
    
    def get_permissions(self):
        """
        List and retrieve can be accessed without authentication
        Other actions require authentication
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """Get products with filters"""
        queryset = Product.objects.filter(is_active=True)
        
        # Get all products for list/retrieve actions
        if self.action in ['list', 'retrieve']:
            # Apply basic filters
            category = self.request.query_params.get('category', None)
            if category:
                queryset = queryset.filter(category_id=category)
            
            search = self.request.query_params.get('search', None)
            if search:
                queryset = queryset.filter(
                    Q(title__icontains=search) |
                    Q(description__icontains=search)
                )
            
            sort_by = self.request.query_params.get('sort_by', '-created_at')
            queryset = queryset.order_by(sort_by)
            
            return queryset[:50]  # Limit results for unauthenticated users
        
        # For authenticated users, apply all filters
        if self.request.user.is_authenticated:
            filters = {}
            
            for param in ['category', 'condition', 'location']:
                value = self.request.query_params.get(param)
                if value:
                    filters[f"{param}__iexact" if param == 'location' else param] = value
            
            for param in ['min_price', 'max_price']:
                value = self.request.query_params.get(param)
                if value:
                    filters[f"price__{'gte' if param == 'min_price' else 'lte'}"] = value
            
            if filters:
                queryset = queryset.filter(**filters)
            
            is_urgent = self.request.query_params.get('is_urgent')
            if is_urgent:
                queryset = queryset.filter(is_urgent=is_urgent.lower() == 'true')
            
            sort_by = self.request.query_params.get('sort_by', '-created_at')
            return queryset.order_by(sort_by)
        
        return queryset.none()

    def create(self, request, *args, **kwargs):
        try:
            if not request.user.is_authenticated:
                return Response(
                    {'error': 'Authentication required'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            # Create product instance
            product_data = {
                'title': request.data.get('title'),
                'description': request.data.get('description'),
                'price': request.data.get('price'),
                'condition': request.data.get('condition'),
                'quantity': request.data.get('quantity', 1),
                'location': request.data.get('location'),
                'is_urgent': request.data.get('is_urgent', '').lower() == 'true',
                'seller': request.user.id
            }
            
            serializer = self.get_serializer(data=product_data)
            if not serializer.is_valid():
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            product = serializer.save()

            # Handle images
            images = request.FILES.getlist('images')
            if images:
                for index, image in enumerate(images):
                    ProductImage.objects.create(
                        product=product,
                        image=image,
                        is_primary=(index == 0)
                    )

            return Response(
                ProductSerializer(product).data,
                status=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            logger.error(f"Error creating product: {str(e)}", exc_info=True)
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['GET'])
    def my_listings(self, request):
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        queryset = self.get_queryset().filter(seller=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['GET'])
    def analytics(self, request, pk=None):
        product = self.get_object()
        if product.seller != request.user:
            return Response(
                {'error': 'Not authorized to view analytics'},
                status=status.HTTP_403_FORBIDDEN
            )
            
        analytics = ProductAnalytics.objects.get_or_create(product=product)[0]
        return Response({
            'views': analytics.total_views,
            'unique_views': analytics.unique_views,
            'wishlist_adds': analytics.wishlist_adds,
            'message_count': analytics.message_count
        })

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):
        category = self.get_object()
        products = Product.objects.filter(
            Q(category=category) | Q(category__parent=category),
            is_active=True
        )
        
        # Apply filters
        if 'min_price' in request.query_params:
            products = products.filter(price__gte=request.query_params['min_price'])
        if 'max_price' in request.query_params:
            products = products.filter(price__lte=request.query_params['max_price'])
        if 'location' in request.query_params:
            products = products.filter(location__icontains=request.query_params['location'])
        if 'search' in request.query_params:
            search_query = request.query_params['search']
            products = products.filter(
                Q(title__icontains=search_query) |
                Q(description__icontains=search_query)
            )
            
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def toggle(self, request, pk=None):
        try:
            product = Product.objects.get(pk=pk)
            wishlist_item = Wishlist.objects.filter(
                user=request.user,
                product=product
            ).first()

            if wishlist_item:
                wishlist_item.delete()
                return Response({'status': 'removed'})
            else:
                Wishlist.objects.create(user=request.user, product=product)
                return Response({'status': 'added'})

        except Product.DoesNotExist:
            return Response(
                {'error': 'Product not found'},
                status=status.HTTP_404_NOT_FOUND
            )
