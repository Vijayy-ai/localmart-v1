from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from django.utils.text import slugify
from django.core.exceptions import ValidationError

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    icon = models.CharField(
        max_length=50,
        help_text="Ionicons name for the category",
        default='folder-outline'
    )
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='children')
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'categories'
        ordering = ['order', 'name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    @property
    def full_name(self):
        if self.parent:
            return f"{self.parent.name} > {self.name}"
        return self.name

class Product(models.Model):
    CONDITION_CHOICES = [
        ('new', 'New'),
        ('like_new', 'Like New'),
        ('good', 'Good'),
        ('fair', 'Fair'),
    ]
    
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    condition = models.CharField(max_length=10, choices=CONDITION_CHOICES)
    quantity = models.IntegerField(default=1)
    expiry_date = models.DateTimeField(null=True, blank=True)
    is_urgent = models.BooleanField(default=False)
    is_negotiable = models.BooleanField(default=True)
    location = models.CharField(max_length=255)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    views_count = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'products'
        ordering = ['-created_at']

    def __str__(self):
        return self.title

def validate_image(image):
    # Check file size
    if image.size > 5 * 1024 * 1024:  # 5MB
        raise ValidationError('Image size cannot exceed 5MB')
    
    # Check file type
    allowed_types = ['image/jpeg', 'image/png', 'image/jpg']
    if image.content_type not in allowed_types:
        raise ValidationError('Only JPEG and PNG images are allowed')

class ProductImage(models.Model):
    product = models.ForeignKey(
        Product, 
        related_name='images', 
        on_delete=models.CASCADE
    )
    image = models.ImageField(
        upload_to='product_images/',
        validators=[validate_image]
    )
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-is_primary', '-created_at']

class Review(models.Model):
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.IntegerField(validators=[MinValueValidator(1)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'reviews'
        ordering = ['-created_at']
        unique_together = ['product', 'reviewer']

class Wishlist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'product']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username}'s wishlist item: {self.product.title}"

class ProductView(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='views')
    viewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    ip_address = models.GenericIPAddressField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'product_views'
        ordering = ['-created_at']

class ProductAnalytics(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='analytics')
    total_views = models.IntegerField(default=0)
    unique_views = models.IntegerField(default=0)
    wishlist_adds = models.IntegerField(default=0)
    message_count = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'product_analytics'
