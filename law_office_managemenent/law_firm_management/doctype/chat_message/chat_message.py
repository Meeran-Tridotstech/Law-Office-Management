import frappe
from frappe.model.document import Document

class ChatMessage(Document):
    pass

import frappe

@frappe.whitelist()
def send_message(sender, receiver, message):
    # Save message
    new_message = frappe.get_doc({
        'doctype': 'Chat Message',
        'sender': sender,
        'receiver': receiver,
        'message': message,
        'status': 'Unread',
        'timestamp': frappe.utils.now()
    })
    new_message.insert(ignore_permissions=True)

    # Push realtime event
    frappe.publish_realtime(
        event='new_chat_message',
        message={
            'sender': sender,
            'receiver': receiver,
            'message': message
        },
        user=receiver  # only send to receiver
    )

    return "Message Sent"


@frappe.whitelist(allow_guest=True)
def get_messages(user1, user2):
    messages = frappe.get_all('Chat Message', filters={
        'status': 'Unread', 
        'receiver': user1, 
        'sender': user2
    }, fields=['sender', 'message', 'timestamp'])
    
    return messages
