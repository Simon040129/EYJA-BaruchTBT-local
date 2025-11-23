import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import axios from 'axios';

interface Textbook {
    id: number;
    title: string;
    subject: string;
    course_number: string;
    condition_status: string;
    price: number;
    seller_contact: string;
    seller_id?: number;
    description: string;
    image_url?: string;
    created_at: string;
}

function TextbookDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [textbook, setTextbook] = useState<Textbook | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTextbook = async () => {
            try {
                const response = await axios.get(`/api/textbooks/${id}`);
                if (response.data.success) {
                    setTextbook(response.data.data);
                }
            } catch (err) {
                console.error('Error fetching textbook:', err);
                setError('Failed to load textbook details.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchTextbook();
        }
    }, [id]);

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </Container>
        );
    }

    if (error || !textbook) {
        return (
            <Container className="py-5 text-center">
                <div className="alert alert-danger">{error || 'Textbook not found'}</div>
                <Link to="/" className="btn btn-primary">Back to Home</Link>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Link to="/" className="text-decoration-none text-muted mb-4 d-inline-block">
                &larr; Back to Listings
            </Link>

            <Row>
                <Col md={5} className="mb-4">
                    <div className="bg-white p-2 rounded shadow-sm">
                        <img
                            src={textbook.image_url || "https://via.placeholder.com/400x500?text=No+Image"}
                            alt={textbook.title}
                            className="img-fluid rounded w-100"
                            style={{ objectFit: 'cover', maxHeight: '500px' }}
                        />
                    </div>
                </Col>

                <Col md={7}>
                    <div className="ps-md-4">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <Badge bg="secondary" className="fs-6">{textbook.subject} {textbook.course_number}</Badge>
                            <span className="text-muted small">Listed on {new Date(textbook.created_at).toLocaleDateString()}</span>
                        </div>

                        <h1 className="fw-bold mb-3 text-primary">{textbook.title}</h1>
                        <h2 className="text-success fw-bold mb-4">${textbook.price}</h2>

                        <Card className="mb-4 border-0 shadow-sm bg-light">
                            <Card.Body>
                                <h5 className="fw-bold mb-3">Details</h5>
                                <Row className="mb-2">
                                    <Col sm={4} className="text-muted">Condition</Col>
                                    <Col sm={8} className="fw-medium">{textbook.condition_status}</Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col sm={4} className="text-muted">Subject</Col>
                                    <Col sm={8} className="fw-medium">{textbook.subject}</Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col sm={4} className="text-muted">Course</Col>
                                    <Col sm={8} className="fw-medium">{textbook.course_number}</Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        <div className="mb-4">
                            <h5 className="fw-bold">Description</h5>
                            <p className="text-muted">{textbook.description || "No description provided."}</p>
                        </div>

                        <div className="d-grid gap-2 d-md-flex">
                            <Button
                                variant="primary"
                                size="lg"
                                className="px-5 w-100"
                                onClick={() => {
                                    if (textbook.seller_id) {
                                        // We have a linked user, go to chat with them
                                        navigate(`/chat?sellerId=${textbook.seller_id}`);
                                    } else {
                                        // Fallback if seller is not a registered user (legacy listings)
                                        alert("This seller hasn't created a user account yet. Please contact them via email: " + textbook.seller_contact);
                                    }
                                }}
                            >
                                Contact Seller
                            </Button>
                        </div>

                        <div className="mt-3 text-muted small">
                            <i className="bi bi-envelope-fill me-2"></i>
                            Seller Contact: {textbook.seller_contact}
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default TextbookDetailsPage;
