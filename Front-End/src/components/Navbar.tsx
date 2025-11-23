import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axios from 'axios';

function AppNavbar() {
    const { user, logout } = useUser();
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        const fetchUnread = async () => {
            try {
                const response = await axios.get(`/api/messages/unread/${user.id}`);
                if (response.data.success) {
                    setUnreadCount(response.data.count);
                }
            } catch (error) {
                console.error('Error fetching unread count', error);
            }
        };

        fetchUnread();
        const interval = setInterval(fetchUnread, 10000); // Check every 10s
        return () => clearInterval(interval);
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <Navbar expand="lg" className="navbar-custom mb-0">
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">Baruch TBT</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link as={Link} to="/" className="mx-2">Marketplace</Nav.Link>
                        <Nav.Link as={Link} to="/sell" className="mx-2">Sell Textbook</Nav.Link>
                        <Nav.Link as={Link} to="/community" className="mx-2">Community</Nav.Link>

                        <Nav.Link as={Link} to={user ? "/chat" : "/login"} className="mx-2 position-relative">
                            Chat
                            {user && unreadCount > 0 && (
                                <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle" style={{ fontSize: '0.6rem' }}>
                                    {unreadCount}
                                </Badge>
                            )}
                        </Nav.Link>

                        {user ? (
                            <div className="d-flex align-items-center ms-3">
                                <span className="text-white me-3">Hi, {user.name}</span>
                                <button onClick={handleLogout} className="btn btn-outline-light btn-sm">Sign Out</button>
                            </div>
                        ) : (
                            <Nav.Link as={Link} to="/login" className="btn btn-outline-light ms-2 px-4 text-white">Sign In</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AppNavbar;
