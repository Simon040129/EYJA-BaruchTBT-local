import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';

interface Post {
    id: number;
    content: string;
    author_name: string;
    category: string;
    created_at: string;
}

function CommunityPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPost, setNewPost] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [category, setCategory] = useState('General');
    const [error, setError] = useState('');

    const fetchPosts = async () => {
        try {
            const response = await axios.get('/api/posts');
            if (response.data.success) {
                setPosts(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/posts', {
                content: newPost,
                author_name: authorName,
                category: category
            });
            if (response.data.success) {
                setNewPost('');
                setAuthorName('');
                setCategory('General');
                fetchPosts(); // Refresh list
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error creating post');
        }
    };

    return (
        <Container className="mb-5">
            <div className="py-4">
                <h2 className="fw-bold text-primary mb-4">Community Discussion</h2>

                <Row>
                    <Col md={4} className="mb-4">
                        <Card className="shadow-sm border-0 bg-light sticky-top" style={{ top: '20px', zIndex: 1 }}>
                            <Card.Body>
                                <Card.Title className="mb-3">Start a Discussion</Card.Title>
                                {error && <Alert variant="danger">{error}</Alert>}
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Category</Form.Label>
                                        <Form.Select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="border-0 shadow-sm"
                                        >
                                            <option value="General">General</option>
                                            <option value="Course Question">Course Question</option>
                                            <option value="Book Request">Book Request</option>
                                            <option value="Professor Review">Professor Review</option>
                                            <option value="Other">Other</option>
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            placeholder="Ask a question or share something..."
                                            value={newPost}
                                            onChange={(e) => setNewPost(e.target.value)}
                                            required
                                            className="border-0 shadow-sm"
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            type="text"
                                            placeholder="Your Name (Optional)"
                                            value={authorName}
                                            onChange={(e) => setAuthorName(e.target.value)}
                                            className="border-0 shadow-sm"
                                        />
                                    </Form.Group>
                                    <div className="d-grid">
                                        <Button variant="primary" type="submit">Post Message</Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={8}>
                        <h4 className="mb-3">Recent Posts</h4>
                        <div className="d-flex flex-column gap-3">
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <Card key={post.id} className="shadow-sm border-0">
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <div>
                                                    <span className="badge bg-secondary me-2">{post.category || 'General'}</span>
                                                    <span className="fw-bold text-primary">{post.author_name || 'Anonymous'}</span>
                                                </div>
                                                <small className="text-muted">{new Date(post.created_at).toLocaleDateString()}</small>
                                            </div>
                                            <Card.Text className="fs-5 mt-2">{post.content}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                ))
                            ) : (
                                <p className="text-muted">No posts yet. Be the first to start a discussion!</p>
                            )}
                        </div>
                    </Col>
                </Row>
            </div>
        </Container>
    );
}

export default CommunityPage;
