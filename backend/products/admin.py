from django.contrib import admin
from .models import Category, Product, ProductImage, Review

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent')
    search_fields = ('name',)

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'seller', 'price', 'condition', 'is_active', 'created_at')
    list_filter = ('condition', 'is_active', 'is_urgent')
    search_fields = ('title', 'description')
    inlines = [ProductImageInline]

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'reviewer', 'rating', 'created_at')
    list_filter = ('rating',)
