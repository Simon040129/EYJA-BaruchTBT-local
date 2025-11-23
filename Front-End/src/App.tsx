import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SellPage from './pages/SellPage';
import CommunityPage from './pages/CommunityPage';

function App() {
  return (
    <Router>
      <div className="min-vh-100 d-flex flex-column">
        <AppNavbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sell" element={<SellPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/textbook/:id" element={<div>Textbook Details (Coming Soon)</div>} />
          </Routes>
        </main>
        <footer className="bg-light py-3 text-center mt-auto">
          <p className="mb-0">&copy; 2024 Baruch Textbook Trading</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
