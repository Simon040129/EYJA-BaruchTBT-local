import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios';
import { useUser } from '../context/UserContext';

interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    created_at: string;
}

interface Conversation {
    other_user_id: number;
    other_user_name: string;
    last_message: string;
    is_read: boolean;
    sender_id: number; // who sent the last message
}

function ChatPage() {
    const { user } = useUser();
    const [searchParams] = useSearchParams();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeChat, setActiveChat] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial setup: check if we need to start a chat with someone specific
    useEffect(() => {
        const sellerIdStr = searchParams.get('sellerId');
        if (sellerIdStr && user) {
            const sellerId = parseInt(sellerIdStr);
            if (sellerId === user.id) return; // Can't chat with self

            setActiveChat(sellerId);

            // Check if this conversation already exists in the list
            const exists = conversations.some(c => c.other_user_id === sellerId);
            if (!exists) {
                // If not, add a temporary placeholder so the UI shows it selected
                // We might need to fetch the user's name to show it nicely
                setConversations(prev => [
                    {
                        other_user_id: sellerId,
                        other_user_name: 'Seller #' + sellerId, // Placeholder until we have a way to fetch name or send first msg
                        last_message: 'Start a conversation...',
                        is_read: true,
                        sender_id: user.id
                    },
                    ...prev
                ]);
            }
        }
    }, [searchParams, user, conversations.length]); // Depend on conversations.length to avoid infinite loops but check after load

    // Fetch conversations list
    useEffect(() => {
        if (!user) return;

        const fetchConversations = async () => {
            try {
                const response = await axios.get(`/api/messages/conversations/${user.id}`);
                if (response.data.success) {
                    setConversations(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };

        fetchConversations();
        const interval = setInterval(fetchConversations, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, [user, messages]); // Refresh when messages change

    // Fetch active chat messages
    useEffect(() => {
        if (!user || !activeChat) return;

        const fetchMessages = async () => {
            try {
                const response = await axios.get(`/api/messages/${user.id}/${activeChat}`);
                if (response.data.success) {
                    setMessages(response.data.data);
                    scrollToBottom();
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Poll every 3s
        return () => clearInterval(interval);
    }, [user, activeChat]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !activeChat || !newMessage.trim()) return;

        try {
            await axios.post('/api/messages', {
                sender_id: user.id,
                receiver_id: activeChat,
                content: newMessage
            });
            setNewMessage('');
            // Refresh messages immediately
            const response = await axios.get(`/api/messages/${user.id}/${activeChat}`);
            if (response.data.success) {
                setMessages(response.data.data);
                scrollToBottom();
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    if (!user) {
        return (
            <Container className="py-5 text-center">
                <h3>Please Sign In to view your messages.</h3>
            </Container>
        );
    }

    return (
        <Container className="py-4" style={{ height: '85vh' }}>
            <Row className="h-100">
                {/* Sidebar: Conversations List */}
                <Col md={4} className="h-100 border-end overflow-auto">
                    <h4 className="mb-3 fw-bold text-primary">Messages</h4>
                    <ListGroup variant="flush">
                        {conversations.map((conv) => (
                            <ListGroup.Item
                                key={conv.other_user_id}
                                action
                                active={activeChat === conv.other_user_id}
                                onClick={() => setActiveChat(conv.other_user_id)}
                                className="border-0 border-bottom py-3"
                            >
                                <div className="d-flex justify-content-between align-items-center">
                                    <h6 className="mb-1 fw-bold">{conv.other_user_name || 'User ' + conv.other_user_id}</h6>
                                    {!conv.is_read && conv.sender_id !== user.id && (
                                        <span className="badge bg-danger rounded-pill">New</span>
                                    )}
                                </div>
                                <small className="text-muted text-truncate d-block">
                                    {conv.sender_id === user.id ? 'You: ' : ''}{conv.last_message}
                                </small>
                            </ListGroup.Item>
                        ))}
                        {conversations.length === 0 && (
                            <p className="text-muted text-center mt-4">No conversations yet.</p>
                        )}
                    </ListGroup>
                </Col>

                {/* Chat Window */}
                <Col md={8} className="h-100 d-flex flex-column">
                    {activeChat ? (
                        <>
                            <div className="flex-grow-1 overflow-auto p-3 bg-light rounded mb-3">
                                {messages.map((msg) => {
                                    const isMe = msg.sender_id === user.id;
                                    return (
                                        <div key={msg.id} className={`d-flex mb-3 ${isMe ? 'justify-content-end' : 'justify-content-start'}`}>
                                            <div
                                                className={`p-3 rounded shadow-sm ${isMe ? 'bg-primary text-white' : 'bg-white text-dark'}`}
                                                style={{ maxWidth: '70%', borderRadius: '15px' }}
                                            >
                                                <p className="mb-0">{msg.content}</p>
                                                <small className={`d-block mt-1 ${isMe ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '0.7rem' }}>
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </small>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            <Form onSubmit={handleSendMessage}>
                                <div className="d-flex gap-2">
                                    <Form.Control
                                        type="text"
                                        placeholder="Type a message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        autoFocus
                                    />
                                    <Button variant="primary" type="submit">Send</Button>
                                </div>
                            </Form>
                        </>
                    ) : (
                        <div className="h-100 d-flex align-items-center justify-content-center text-muted">
                            <h4>Select a conversation to start chatting</h4>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default ChatPage;
