from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q
from .models import Product, ProductImage
from .serializers import ProductSerializer, ProductImageSerializer

# Create your views here.

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        queryset = Product.objects.all().order_by('-created_at')
        
        # Filter by location
        location = self.request.query_params.get('location', None)
        if location:
            queryset = queryset.filter(location__icontains=location)
        
        # Filter by price range
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Search by title or description
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(description__icontains=search)
            )
        
        return queryset

    @action(detail=True, methods=['post'])
    def upload_image(self, request, pk=None):
        product = self.get_object()
        
        # Ensure the user is the seller
        if product.seller != request.user:
            return Response(
                {'error': 'Not authorized to upload images for this product'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Handle image upload
        image = request.FILES.get('image')
        if not image:
            return Response(
                {'error': 'No image provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        is_primary = request.data.get('is_primary', False)
        if is_primary:
            # Set all other images as non-primary
            product.images.filter(is_primary=True).update(is_primary=False)
        
        ProductImage.objects.create(
            product=product,
            image=image,
            is_primary=is_primary
        )
        
        return Response({'message': 'Image uploaded successfully'})

    @action(detail=False, methods=['get'])
    def my_listings(self, request):
        queryset = self.get_queryset().filter(seller=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
