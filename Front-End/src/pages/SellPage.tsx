import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SellPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        course_number: '',
        condition_status: 'Used',
        price: '',
        seller_contact: '',
        description: '',
        image_url: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/textbooks', formData);
            if (response.data.success) {
                navigate('/');
            }
        } catch (err: any) {
            console.error('SellPage Error:', err);
            setError(err.response?.data?.message || 'Error listing textbook');
        }
    };

    return (
        <Container className="mb-5">
            <div className="py-4 text-center">
                <h2 className="fw-bold text-primary">Sell Your Textbook</h2>
                <p className="text-muted">Fill out the details below to list your book for sale.</p>
            </div>

            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-sm p-4">
                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <Form.Group>
                                        <Form.Label>Textbook Title</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g. Calculus: Early Transcendentals"
                                        />
                                    </Form.Group>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <Form.Group>
                                        <Form.Label>Subject</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder="e.g. MTH"
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <Form.Group>
                                        <Form.Label>Course Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="course_number"
                                            value={formData.course_number}
                                            onChange={handleChange}
                                            placeholder="e.g. 2003"
                                        />
                                    </Form.Group>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <Form.Group>
                                        <Form.Label>Condition</Form.Label>
                                        <Form.Select
                                            name="condition_status"
                                            value={formData.condition_status}
                                            onChange={handleChange}
                                        >
                                            <option value="New">New</option>
                                            <option value="Used">Used</option>
                                            <option value="Worn-out">Worn-out</option>
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <Form.Group>
                                        <Form.Label>Price ($)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            required
                                            placeholder="0.00"
                                        />
                                    </Form.Group>
                                </div>
                            </div>

                            <Form.Group className="mb-3">
                                <Form.Label>Seller Contact (Email/Phone)</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="seller_contact"
                                    value={formData.seller_contact}
                                    onChange={handleChange}
                                    required
                                    placeholder="How should buyers contact you?"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Any additional details about the book..."
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label>Image URL (Optional)</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="image_url"
                                    value={formData.image_url}
                                    onChange={handleChange}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </Form.Group>

                            <div className="d-grid gap-2">
                                <Button variant="primary" size="lg" type="submit">
                                    List Textbook
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default SellPage;
