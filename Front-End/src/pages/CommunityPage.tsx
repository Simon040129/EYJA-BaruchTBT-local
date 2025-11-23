import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';

interface Post {
    id: number;
    content: string;
    author_name: string;
    created_at: string;
}

function CommunityPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPost, setNewPost] = useState('');
    const [authorName, setAuthorName] = useState('');
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
                author_name: authorName
            });
            if (response.data.success) {
                setNewPost('');
                setAuthorName('');
                fetchPosts(); // Refresh list
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error creating post');
        }
    };

    return (
        <Container>
            <h2 className="mb-4">Community Discussion</h2>

            <Card className="mb-4 bg-light">
                <Card.Body>
                    <Card.Title>Start a Discussion</Card.Title>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="What's on your mind?"
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Your Name (Optional)"
                                value={authorName}
                                onChange={(e) => setAuthorName(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">Post</Button>
                    </Form>
                </Card.Body>
            </Card>

            <div className="d-flex flex-column gap-3">
                {posts.map((post) => (
                    <Card key={post.id}>
                        <Card.Body>
                            <Card.Text>{post.content}</Card.Text>
                            <Card.Footer className="text-muted">
                                Posted by {post.author_name || 'Anonymous'} on {new Date(post.created_at).toLocaleDateString()}
                            </Card.Footer>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </Container>
    );
}

export default CommunityPage;
