from django.core.management.base import BaseCommand
from products.models import Category

class Command(BaseCommand):
    help = 'Creates initial categories for products'

    def handle(self, *args, **kwargs):
        categories = [
            {'name': 'Electronics', 'subcategories': ['Phones', 'Laptops', 'Accessories']},
            {'name': 'Fashion', 'subcategories': ['Men', 'Women', 'Kids']},
            {'name': 'Home', 'subcategories': ['Furniture', 'Decor', 'Kitchen']},
            {'name': 'Books', 'subcategories': ['Fiction', 'Non-Fiction', 'Academic']},
            {'name': 'Sports', 'subcategories': ['Equipment', 'Clothing', 'Accessories']},
        ]

        for category_data in categories:
            parent = Category.objects.create(name=category_data['name'])
            for subcategory in category_data['subcategories']:
                Category.objects.create(name=subcategory, parent=parent)

        self.stdout.write(self.style.SUCCESS('Successfully created categories')) 