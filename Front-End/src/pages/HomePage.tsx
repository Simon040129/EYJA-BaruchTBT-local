import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
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

    return (
        <Container>
            <div className="p-5 mb-4 bg-light rounded-3 text-center">
                <h1 className="display-5 fw-bold">Baruch Textbook Trading</h1>
                <p className="fs-4">Save money by trading textbooks with your classmates!</p>
            </div>

            <h2 className="mb-4">Recent Listings</h2>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {textbooks.map((textbook) => (
                        <Col key={textbook.id}>
                            <TextbookCard textbook={textbook} />
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}

export default HomePage;
