from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

# Create your views here.

class TestConnectionViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]  # Allow any user for testing
    
    def list(self, request):
        return Response({
            "message": "Successfully connected to LocalMart API!",
            "status": "online"
        })
