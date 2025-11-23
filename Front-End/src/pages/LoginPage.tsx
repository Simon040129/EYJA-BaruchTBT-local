import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import { useUser } from '../context/UserContext';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const { login } = useUser();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            // Use the new dedicated login endpoint
            const response = await axios.post('/api/users/login', { email });

            if (response.data.success) {
                login(response.data.data);
                navigate('/');
            }
        } catch (err: any) {
            console.error(err);
            if (err.response && err.response.status === 404) {
                // User not found, try to auto-create for testing convenience
                try {
                    const signupRes = await axios.post('/api/users', {
                        name: email.split('@')[0],
                        email: email,
                        age: 20,
                        city: 'New York'
                    });
                    if (signupRes.data.success) {
                        // Auto-login after creation
                        // The create response might just be { success: true, message: '...' }
                        // So we try to login again immediately
                        const retryLogin = await axios.post('/api/users/login', { email });
                        if (retryLogin.data.success) {
                            login(retryLogin.data.data);
                            navigate('/');
                            return;
                        }
                    }
                } catch (signupErr: any) {
                    console.error("Auto-signup error details:", signupErr);
                    const errorMsg = signupErr.response?.data?.message || signupErr.message || 'Unknown error';
                    const detailedError = signupErr.response?.data?.error || '';
                    setError(`User not found and failed to auto-create. Server responded: ${errorMsg} ${detailedError ? `(${detailedError})` : ''}`);
                }
            } else {
                setError('Login failed. Please try again.');
            }
        }
    };

    return (
        <Container className="py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <Card className="shadow-sm">
                        <Card.Body className="p-4">
                            <h2 className="text-center mb-4 fw-bold text-primary">Sign In</h2>
                            {error && <Alert variant="info">{error}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <Form.Text className="text-muted">
                                        For testing, enter any email. If it doesn't exist, we'll create a test user for you.
                                    </Form.Text>
                                </Form.Group>

                                <div className="d-grid">
                                    <Button variant="primary" size="lg" type="submit">
                                        Sign In
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </Container>
    );
}

export default LoginPage;
