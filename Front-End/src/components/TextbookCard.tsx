import Card from 'react-bootstrap/Card';
// import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

interface TextbookProps {
    id: number;
    title: string;
    price: number;
    condition_status: string;
    course_number: string;
    image_url?: string;
}

function TextbookCard({ textbook }: { textbook: TextbookProps }) {
    return (
        <Card className="h-100 shadow-sm">
            <Card.Img
                variant="top"
                src={textbook.image_url || "https://via.placeholder.com/150?text=No+Image"}
                style={{ height: '200px', objectFit: 'cover' }}
            />
            <Card.Body>
                <Card.Title>{textbook.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{textbook.course_number}</Card.Subtitle>
                <Card.Text>
                    <strong>Price:</strong> ${textbook.price}<br />
                    <strong>Condition:</strong> {textbook.condition_status}
                </Card.Text>
                <Link to={`/textbook/${textbook.id}`} className="btn btn-primary">View Details</Link>
            </Card.Body>
        </Card>
    );
}

export default TextbookCard;
