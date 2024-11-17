from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

# We'll create these models and serializers later
from .models import ChatRoom, Message
from .serializers import ChatRoomSerializer, MessageSerializer

class ChatViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ChatRoomSerializer
    
    def get_queryset(self):
        """Return only chat rooms that the current user is part of"""
        return ChatRoom.objects.filter(participants=self.request.user)
    
    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        """Send a message in the chat room"""
        chat_room = self.get_object()
        if request.user not in chat_room.participants.all():
            return Response({'error': 'Not a participant'}, status=403)
            
        message = Message.objects.create(
            room=chat_room,
            sender=request.user,
            content=request.data.get('content')
        )
        return Response(MessageSerializer(message).data)
