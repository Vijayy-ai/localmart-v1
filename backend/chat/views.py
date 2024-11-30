from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q

# We'll create these models and serializers later
from .models import ChatRoom, Message
from .serializers import ChatRoomSerializer, MessageSerializer
from products.models import Product

class ChatViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ChatRoomSerializer
    
    def get_queryset(self):
        return ChatRoom.objects.filter(
            participants=self.request.user
        ).order_by('-updated_at')
    
    @action(detail=False, methods=['POST'])
    def create_or_get_room(self, request):
        """Create a new chat room or get existing one"""
        product_id = request.data.get('product_id')
        seller_id = request.data.get('seller_id')
        
        if not product_id or not seller_id:
            return Response(
                {'error': 'Product ID and seller ID are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            product = Product.objects.get(id=product_id)
            
            # Check if chat room already exists
            chat_room = ChatRoom.objects.filter(
                Q(product=product),
                Q(participants=request.user) & Q(participants=seller_id)
            ).first()
            
            if not chat_room:
                chat_room = ChatRoom.objects.create(product=product)
                chat_room.participants.add(request.user, seller_id)
            
            serializer = self.get_serializer(chat_room)
            return Response(serializer.data)
            
        except Product.DoesNotExist:
            return Response(
                {'error': 'Product not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['GET'])
    def messages(self, request, pk=None):
        """Get messages for a chat room"""
        chat_room = self.get_object()
        messages = Message.objects.filter(room=chat_room)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['POST'])
    def mark_read(self, request, pk=None):
        """Mark all messages in the room as read"""
        chat_room = self.get_object()
        Message.objects.filter(
            room=chat_room,
            recipient=request.user,
            is_read=False
        ).update(is_read=True)
        return Response({'status': 'messages marked as read'})

    @action(detail=True, methods=['GET'])
    def unread_count(self, request, pk=None):
        """Get number of unread messages in the room"""
        chat_room = self.get_object()
        count = Message.objects.filter(
            room=chat_room,
            recipient=request.user,
            is_read=False
        ).count()
        return Response({'unread_count': count})
