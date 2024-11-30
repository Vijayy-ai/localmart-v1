from rest_framework import serializers
from .models import Product, ProductImage, Category, Wishlist

class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    icon = serializers.CharField(required=False, default='folder-outline')

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon', 'parent', 'order', 'is_active', 'children']

    def get_children(self, obj):
        if hasattr(obj, 'children'):
            return CategorySerializer(obj.children.filter(is_active=True), many=True).data
        return []

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary']

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    seller_name = serializers.CharField(source='seller.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'title', 'description', 'price', 'condition',
            'quantity', 'expiry_date', 'is_urgent', 'location',
            'created_at', 'updated_at', 'seller', 'seller_name',
            'category', 'category_name', 'images', 'is_negotiable',
            'latitude', 'longitude', 'views_count', 'is_active'
        ]
        read_only_fields = ['seller', 'created_at', 'updated_at', 'views_count']

    def create(self, validated_data):
        validated_data['seller'] = self.context['request'].user
        return super().create(validated_data) 

class WishlistSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = Wishlist
        fields = ['id', 'product', 'created_at']