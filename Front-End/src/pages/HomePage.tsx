import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import TextbookCard from '../components/TextbookCard';

interface Textbook {
    id: number;
    title: string;
    price: number;
    condition_status: string;
    course_number: string;
    image_url?: string;
}

function HomePage() {
    const [textbooks, setTextbooks] = useState<Textbook[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchTextbooks = async () => {
            try {
                const response = await axios.get('/api/textbooks');
                if (response.data.success) {
                    setTextbooks(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching textbooks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTextbooks();
    }, []);

    const filteredTextbooks = textbooks.filter(textbook =>
        textbook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        textbook.course_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="hero-section text-center">
                <Container>
                    <h1 className="display-4 fw-bold mb-3 text-white">Baruch Textbook Trading</h1>
                    <p className="lead mb-4 text-white-50">The easiest way to buy and sell textbooks at Baruch College.</p>
                    <div className="d-flex justify-content-center">
                        <InputGroup className="mb-3 w-50">
                            <Form.Control
                                placeholder="Search by title or course number..."
                                size="lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button variant="warning" id="button-addon2">
                                Search
                            </Button>
                        </InputGroup>
                    </div>
                </Container>
            </div>

            <Container className="mb-5">
                <h2 className="mb-4 border-bottom pb-2">Recent Listings</h2>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {filteredTextbooks.length > 0 ? (
                            filteredTextbooks.map((textbook) => (
                                <Col key={textbook.id}>
                                    <TextbookCard textbook={textbook} />
                                </Col>
                            ))
                        ) : (
                            <Col xs={12}>
                                <p className="text-center text-muted fs-5">No textbooks found matching your search.</p>
                            </Col>
                        )}
                    </Row>
                )}
            </Container>
        </>
    );
}

export default HomePage;
