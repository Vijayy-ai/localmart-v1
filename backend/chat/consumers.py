import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChatRoom, Message
from django.contrib.auth import get_user_model
from datetime import datetime

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'
        self.user = self.scope['user']

        # Verify user is a participant
        if not await self.is_room_participant():
            await self.close()
            return

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        # Send user online status
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_status',
                'user_id': self.user.id,
                'status': 'online'
            }
        )

    async def disconnect(self, close_code):
        # Send user offline status
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_status',
                    'user_id': self.user.id,
                    'status': 'offline'
                }
            )
            
            # Leave room group
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type', 'message')

        if message_type == 'message':
            message = data['message']
            # Save message and get recipient
            saved_message, recipient = await self.save_message(message)
            
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': {
                        'id': saved_message.id,
                        'content': message,
                        'sender_id': self.user.id,
                        'sender_name': self.user.username,
                        'recipient_id': recipient.id,
                        'timestamp': saved_message.created_at.isoformat(),
                        'is_read': False
                    }
                }
            )
        elif message_type == 'typing':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'typing_status',
                    'user_id': self.user.id,
                    'is_typing': data['is_typing']
                }
            )
        elif message_type == 'read':
            await self.mark_messages_read()
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'messages_read',
                    'user_id': self.user.id
                }
            )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'message',
            'message': event['message']
        }))

    async def typing_status(self, event):
        await self.send(text_data=json.dumps({
            'type': 'typing',
            'user_id': event['user_id'],
            'is_typing': event['is_typing']
        }))

    async def user_status(self, event):
        await self.send(text_data=json.dumps({
            'type': 'status',
            'user_id': event['user_id'],
            'status': event['status']
        }))

    async def messages_read(self, event):
        await self.send(text_data=json.dumps({
            'type': 'read_receipt',
            'user_id': event['user_id']
        }))

    @database_sync_to_async
    def is_room_participant(self):
        try:
            room = ChatRoom.objects.get(id=self.room_id)
            return room.participants.filter(id=self.user.id).exists()
        except ChatRoom.DoesNotExist:
            return False

    @database_sync_to_async
    def save_message(self, content):
        room = ChatRoom.objects.get(id=self.room_id)
        recipient = room.participants.exclude(id=self.user.id).first()
        message = Message.objects.create(
            room=room,
            sender=self.user,
            recipient=recipient,
            content=content
        )
        room.save()  # Update the room's updated_at timestamp
        return message, recipient

    @database_sync_to_async
    def mark_messages_read(self):
        Message.objects.filter(
            room_id=self.room_id,
            recipient=self.user,
            is_read=False
        ).update(is_read=True) 