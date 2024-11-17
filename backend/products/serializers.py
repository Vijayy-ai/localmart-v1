from rest_framework import serializers
from .models import Product, ProductImage

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary']

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    seller_name = serializers.CharField(source='seller.username', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'title', 'description', 'price', 'condition',
            'quantity', 'expiry_date', 'is_urgent', 'location',
            'created_at', 'updated_at', 'seller', 'seller_name',
            'images'
        ]
        read_only_fields = ['seller', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['seller'] = self.context['request'].user
        return super().create(validated_data) 