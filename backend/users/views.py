from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, UserDetailSerializer
from products.serializers import ProductSerializer
from .models import User
from products.models import Product
import logging

logger = logging.getLogger(__name__)

# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def register(self, request):
        try:
            # Extract data from request
            email = request.data.get('email')
            password = request.data.get('password')
            first_name = request.data.get('first_name', '')
            last_name = request.data.get('last_name', '')
            phone_number = request.data.get('phone_number', '')
            location = request.data.get('location', '')

            # Validate required fields
            if not email or not password:
                return Response(
                    {'error': 'Email and password are required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create user
            user = User.objects.create_user(
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
                phone_number=phone_number,
                location=location
            )

            # Generate tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            return Response({
                'user': UserSerializer(user).data,
                'access_token': access_token,
                'refresh_token': str(refresh)
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['post'])
    def login(self, request):
        try:
            email = request.data.get('email')
            password = request.data.get('password')
            
            if not email or not password:
                return Response({
                    'error': 'Please provide both email and password'
                }, status=status.HTTP_400_BAD_REQUEST)

            user = authenticate(email=email, password=password)
            if not user:
                return Response({
                    'error': 'Invalid credentials'
                }, status=status.HTTP_401_UNAUTHORIZED)

            refresh = RefreshToken.for_user(user)
            return Response({
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
                'user': UserDetailSerializer(user).data
            })

        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['GET'])
    def products(self, request, pk=None):
        """Get seller's products"""
        user = self.get_object()
        products = Product.objects.filter(seller=user, is_active=True)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['PATCH'])
    def profile(self, request):
        """Update user profile"""
        user = request.user
        serializer = UserDetailSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['GET'])
    def verify_token(self, request):
        """Verify if the token is valid"""
        return Response({
            'status': 'valid',
            'user': UserSerializer(request.user).data
        })
