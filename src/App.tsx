import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import GiveService from './pages/GiveService';
import ServiceList from './pages/ServiceList';
import HowItWorks from './pages/HowItWorks';
import Profile from './pages/Profile';
import BookService from './pages/BookService';
import Payment from './pages/Payment';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-primary-50">
          <Header />
          <main className="pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/services" element={<ServiceList />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/give"
                element={
                  <ProtectedRoute>
                    <GiveService />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/book/:id"
                element={
                  <ProtectedRoute>
                    <BookService />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment"
                element={
                  <ProtectedRoute>
                    <Payment />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              success: {
                style: {
                  background: '#3D8B8B',
                  color: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}