from rest_framework import serializers
from .models import ChatRoom, Message
from users.serializers import UserDetailSerializer
from products.serializers import ProductSerializer

class MessageSerializer(serializers.ModelSerializer):
    sender = UserDetailSerializer(read_only=True)
    is_own_message = serializers.SerializerMethodField()
    
    class Meta:
        model = Message
        fields = ['id', 'sender', 'content', 'is_read', 'created_at', 'is_own_message']

    def get_is_own_message(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            return obj.sender == request.user
        return False

class ChatRoomSerializer(serializers.ModelSerializer):
    participants = UserDetailSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()
    product = ProductSerializer(read_only=True)
    unread_count = serializers.SerializerMethodField()
    other_participant = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = [
            'id', 'participants', 'product', 'last_message', 
            'unread_count', 'created_at', 'updated_at', 'other_participant'
        ]

    def get_last_message(self, obj):
        message = obj.messages.first()
        if message:
            return MessageSerializer(message, context=self.context).data
        return None

    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            return obj.messages.filter(
                is_read=False,
                recipient=request.user
            ).count()
        return 0

    def get_other_participant(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            other_user = obj.participants.exclude(id=request.user.id).first()
            if other_user:
                return UserDetailSerializer(other_user).data
        return None 